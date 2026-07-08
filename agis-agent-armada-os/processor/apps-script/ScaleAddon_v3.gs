// ScaleAddon_v3.gs — Add to Processor v2 project
// Add these actions to doPost routing:
// blocker.report, scale.evaluate, recruit.request, expert.register, skill.revise

const SCALE_HEADERS = {
  Blockers: ['blockerId','jobId','missionId','blockerType','summary','currentAgent','attemptedFix','whyFailed','recommendedScaleLevel','expertNeeded','approvalRequired','status','createdAt','resolvedAt'],
  RecruitRequests: ['recruitId','jobId','missionId','blockerId','requestedBy','scaleLevel','expertRole','specialty','inputNeeded','outputContract','authorityLimit','approvalRequired','approvedBy','status','createdAt','completedAt'],
  ExpertRegistry: ['expertId','name','tier','specialty','useWhen','authorityLimit','skillMdPath','backupAgent','status','createdAt','deactivatedAt'],
  SkillRevisions: ['revisionId','skillName','skillPath','reason','changeSummary','evidenceUrl','versionBefore','versionAfter','reviewedBy','approvedBy','status','createdAt']
};

function setupScaleSheets() {
  const ss = getSpreadsheet();
  Object.keys(SCALE_HEADERS).forEach(name => {
    let sh = ss.getSheetByName(name);
    if (!sh) sh = ss.insertSheet(name);
    if (sh.getLastRow() === 0) sh.appendRow(SCALE_HEADERS[name]);
  });
  logEvent('', 'SYSTEM', 'scale.setup', 'ตั้งค่า Scale tabs สำเร็จ', 'Scale tabs setup completed');
  return { ok: true, message: 'Scale sheets setup completed' };
}

function reportBlocker(payload) {
  setupScaleSheets();
  if (!payload.jobId || !payload.missionId || !payload.blockerType || !payload.attemptedFix || !payload.whyFailed) {
    return { ok: false, error: 'jobId, missionId, blockerType, attemptedFix, whyFailed required' };
  }
  const evaluation = evaluateScaleFromPayload(payload);
  const blocker = {
    blockerId: makeId('BLK'),
    jobId: payload.jobId,
    missionId: payload.missionId,
    blockerType: payload.blockerType,
    summary: payload.summary || '',
    currentAgent: payload.currentAgent || '',
    attemptedFix: payload.attemptedFix,
    whyFailed: payload.whyFailed,
    recommendedScaleLevel: evaluation.scaleLevel,
    expertNeeded: evaluation.expertNeeded,
    approvalRequired: evaluation.approvalRequired,
    status: 'Open',
    createdAt: new Date().toISOString(),
    resolvedAt: ''
  };
  appendScaleObject('Blockers', blocker);
  logEvent(blocker.jobId, blocker.currentAgent, 'blocker.report', 'พบ blocker: ' + blocker.summary, 'Blocker reported: ' + blocker.summary);
  return { ok: true, blockerId: blocker.blockerId, blocker, evaluation };
}

function evaluateScale(payload) {
  setupScaleSheets();
  const blocker = findScaleById('Blockers', 'blockerId', payload.blockerId);
  if (!blocker) return { ok: false, error: 'Blocker not found', blockerId: payload.blockerId };
  const evaluation = evaluateScaleFromPayload(blocker);
  updateScaleById('Blockers', 'blockerId', payload.blockerId, {
    recommendedScaleLevel: evaluation.scaleLevel,
    expertNeeded: evaluation.expertNeeded,
    approvalRequired: evaluation.approvalRequired,
    status: 'Evaluated'
  });
  logEvent(blocker.jobId, 'Navi Map', 'scale.evaluate', 'ประเมิน scale level: ' + evaluation.scaleLevel, 'Scale evaluated: ' + evaluation.scaleLevel);
  return { ok: true, blockerId: payload.blockerId, evaluation };
}

function requestRecruit(payload) {
  setupScaleSheets();
  if (!payload.jobId || !payload.missionId || !payload.blockerId || !payload.expertRole) {
    return { ok: false, error: 'jobId, missionId, blockerId, expertRole required' };
  }
  const scaleLevel = payload.scaleLevel || 'Specialist';
  const approvalRequired = Boolean(payload.approvalRequired || /Warlord|Emperor/.test(scaleLevel));
  const request = {
    recruitId: makeId('RCT'),
    jobId: payload.jobId,
    missionId: payload.missionId,
    blockerId: payload.blockerId,
    requestedBy: payload.requestedBy || 'Captain AGIS',
    scaleLevel,
    expertRole: payload.expertRole,
    specialty: payload.specialty || '',
    inputNeeded: payload.inputNeeded || '',
    outputContract: payload.outputContract || '',
    authorityLimit: payload.authorityLimit || 'review/recommend only',
    approvalRequired,
    approvedBy: payload.approvedBy || '',
    status: approvalRequired ? 'Requested' : 'Approved',
    createdAt: new Date().toISOString(),
    completedAt: ''
  };
  appendScaleObject('RecruitRequests', request);
  updateScaleById('Blockers', 'blockerId', payload.blockerId, { status: 'RecruitRequested' });
  logEvent(request.jobId, request.requestedBy, 'recruit.request', 'ขอเพิ่มผู้เชี่ยวชาญ: ' + request.expertRole, 'Recruit requested: ' + request.expertRole);
  return { ok: true, recruitId: request.recruitId, request };
}

function registerExpert(payload) {
  setupScaleSheets();
  if (!payload.name || !payload.tier || !payload.specialty) {
    return { ok: false, error: 'name, tier, specialty required' };
  }
  const expert = {
    expertId: payload.expertId || makeId('EXP'),
    name: payload.name,
    tier: payload.tier,
    specialty: payload.specialty,
    useWhen: payload.useWhen || '',
    authorityLimit: payload.authorityLimit || 'review/recommend only',
    skillMdPath: payload.skillMdPath || '',
    backupAgent: payload.backupAgent || 'Jin Guard',
    status: 'Active',
    createdAt: new Date().toISOString(),
    deactivatedAt: ''
  };
  appendScaleObject('ExpertRegistry', expert);
  logEvent('', 'Captain AGIS', 'expert.register', 'เพิ่ม expert: ' + expert.name, 'Expert registered: ' + expert.name);
  return { ok: true, expertId: expert.expertId, expert };
}

function reviseSkill(payload) {
  setupScaleSheets();
  if (!payload.skillName || !payload.skillPath || !payload.reason || !payload.evidenceUrl) {
    return { ok: false, error: 'skillName, skillPath, reason, evidenceUrl required' };
  }
  const revision = {
    revisionId: makeId('REV'),
    skillName: payload.skillName,
    skillPath: payload.skillPath,
    reason: payload.reason,
    changeSummary: payload.changeSummary || '',
    evidenceUrl: payload.evidenceUrl,
    versionBefore: payload.versionBefore || '',
    versionAfter: payload.versionAfter || '',
    reviewedBy: payload.reviewedBy || 'Bug Doctor',
    approvedBy: payload.approvedBy || 'Captain AGIS',
    status: payload.status || 'Review',
    createdAt: new Date().toISOString()
  };
  appendScaleObject('SkillRevisions', revision);
  logEvent('', revision.reviewedBy, 'skill.revise', 'บันทึกการ revise skill: ' + revision.skillName, 'Skill revision recorded: ' + revision.skillName);
  return { ok: true, revisionId: revision.revisionId, revision };
}

function evaluateScaleFromPayload(p) {
  const text = JSON.stringify(p).toLowerCase();
  if (/legal|medical|finance|cyber|security|privacy|policy|public deploy|cost/.test(text)) {
    return { scaleLevel: 'Warlord', expertNeeded: inferExpert(text), approvalRequired: true };
  }
  if (/architecture|organization|enterprise|strategy|ระบบองค์กร/.test(text)) {
    return { scaleLevel: 'Emperor', expertNeeded: 'Strategy/Tech/Data Board', approvalRequired: true };
  }
  if (/qa fail|fail ซ้ำ|skill gap|tool gap|permission|data engineering|video production/.test(text)) {
    return { scaleLevel: 'Specialist', expertNeeded: inferExpert(text), approvalRequired: false };
  }
  return { scaleLevel: 'Clone', expertNeeded: 'Clone or Hat Switch', approvalRequired: false };
}

function inferExpert(text) {
  if (/cyber|security/.test(text)) return 'Cybersecurity Guard';
  if (/legal|policy/.test(text)) return 'Legal/Policy Reviewer';
  if (/medical|nursing|แพทย์|พยาบาล/.test(text)) return 'Medical/Nursing Domain Reviewer';
  if (/finance|loan|tax|เงิน|ภาษี/.test(text)) return 'Financial Risk Reviewer';
  if (/architecture|cloud|deploy/.test(text)) return 'Cloud Architect';
  if (/data|schema|bigdata|sheet|database/.test(text)) return 'Data Engineer';
  if (/video|clip|ตัดต่อ/.test(text)) return 'Video Production Specialist';
  if (/seo|marketing|shopee|affiliate/.test(text)) return 'Growth/SEO Specialist';
  return 'Specialist Expert';
}

function appendScaleObject(sheetName, obj) {
  const sh = getSpreadsheet().getSheetByName(sheetName);
  const headers = SCALE_HEADERS[sheetName];
  sh.appendRow(headers.map(h => obj[h] !== undefined ? obj[h] : ''));
}

function readScaleObjects(sheetName) {
  const sh = getSpreadsheet().getSheetByName(sheetName);
  if (!sh || sh.getLastRow() < 2) return [];
  const values = sh.getDataRange().getValues();
  const headers = values.shift();
  return values.map(row => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });
}

function findScaleById(sheetName, idField, idValue) {
  return readScaleObjects(sheetName).find(o => String(o[idField]) === String(idValue));
}

function updateScaleById(sheetName, idField, idValue, updates) {
  const sh = getSpreadsheet().getSheetByName(sheetName);
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
