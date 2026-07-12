const AGIS_VERSION = '2.0.0';

const SPREADSHEET_ID =
  PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID') ||
  '1sMX_t9a2pYFGnSGi9ICmC4OTYNjJ7wE96bd3RQ-7yb0';

const OUTPUT_FOLDER_ID =
  PropertiesService.getScriptProperties().getProperty('OUTPUT_FOLDER_ID') ||
  '1RhkFs7BRb1A9MBL7CumaTdtc1uNXX2w9';

const SHEETS = {
  JOBS: 'Jobs',
  MISSIONS: 'Missions',
  AGENTS: 'Agents',
  RECEIPTS: 'Receipts',
  CONFIG: 'Config',
  OUTPUTS: 'Outputs',
  CHAT: 'Chat'
};

const HEADERS = {
  Jobs: [
    'jobId','bossCommand','onePiece','jobType','difficulty','priority',
    'loopMode','hatSet','ownerAgent','status','evidenceRequired',
    'approvalRequired','createdAt','updatedAt'
  ],
  Missions: [
    'missionId','jobId','title','ownerAgent','supportAgents','status',
    'evidenceUrl','xpReward','dueDate','createdAt','updatedAt'
  ],
  Receipts: [
    'receiptId','jobId','missionId','evidence','testResult','decision',
    'risk','approvalStatus','summaryTH','summaryEN','createdAt'
  ],
  Outputs: [
    'outputId','jobId','missionId','receiptId','folderId','fileId',
    'fileName','mimeType','sizeBytes','webViewUrl','sha256','status','createdAt'
  ],
  Chat: [
    'chatId','jobId','missionId','author','target','message','type','createdAt'
  ]
};

function doGet(e) {
  const action = e && e.parameter ? String(e.parameter.action || '') : '';
  if (action === 'output.list') return jsonResponse(listOutputs(e.parameter || {}));
  if (action === 'chat.list') return jsonResponse(listChat(e.parameter || {}));

  return jsonResponse({
    ok: true,
    system: 'AGIS Agent Armada Processor',
    version: AGIS_VERSION,
    spreadsheetId: SPREADSHEET_ID,
    outputFolderId: OUTPUT_FOLDER_ID,
    actions: [
      'setup',
      'job.create',
      'job.route',
      'mission.update',
      'receipt.create',
      'dashboard.state',
      'output.save',
      'output.list',
      'chat.append',
      'chat.list'
    ]
  });
}

function doPost(e) {
  try {
    const body = parseBody(e);
    const action = String(body.action || '');
    const payload = body.payload || {};

    const routes = {
      'setup': setup,
      'job.create': createJob,
      'job.route': routeJob,
      'mission.update': updateMission,
      'receipt.create': createReceipt,
      'dashboard.state': dashboardState,
      'output.save': saveOutput,
      'output.list': listOutputs,
      'chat.append': appendChat,
      'chat.list': listChat
    };

    if (!routes[action]) {
      return jsonResponse({ ok: false, error: 'Unknown action', action: action });
    }

    return jsonResponse(routes[action](payload));
  } catch (err) {
    return jsonResponse({
      ok: false,
      error: String(err),
      stack: err && err.stack ? String(err.stack) : ''
    });
  }
}

function parseBody(e) {
  if (!e || !e.postData || !e.postData.contents) return {};
  const text = String(e.postData.contents || '').trim();
  if (!text) return {};
  return JSON.parse(text);
}

function setup() {
  const ss = getSS();

  Object.keys(SHEETS).forEach(function(key) {
    const name = SHEETS[key];
    let sheet = ss.getSheetByName(name);
    if (!sheet) sheet = ss.insertSheet(name);

    const headers = HEADERS[name];
    if (headers && sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.setFrozenRows(1);
    }
  });

  const folder = getOutputRootFolder();

  return {
    ok: true,
    version: AGIS_VERSION,
    message: 'Processor v2 setup checked',
    spreadsheetUrl: ss.getUrl(),
    outputFolderId: folder.getId(),
    outputFolderUrl: folder.getUrl(),
    sheets: Object.values(SHEETS)
  };
}

function createJob(payload) {
  const now = new Date().toISOString();
  const jobType = payload.jobType || classifyJobType(payload.bossCommand || '');
  const routing = routeProfile(jobType);

  const job = {
    jobId: makeId('JOB'),
    bossCommand: cleanText(payload.bossCommand, 5000),
    onePiece: cleanText(payload.onePiece || payload.goal || 'Define One Goal', 2000),
    jobType: jobType,
    difficulty: payload.difficulty || routing.difficulty,
    priority: payload.priority || 'Medium',
    loopMode: payload.loopMode || routing.loopMode,
    hatSet: payload.hatSet || routing.hatSet,
    ownerAgent: payload.ownerAgent || routing.ownerAgent,
    status: 'Intake',
    evidenceRequired: true,
    approvalRequired: needsApproval(payload),
    createdAt: now,
    updatedAt: now
  };

  appendObject('Jobs', job);
  return { ok: true, jobId: job.jobId, job: job };
}

function routeJob(payload) {
  const job = findById('Jobs', 'jobId', payload.jobId);
  if (!job) return { ok: false, error: 'Job not found', jobId: payload.jobId };

  const routing = routeProfile(job.jobType);
  const missions = starterMissions(job, routing);
  missions.forEach(function(mission) {
    appendObject('Missions', mission);
  });

  updateById('Jobs', 'jobId', job.jobId, {
    status: 'Working',
    updatedAt: new Date().toISOString()
  });

  return { ok: true, jobId: job.jobId, missions: missions };
}

function updateMission(payload) {
  const mission = findById('Missions', 'missionId', payload.missionId);
  if (!mission) {
    return { ok: false, error: 'Mission not found', missionId: payload.missionId };
  }

  const status = cleanText(payload.status || mission.status, 100);
  const evidenceUrl = cleanText(payload.evidenceUrl || mission.evidenceUrl || '', 3000);

  if (String(status).toLowerCase() === 'done' && !evidenceUrl) {
    return {
      ok: false,
      error: 'Evidence required before Done',
      missionId: payload.missionId
    };
  }

  updateById('Missions', 'missionId', payload.missionId, {
    status: status,
    evidenceUrl: evidenceUrl,
    updatedAt: new Date().toISOString()
  });

  return {
    ok: true,
    missionId: payload.missionId,
    status: status,
    evidenceUrl: evidenceUrl
  };
}

function createReceipt(payload) {
  const evidence = cleanText(payload.evidence || payload.evidenceUrl || '', 5000);
  if (!evidence) return { ok: false, error: 'Receipt requires evidence' };

  const receipt = {
    receiptId: makeId('REC'),
    jobId: cleanText(payload.jobId || '', 200),
    missionId: cleanText(payload.missionId || '', 200),
    evidence: evidence,
    testResult: cleanText(payload.testResult || 'Pending', 500),
    decision: cleanText(payload.decision || '', 1000),
    risk: cleanText(payload.risk || 'Low', 100),
    approvalStatus: cleanText(payload.approvalStatus || 'NotRequired', 100),
    summaryTH: cleanText(payload.summaryTH || '', 5000),
    summaryEN: cleanText(payload.summaryEN || '', 5000),
    createdAt: new Date().toISOString()
  };

  appendObject('Receipts', receipt);
  return { ok: true, receiptId: receipt.receiptId, receipt: receipt };
}

function saveOutput(payload) {
  const files = normalizeOutputFiles(payload);
  if (!files.length) return { ok: false, error: 'output.save requires at least one file' };
  if (files.length > 10) return { ok: false, error: 'Maximum 10 files per save request' };

  const evidence = cleanText(payload.evidence || payload.evidenceUrl || '', 5000);
  const finalOutput = payload.final === true || String(payload.status || '').toLowerCase() === 'final';
  if (finalOutput && !evidence && !payload.receiptId) {
    return { ok: false, error: 'Final output requires evidence or receiptId' };
  }

  const jobId = cleanText(payload.jobId || 'UNASSIGNED', 200);
  const missionId = cleanText(payload.missionId || '', 200);
  const receiptId = cleanText(payload.receiptId || '', 200);
  const root = getOutputRootFolder();
  const jobFolder = getOrCreateChildFolder(root, sanitizeFileName(jobId));
  const saved = [];

  files.forEach(function(item) {
    const fileName = sanitizeFileName(item.fileName || ('AGIS-' + Date.now() + '.txt'));
    const mimeType = cleanText(item.mimeType || MimeType.PLAIN_TEXT, 200);
    const content = String(item.content == null ? '' : item.content);
    const byteCount = Utilities.newBlob(content).getBytes().length;

    if (byteCount > 4 * 1024 * 1024) {
      throw new Error('File too large for Apps Script output.save: ' + fileName);
    }

    const existing = findFileByName(jobFolder, fileName);
    if (existing) existing.setTrashed(true);

    const blob = Utilities.newBlob(content, mimeType, fileName);
    const file = jobFolder.createFile(blob);
    const sha256 = digestHex(content);
    const output = {
      outputId: makeId('OUT'),
      jobId: jobId,
      missionId: missionId,
      receiptId: receiptId,
      folderId: jobFolder.getId(),
      fileId: file.getId(),
      fileName: file.getName(),
      mimeType: mimeType,
      sizeBytes: file.getSize(),
      webViewUrl: file.getUrl(),
      sha256: sha256,
      status: finalOutput ? 'Final' : 'Draft',
      createdAt: new Date().toISOString()
    };

    appendObject('Outputs', output);
    saved.push(output);
  });

  return {
    ok: true,
    action: 'output.save',
    version: AGIS_VERSION,
    jobId: jobId,
    missionId: missionId,
    folderId: jobFolder.getId(),
    folderUrl: jobFolder.getUrl(),
    files: saved
  };
}

function normalizeOutputFiles(payload) {
  if (Array.isArray(payload.files)) {
    return payload.files.map(function(file) {
      return {
        fileName: file.fileName || file.name,
        mimeType: file.mimeType || file.type,
        content: file.content
      };
    }).filter(function(file) {
      return file.fileName && file.content != null;
    });
  }

  if (payload.fileName && payload.content != null) {
    return [{
      fileName: payload.fileName,
      mimeType: payload.mimeType || MimeType.PLAIN_TEXT,
      content: payload.content
    }];
  }

  return [];
}

function listOutputs(payload) {
  const jobId = cleanText(payload.jobId || '', 200);
  const missionId = cleanText(payload.missionId || '', 200);
  const limit = Math.min(Math.max(Number(payload.limit || 50), 1), 200);
  let outputs = readObjects('Outputs');

  if (jobId) outputs = outputs.filter(function(row) {
    return String(row.jobId) === jobId;
  });
  if (missionId) outputs = outputs.filter(function(row) {
    return String(row.missionId) === missionId;
  });

  return {
    ok: true,
    outputs: outputs.slice(-limit).reverse(),
    count: Math.min(outputs.length, limit)
  };
}

function appendChat(payload) {
  const message = cleanText(payload.message || '', 3000);
  if (!message) return { ok: false, error: 'chat.append requires message' };

  const row = {
    chatId: makeId('CHAT'),
    jobId: cleanText(payload.jobId || '', 200),
    missionId: cleanText(payload.missionId || '', 200),
    author: cleanText(payload.author || 'System', 200),
    target: cleanText(payload.target || 'ALL', 200),
    message: message,
    type: cleanText(payload.type || 'crew', 100),
    createdAt: new Date().toISOString()
  };

  appendObject('Chat', row);
  return { ok: true, chatId: row.chatId, chat: row };
}

function listChat(payload) {
  const jobId = cleanText(payload.jobId || '', 200);
  const missionId = cleanText(payload.missionId || '', 200);
  const limit = Math.min(Math.max(Number(payload.limit || 100), 1), 300);
  let chat = readObjects('Chat');

  if (jobId) chat = chat.filter(function(row) {
    return String(row.jobId) === jobId;
  });
  if (missionId) chat = chat.filter(function(row) {
    return String(row.missionId) === missionId;
  });

  return {
    ok: true,
    chat: chat.slice(-limit),
    count: Math.min(chat.length, limit)
  };
}

function dashboardState() {
  const jobs = readObjects('Jobs');
  const missions = readObjects('Missions');
  const receipts = readObjects('Receipts');
  const outputs = readObjects('Outputs');
  const chat = readObjects('Chat');

  return {
    ok: true,
    version: AGIS_VERSION,
    kpi: {
      jobs: jobs.length,
      missions: missions.length,
      doneMissions: missions.filter(function(m) {
        return String(m.status).toLowerCase() === 'done';
      }).length,
      receipts: receipts.length,
      outputs: outputs.length,
      chatMessages: chat.length,
      evidenceRate: missions.length
        ? Math.round(
            missions.filter(function(m) { return Boolean(m.evidenceUrl); }).length /
            missions.length * 100
          )
        : 0
    },
    jobs: jobs.slice(-20),
    missions: missions.slice(-40),
    receipts: receipts.slice(-20),
    outputs: outputs.slice(-20),
    chat: chat.slice(-100)
  };
}

function classifyJobType(text) {
  const value = String(text).toLowerCase();
  if (/web|app|dashboard|github|lovable|deploy|prototype/.test(value)) return 'Build';
  if (/sop|รายงาน|เอกสาร|pdf|docx|ระเบียบ/.test(value)) return 'Report';
  if (/drive|sheet|data|bigdata|ข้อมูล/.test(value)) return 'Data';
  if (/seo|marketing|ขาย|shopee|affiliate/.test(value)) return 'Marketing';
  if (/video|คลิป|ตัดต่อ|subtitle/.test(value)) return 'Video';
  return 'Research';
}

function routeProfile(jobType) {
  const map = {
    Build: { hatSet: 'P0 Build', ownerAgent: 'Shipwright', loopMode: 'PDCA+OODA', difficulty: 'A' },
    Report: { hatSet: 'Report SOP', ownerAgent: 'Cook', loopMode: 'PDCA', difficulty: 'B' },
    Data: { hatSet: 'Data Sheet', ownerAgent: 'Archaeologist', loopMode: 'PDCA', difficulty: 'A' },
    Marketing: { hatSet: 'Marketing SEO', ownerAgent: 'Sniper', loopMode: 'SWOT+OODA', difficulty: 'A' },
    Video: { hatSet: 'Video Editing', ownerAgent: 'Cook', loopMode: 'Hybrid', difficulty: 'A' },
    Research: { hatSet: 'Research', ownerAgent: 'Archaeologist', loopMode: 'OODA', difficulty: 'B' }
  };

  return map[jobType] || map.Research;
}

function starterMissions(job, routing) {
  const now = new Date().toISOString();
  const rows = [
    ['Define One Goal and acceptance criteria', 'AGIS', 'Fable,Navigator', 50],
    ['Crystallize requirements and specification', 'Fable', 'AGIS,Archaeologist', 60],
    ['Split work and assign route', 'Navigator', 'AGIS,Clone', 60],
    ['Collect evidence and source rules', 'Archaeologist', 'Swordsman,Doctor', 75],
    ['Produce first usable output', routing.ownerAgent, 'Shipwright,Cook,Sniper', 100],
    ['Guard risk, security and permissions', 'Swordsman', 'AGIS,Doctor', 75],
    ['Validate output and evidence gate', 'Doctor', 'Swordsman,AGIS', 90],
    ['Review, receipt, backup and export', 'Clone', 'AGIS,Cook', 80]
  ];

  return rows.map(function(row) {
    return {
      missionId: makeId('MIS'),
      jobId: job.jobId,
      title: row[0],
      ownerAgent: row[1],
      supportAgents: row[2],
      status: 'Todo',
      evidenceUrl: '',
      xpReward: row[3],
      dueDate: '',
      createdAt: now,
      updatedAt: now
    };
  });
}

function needsApproval(payload) {
  const text = JSON.stringify(payload).toLowerCase();
  return /delete|ลบ|public deploy|เผยแพร่|send|ส่งจริง|cost|payment|เงิน/.test(text);
}

function getSS() {
  if (!SPREADSHEET_ID) throw new Error('Missing SPREADSHEET_ID');
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function getOutputRootFolder() {
  if (OUTPUT_FOLDER_ID) {
    try {
      return DriveApp.getFolderById(OUTPUT_FOLDER_ID);
    } catch (err) {
      // Fall through to a folder in My Drive.
    }
  }

  const iterator = DriveApp.getFoldersByName('08_AGIS_Outputs_Exports');
  if (iterator.hasNext()) return iterator.next();
  return DriveApp.createFolder('08_AGIS_Outputs_Exports');
}

function getOrCreateChildFolder(parent, name) {
  const safeName = sanitizeFileName(name || 'UNASSIGNED');
  const iterator = parent.getFoldersByName(safeName);
  if (iterator.hasNext()) return iterator.next();
  return parent.createFolder(safeName);
}

function findFileByName(folder, name) {
  const iterator = folder.getFilesByName(name);
  return iterator.hasNext() ? iterator.next() : null;
}

function sanitizeFileName(name) {
  const value = String(name || 'AGIS-output')
    .replace(/[\\/:*?"<>|#%{}[\]~]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 160);

  return value || 'AGIS-output';
}

function digestHex(content) {
  const digest = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    String(content),
    Utilities.Charset.UTF_8
  );

  return digest.map(function(byte) {
    const value = byte < 0 ? byte + 256 : byte;
    return ('0' + value.toString(16)).slice(-2);
  }).join('');
}

function makeId(prefix) {
  return prefix + '-' +
    Utilities.formatDate(new Date(), 'Asia/Bangkok', 'yyyyMMdd-HHmmss') +
    '-' + Math.floor(Math.random() * 10000);
}

function cleanText(value, maxLength) {
  const text = String(value == null ? '' : value).trim();
  return maxLength ? text.slice(0, maxLength) : text;
}

function jsonResponse(object) {
  return ContentService
    .createTextOutput(JSON.stringify(object, null, 2))
    .setMimeType(ContentService.MimeType.JSON);
}

function appendObject(sheetName, object) {
  const sheet = getSS().getSheetByName(sheetName);
  if (!sheet) throw new Error('Missing sheet: ' + sheetName);

  let headers = HEADERS[sheetName];
  if (!headers) {
    if (sheet.getLastColumn() === 0) throw new Error('Missing headers: ' + sheetName);
    headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  }

  sheet.appendRow(headers.map(function(header) {
    return object[header] !== undefined ? object[header] : '';
  }));
}

function readObjects(sheetName) {
  const sheet = getSS().getSheetByName(sheetName);
  if (!sheet || sheet.getLastRow() < 2 || sheet.getLastColumn() < 1) return [];

  const values = sheet.getDataRange().getValues();
  const headers = values.shift();

  return values
    .filter(function(row) { return row.join('') !== ''; })
    .map(function(row) {
      const object = {};
      headers.forEach(function(header, index) {
        object[header] = row[index];
      });
      return object;
    });
}

function findById(sheetName, idField, idValue) {
  return readObjects(sheetName).find(function(object) {
    return String(object[idField]) === String(idValue);
  });
}

function updateById(sheetName, idField, idValue, updates) {
  const sheet = getSS().getSheetByName(sheetName);
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const idColumn = headers.indexOf(idField) + 1;

  if (idColumn < 1) throw new Error('Missing ID field: ' + idField);

  for (let rowIndex = 2; rowIndex <= values.length; rowIndex += 1) {
    if (String(sheet.getRange(rowIndex, idColumn).getValue()) === String(idValue)) {
      Object.keys(updates).forEach(function(key) {
        const columnIndex = headers.indexOf(key) + 1;
        if (columnIndex > 0) {
          sheet.getRange(rowIndex, columnIndex).setValue(updates[key]);
        }
      });
      return true;
    }
  }

  return false;
}
