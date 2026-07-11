const SPREADSHEET_ID = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID') || '1sMX_t9a2pYFGnSGi9ICmC4OTYNjJ7wE96bd3RQ-7yb0';

const SHEETS = {
  JOBS: 'Jobs',
  MISSIONS: 'Missions',
  AGENTS: 'Agents',
  RECEIPTS: 'Receipts',
  CONFIG: 'Config'
};

const HEADERS = {
  Jobs: ['jobId','bossCommand','onePiece','jobType','difficulty','priority','loopMode','hatSet','ownerAgent','status','evidenceRequired','approvalRequired','createdAt','updatedAt'],
  Missions: ['missionId','jobId','title','ownerAgent','supportAgents','status','evidenceUrl','xpReward','dueDate','createdAt','updatedAt'],
  Receipts: ['receiptId','jobId','missionId','evidence','testResult','decision','risk','approvalStatus','summaryTH','summaryEN','createdAt']
};

const CREW = {
  setup: { owner: 'Shipwright', support: ['AGIS','Doctor','Swordsman'] },
  createJob: { owner: 'AGIS', support: ['Fable','Archaeologist'] },
  route: { owner: 'Navigator', support: ['AGIS','Clone'] },
  evidenceGate: { owner: 'Doctor', support: ['Swordsman','Fable'] },
  receipt: { owner: 'Clone', support: ['Doctor','AGIS'] }
};

function doGet() {
  return jsonResponse({
    ok: true,
    system: 'AGIS Agent Armada P0 Processor',
    version: '0.2.0',
    crew: CREW,
    rule: 'No Evidence = Not Done; QA + Receipt = Done',
    actions: ['setup','job.create','job.route','mission.update','receipt.create','dashboard.state']
  });
}

function doPost(e) {
  try {
    const body = e && e.postData && e.postData.contents ? JSON.parse(e.postData.contents) : {};
    const action = body.action || '';
    const payload = body.payload || {};

    if (action === 'setup') return jsonResponse(setup());
    if (action === 'job.create') return jsonResponse(createJob(payload));
    if (action === 'job.route') return jsonResponse(routeJob(payload));
    if (action === 'mission.update') return jsonResponse(updateMission(payload));
    if (action === 'receipt.create') return jsonResponse(createReceipt(payload));
    if (action === 'dashboard.state') return jsonResponse(dashboardState());

    return jsonResponse({ ok: false, error: 'Unknown action', action });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err), stack: err && err.stack ? err.stack : '' });
  }
}

function setup() {
  const ss = getSS();
  Object.keys(SHEETS).forEach(k => {
    const name = SHEETS[k];
    let sh = ss.getSheetByName(name);
    if (!sh) sh = ss.insertSheet(name);
    if (HEADERS[name] && sh.getLastRow() === 0) sh.appendRow(HEADERS[name]);
  });
  upsertCanonicalCrew();
  return {
    ok: true,
    message: 'P0 setup checked with canonical AGIS crew',
    spreadsheetUrl: ss.getUrl(),
    crew: CREW
  };
}

function createJob(payload) {
  const now = new Date().toISOString();
  const jobType = payload.jobType || classifyJobType(payload.bossCommand || '');
  const routing = routeProfile(jobType);
  const job = {
    jobId: makeId('JOB'),
    bossCommand: payload.bossCommand || '',
    onePiece: payload.onePiece || payload.goal || 'Define One Goal',
    jobType,
    difficulty: payload.difficulty || routing.difficulty,
    priority: payload.priority || 'Medium',
    loopMode: payload.loopMode || routing.loopMode,
    hatSet: payload.hatSet || routing.hatSet,
    ownerAgent: payload.ownerAgent || CREW.createJob.owner,
    status: 'Intake',
    evidenceRequired: true,
    approvalRequired: needsApproval(payload),
    createdAt: now,
    updatedAt: now
  };
  appendObject('Jobs', job);
  return {
    ok: true,
    jobId: job.jobId,
    job,
    crew: CREW.createJob,
    nextStage: CREW.route
  };
}

function routeJob(payload) {
  const job = findById('Jobs', 'jobId', payload.jobId);
  if (!job) return { ok: false, error: 'Job not found', jobId: payload.jobId };
  const routing = routeProfile(job.jobType);
  const missions = starterMissions(job, routing);
  missions.forEach(m => appendObject('Missions', m));
  updateById('Jobs', 'jobId', job.jobId, {
    status: 'Working',
    ownerAgent: CREW.createJob.owner,
    updatedAt: new Date().toISOString()
  });
  return { ok: true, jobId: job.jobId, crew: CREW.route, missions };
}

function updateMission(payload) {
  const mission = findById('Missions', 'missionId', payload.missionId);
  if (!mission) return { ok: false, error: 'Mission not found', missionId: payload.missionId };
  const status = payload.status || mission.status;
  const evidenceUrl = payload.evidenceUrl || mission.evidenceUrl || '';
  if (status === 'Done' && !evidenceUrl) {
    return {
      ok: false,
      error: 'Evidence required before Done',
      missionId: payload.missionId,
      gate: CREW.evidenceGate
    };
  }
  updateById('Missions', 'missionId', payload.missionId, {
    status,
    evidenceUrl,
    updatedAt: new Date().toISOString()
  });
  return {
    ok: true,
    missionId: payload.missionId,
    status,
    evidenceUrl,
    gate: CREW.evidenceGate
  };
}

function createReceipt(payload) {
  const evidence = payload.evidence || payload.evidenceUrl || '';
  if (!evidence) return { ok: false, error: 'Receipt requires evidence', crew: CREW.receipt };
  const receipt = {
    receiptId: makeId('REC'),
    jobId: payload.jobId || '',
    missionId: payload.missionId || '',
    evidence,
    testResult: payload.testResult || 'Pending',
    decision: payload.decision || 'AGIS Final Review',
    risk: payload.risk || 'Low',
    approvalStatus: payload.approvalStatus || 'NotRequired',
    summaryTH: payload.summaryTH || '',
    summaryEN: payload.summaryEN || '',
    createdAt: new Date().toISOString()
  };
  appendObject('Receipts', receipt);
  return { ok: true, receiptId: receipt.receiptId, receipt, crew: CREW.receipt };
}

function dashboardState() {
  const jobs = readObjects('Jobs');
  const missions = readObjects('Missions');
  const receipts = readObjects('Receipts');
  return {
    ok: true,
    version: '0.2.0',
    crew: CREW,
    kpi: {
      jobs: jobs.length,
      missions: missions.length,
      doneMissions: missions.filter(m => m.status === 'Done').length,
      receipts: receipts.length,
      evidenceRate: missions.length ? Math.round((missions.filter(m => m.evidenceUrl).length / missions.length) * 100) : 0
    },
    jobs: jobs.slice(-10),
    missions: missions.slice(-20),
    receipts: receipts.slice(-10)
  };
}

function classifyJobType(text) {
  const t = String(text).toLowerCase();
  if (/web|app|dashboard|github|lovable|deploy|prototype|ระบบ|เว็บ/.test(t)) return 'Build';
  if (/sop|รายงาน|เอกสาร|pdf|docx|ระเบียบ/.test(t)) return 'Report';
  if (/drive|sheet|data|bigdata|ข้อมูล/.test(t)) return 'Data';
  if (/seo|marketing|ขาย|shopee|affiliate/.test(t)) return 'Marketing';
  if (/video|คลิป|ตัดต่อ|subtitle/.test(t)) return 'Video';
  return 'Research';
}

function routeProfile(jobType) {
  const map = {
    Build: { hatSet: 'Build / WebApp', ownerAgent: 'Shipwright', supportAgents: 'Cook,Doctor', loopMode: 'PDCA+OODA', difficulty: 'A' },
    Report: { hatSet: 'Report / SOP', ownerAgent: 'Cook', supportAgents: 'Fable,Doctor', loopMode: 'PDCA', difficulty: 'B' },
    Data: { hatSet: 'Data / State DB', ownerAgent: 'Archaeologist', supportAgents: 'Shipwright,Doctor', loopMode: 'PDCA', difficulty: 'A' },
    Marketing: { hatSet: 'Marketing / Growth', ownerAgent: 'Sniper', supportAgents: 'Cook,Swordsman', loopMode: 'SWOT+OODA', difficulty: 'A' },
    Video: { hatSet: 'Video / Content', ownerAgent: 'Cook', supportAgents: 'Sniper,Doctor', loopMode: 'Hybrid', difficulty: 'A' },
    Research: { hatSet: 'Research / Knowledge', ownerAgent: 'Archaeologist', supportAgents: 'Fable,Doctor', loopMode: 'OODA', difficulty: 'B' }
  };
  return map[jobType] || map.Research;
}

function starterMissions(job, routing) {
  const now = new Date().toISOString();
  const rows = [
    ['Lock One Goal and acceptance criteria', 'Fable', 'AGIS,Archaeologist', 50],
    ['Create Job intake and approve priority', 'AGIS', 'Fable,Archaeologist', 50],
    ['Route missions to the correct crew', 'Navigator', 'AGIS,Clone', 50],
    ['Produce first usable output', routing.ownerAgent, routing.supportAgents, 100],
    ['Validate evidence, quality and risk', 'Doctor', 'Swordsman,Fable', 75],
    ['Create receipt and backup', 'Clone', 'Doctor,AGIS', 75]
  ];
  return rows.map(r => ({
    missionId: makeId('MIS'),
    jobId: job.jobId,
    title: r[0],
    ownerAgent: r[1],
    supportAgents: r[2],
    status: 'Todo',
    evidenceUrl: '',
    xpReward: r[3],
    dueDate: '',
    createdAt: now,
    updatedAt: now
  }));
}

function upsertCanonicalCrew() {
  const sh = getSS().getSheetByName('Agents');
  if (!sh) return;
  const rows = [
    ['AGT-001','Fable','Master Skill Architect','Specification Hat',1,0,'Rookie Sea','standby','spec-and-acceptance',''],
    ['AGT-002','AGIS','Captain / Orchestrator','Command Hat',1,0,'Rookie Sea','working','approval-and-orchestration',''],
    ['AGT-003','Navigator','Routing Agent','Routing Hat',1,0,'Rookie Sea','standby','route-and-workload-balance',''],
    ['AGT-004','Archaeologist','Knowledge / Research','Knowledge Hat',1,0,'Rookie Sea','standby','read-index-research',''],
    ['AGT-005','Shipwright','Builder / Dev','Builder Hat',1,0,'Rookie Sea','working','build-deploy-integrate',''],
    ['AGT-006','Doctor','QA / Debug','QA Hat',1,0,'Rookie Sea','standby','validate-evidence-debug',''],
    ['AGT-007','Swordsman','Risk / Compliance','Security Hat',1,0,'Rookie Sea','standby','risk-security-privacy',''],
    ['AGT-008','Cook','Docs / Graphic / Content','Creative Hat',1,0,'Rookie Sea','standby','document-visual-output',''],
    ['AGT-009','Sniper','Marketing / Growth','Growth Hat',1,0,'Rookie Sea','standby','seo-hook-affiliate',''],
    ['AGT-010','Clone','Scale / Backup','Clone Hat',1,0,'Rookie Sea','standby','parallel-scale-receipt-backup','']
  ];
  if (sh.getMaxRows() < 11) sh.insertRowsAfter(sh.getMaxRows(), 11 - sh.getMaxRows());
  sh.getRange(2, 1, 10, 10).setValues(rows);
}

function needsApproval(payload) {
  const text = JSON.stringify(payload).toLowerCase();
  return /delete|ลบ|public deploy|เผยแพร่|send|ส่งจริง|cost|payment|เงิน/.test(text);
}

function getSS() { return SpreadsheetApp.openById(SPREADSHEET_ID); }
function makeId(prefix) { return prefix + '-' + Utilities.formatDate(new Date(), 'Asia/Bangkok', 'yyyyMMdd-HHmmss') + '-' + Math.floor(Math.random() * 10000); }
function jsonResponse(obj) { return ContentService.createTextOutput(JSON.stringify(obj, null, 2)).setMimeType(ContentService.MimeType.JSON); }

function appendObject(sheetName, obj) {
  const sh = getSS().getSheetByName(sheetName);
  const headers = HEADERS[sheetName] || sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0];
  sh.appendRow(headers.map(h => obj[h] !== undefined ? obj[h] : ''));
}

function readObjects(sheetName) {
  const sh = getSS().getSheetByName(sheetName);
  if (!sh || sh.getLastRow() < 2) return [];
  const values = sh.getDataRange().getValues();
  const headers = values.shift();
  return values.filter(r => r.join('') !== '').map(row => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });
}

function findById(sheetName, idField, idValue) {
  return readObjects(sheetName).find(o => String(o[idField]) === String(idValue));
}

function updateById(sheetName, idField, idValue, updates) {
  const sh = getSS().getSheetByName(sheetName);
  const values = sh.getDataRange().getValues();
  const headers = values[0];
  const idCol = headers.indexOf(idField) + 1;
  for (let r = 2; r <= values.length; r++) {
    if (String(sh.getRange(r, idCol).getValue()) === String(idValue)) {
      Object.keys(updates).forEach(k => {
        const c = headers.indexOf(k) + 1;
        if (c > 0) sh.getRange(r, c).setValue(updates[k]);
      });
      return true;
    }
  }
  return false;
}
