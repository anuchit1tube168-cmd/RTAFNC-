// AGIS Agent Armada Processor v2 — Level Up + Skill Mastery + Clone Agent

const SHEETS = {
  JOBS: 'Jobs', MISSIONS: 'Missions', AGENTS: 'Agents', SKILLS: 'Skills', EVIDENCE: 'Evidence',
  RECEIPTS: 'Receipts', DECISIONS: 'Decisions', LOGS: 'Logs', LEVELS: 'Levels', CONFIG: 'Config',
  CLONES: 'Clones', SKILL_MASTERY: 'SkillMastery', AGENT_SKILL_MAP: 'AgentSkillMap'
};

const HEADERS = {
  Jobs: ['jobId','bossCommand','onePiece','jobType','difficulty','priority','loopMode','hatSet','ownerAgent','status','evidenceRequired','approvalRequired','createdAt','updatedAt'],
  Missions: ['missionId','jobId','title','ownerAgent','supportAgents','status','evidenceUrl','xpReward','dueDate','createdAt','updatedAt'],
  Agents: ['agentId','name','role','currentHat','level','xp','season','status','authority','activeMission'],
  Skills: ['skillId','name','path','category','ownerAgent','useWhen','status','updatedAt'],
  Evidence: ['evidenceId','jobId','missionId','type','url','note','verifiedBy','verifiedAt','status'],
  Receipts: ['receiptId','jobId','missionId','evidence','testResult','decision','risk','approvalStatus','summaryTH','summaryEN','createdAt'],
  Decisions: ['decisionId','jobId','loopType','observe','orient','decide','act','plan','doStep','checkStep','swot','risk','chosenAction','approvalStatus','createdAt'],
  Logs: ['logId','jobId','agentId','eventType','messageTH','messageEN','timestamp'],
  Levels: ['levelId','agentId','xpBefore','xpGain','xpAfter','levelBefore','levelAfter','seasonBefore','seasonAfter','reason','receiptId','createdAt'],
  Config: ['key','value','note'],
  Clones: ['cloneId','parentAgent','cloneName','jobId','missionId','hat','skillMdPath','objective','inputSource','outputExpected','autonomyLimit','evidenceRequired','expireCondition','status','createdAt','mergedAt','receiptId'],
  SkillMastery: ['masteryId','agentId','skillName','skillPath','rank','sourceJobId','sourceMissionId','evidenceUrl','canClone','levelImpact','xpGain','status','createdAt'],
  AgentSkillMap: ['agentId','skillName','skillRank','skillPath','lastUsedJobId','lastUsedAt','successCount','cloneReady']
};

function doGet() {
  return jsonResponse({ ok: true, system: 'AGIS Agent Armada Processor v2', actions: ['setup','job.create','job.route','mission.update','receipt.create','dashboard.state','level.award','skill.mastery','clone.create','clone.merge'] });
}

function doPost(e) {
  try {
    const body = e && e.postData && e.postData.contents ? JSON.parse(e.postData.contents) : {};
    const action = body.action || '';
    const payload = body.payload || {};
    if (action === 'setup') return jsonResponse(setupSheets());
    if (action === 'job.create') return jsonResponse(createJob(payload));
    if (action === 'job.route') return jsonResponse(routeJob(payload));
    if (action === 'mission.update') return jsonResponse(updateMission(payload));
    if (action === 'receipt.create') return jsonResponse(createReceipt(payload));
    if (action === 'dashboard.state') return jsonResponse(getDashboardState());
    if (action === 'level.award') return jsonResponse(awardLevelXp(payload));
    if (action === 'skill.mastery') return jsonResponse(recordSkillMastery(payload));
    if (action === 'clone.create') return jsonResponse(createClone(payload));
    if (action === 'clone.merge') return jsonResponse(mergeClone(payload));
    return jsonResponse({ ok: false, error: 'Unknown action', action });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err), stack: err && err.stack ? err.stack : '' });
  }
}

function getSpreadsheet() {
  const id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (id) return SpreadsheetApp.openById(id);
  return SpreadsheetApp.getActiveSpreadsheet();
}

function setupSheets() {
  const ss = getSpreadsheet();
  Object.keys(HEADERS).forEach(name => {
    let sh = ss.getSheetByName(name);
    if (!sh) sh = ss.insertSheet(name);
    if (sh.getLastRow() === 0) sh.appendRow(HEADERS[name]);
  });
  seedAgentsIfEmpty();
  logEvent('', 'SYSTEM', 'setup', 'ตั้งค่า Processor v2 สำเร็จ', 'Processor v2 setup completed');
  return { ok: true, message: 'Sheets v2 setup completed', spreadsheetUrl: ss.getUrl() };
}

function createJob(payload) {
  setupSheets();
  const now = new Date().toISOString();
  const jobType = payload.jobType || classifyJobType(payload.bossCommand || '');
  const routing = getRouting(jobType);
  const job = {
    jobId: makeId('JOB'), bossCommand: payload.bossCommand || '', onePiece: payload.onePiece || payload.goal || 'Define One Piece from Boss Command',
    jobType, difficulty: payload.difficulty || routing.difficulty, priority: payload.priority || 'Medium', loopMode: payload.loopMode || routing.loopMode,
    hatSet: payload.hatSet || routing.hatSet, ownerAgent: payload.ownerAgent || routing.ownerAgent, status: 'Intake', evidenceRequired: true,
    approvalRequired: needsApproval(payload), createdAt: now, updatedAt: now
  };
  appendObject('Jobs', job);
  logEvent(job.jobId, job.ownerAgent, 'job.create', 'สร้าง Job Card แล้ว: ' + job.onePiece, 'Job Card created: ' + job.onePiece);
  return { ok: true, jobId: job.jobId, job };
}

function routeJob(payload) {
  const job = findById('Jobs', 'jobId', payload.jobId);
  if (!job) return { ok: false, error: 'Job not found', jobId: payload.jobId };
  const routing = getRouting(job.jobType);
  const missions = buildStarterMissions(job, routing).map(m => { appendObject('Missions', m); return m; });
  updateById('Jobs', 'jobId', job.jobId, { status: 'Routing', updatedAt: new Date().toISOString() });
  logEvent(job.jobId, 'Navi Map', 'job.route', 'แตก Mission และแจก Agent แล้ว', 'Missions generated and agents assigned');
  return { ok: true, jobId: job.jobId, missions };
}

function updateMission(payload) {
  const mission = findById('Missions', 'missionId', payload.missionId);
  if (!mission) return { ok: false, error: 'Mission not found', missionId: payload.missionId };
  const status = payload.status || mission.status;
  const evidenceUrl = payload.evidenceUrl || mission.evidenceUrl || '';
  if (status === 'Done' && !evidenceUrl) return { ok: false, error: 'Evidence required before Done', missionId: payload.missionId };
  updateById('Missions', 'missionId', payload.missionId, { status, evidenceUrl, updatedAt: new Date().toISOString() });
  if (status === 'Done') awardLevelXp({ agentId: agentNameToId(mission.ownerAgent), xpGain: Number(mission.xpReward || 0), reason: 'Mission completed: ' + mission.title, receiptId: payload.receiptId || '' });
  logEvent(mission.jobId, mission.ownerAgent, 'mission.update', 'อัปเดต Mission: ' + mission.title, 'Mission updated: ' + mission.title);
  return { ok: true, missionId: payload.missionId, status, evidenceUrl };
}

function createReceipt(payload) {
  const now = new Date().toISOString();
  const receipt = { receiptId: makeId('REC'), jobId: payload.jobId || '', missionId: payload.missionId || '', evidence: payload.evidence || payload.evidenceUrl || '', testResult: payload.testResult || 'Pending', decision: payload.decision || '', risk: payload.risk || '', approvalStatus: payload.approvalStatus || 'NotRequired', summaryTH: payload.summaryTH || '', summaryEN: payload.summaryEN || '', createdAt: now };
  if (!receipt.evidence) return { ok: false, error: 'Receipt requires evidence' };
  appendObject('Receipts', receipt);
  logEvent(receipt.jobId, 'Brook Log', 'receipt.create', 'สร้าง Receipt แล้ว', 'Receipt created');
  return { ok: true, receiptId: receipt.receiptId, receipt };
}

function createClone(payload) {
  setupSheets();
  if (!payload.parentAgent || !payload.jobId || !payload.missionId) return { ok: false, error: 'parentAgent, jobId, missionId required' };
  const clone = { cloneId: makeId('CLN'), parentAgent: payload.parentAgent, cloneName: payload.cloneName || payload.parentAgent + ' Clone', jobId: payload.jobId, missionId: payload.missionId, hat: payload.hat || '', skillMdPath: payload.skillMdPath || '', objective: payload.objective || '', inputSource: payload.inputSource || '', outputExpected: payload.outputExpected || '', autonomyLimit: payload.autonomyLimit || 'same-as-parent-low-risk-only', evidenceRequired: true, expireCondition: payload.expireCondition || 'mission Done or Cancelled', status: 'Doing', createdAt: new Date().toISOString(), mergedAt: '', receiptId: '' };
  appendObject('Clones', clone);
  logEvent(clone.jobId, clone.parentAgent, 'clone.create', 'สร้าง Clone: ' + clone.cloneName, 'Clone created: ' + clone.cloneName);
  return { ok: true, cloneId: clone.cloneId, clone };
}

function mergeClone(payload) {
  const clone = findById('Clones', 'cloneId', payload.cloneId);
  if (!clone) return { ok: false, error: 'Clone not found', cloneId: payload.cloneId };
  if (!payload.receiptId) return { ok: false, error: 'receiptId required for clone.merge' };
  updateById('Clones', 'cloneId', payload.cloneId, { status: 'Done', mergedAt: new Date().toISOString(), receiptId: payload.receiptId });
  const xp = Number(payload.xpGain || 200);
  awardLevelXp({ agentId: agentNameToId(clone.parentAgent), xpGain: xp, reason: 'Clone merged: ' + clone.cloneName, receiptId: payload.receiptId });
  logEvent(clone.jobId, clone.parentAgent, 'clone.merge', 'Merge clone กลับ Parent แล้ว', 'Clone merged back to parent');
  return { ok: true, cloneId: payload.cloneId, xpGain: xp };
}

function recordSkillMastery(payload) {
  if (!payload.agentId || !payload.skillName || !payload.evidenceUrl) return { ok: false, error: 'agentId, skillName, evidenceUrl required' };
  const rank = payload.rank || 'Useful';
  const xpGain = Number(payload.xpGain || xpForSkillRank(rank));
  const mastery = { masteryId: makeId('SKM'), agentId: payload.agentId, skillName: payload.skillName, skillPath: payload.skillPath || '', rank, sourceJobId: payload.sourceJobId || '', sourceMissionId: payload.sourceMissionId || '', evidenceUrl: payload.evidenceUrl, canClone: Boolean(payload.canClone), levelImpact: payload.levelImpact || 'Skill learned and ready to reuse', xpGain, status: 'Verified', createdAt: new Date().toISOString() };
  appendObject('SkillMastery', mastery);
  upsertAgentSkillMap(mastery);
  awardLevelXp({ agentId: payload.agentId, xpGain, reason: 'Skill mastery: ' + payload.skillName + ' [' + rank + ']', receiptId: payload.receiptId || '' });
  return { ok: true, masteryId: mastery.masteryId, xpGain, mastery };
}

function awardLevelXp(payload) {
  const agentId = payload.agentId;
  if (!agentId) return { ok: false, error: 'agentId required' };
  const agent = findById('Agents', 'agentId', agentId);
  if (!agent) return { ok: false, error: 'Agent not found', agentId };
  const xpBefore = Number(agent.xp || 0);
  const levelBefore = Number(agent.level || 1);
  const xpGain = Number(payload.xpGain || 0);
  const xpAfter = xpBefore + xpGain;
  const levelAfter = levelFromXp(xpAfter);
  const seasonBefore = agent.season || seasonFromLevel(levelBefore);
  const seasonAfter = seasonFromLevel(levelAfter);
  updateById('Agents', 'agentId', agentId, { xp: xpAfter, level: levelAfter, season: seasonAfter });
  const levelRow = { levelId: makeId('LVL'), agentId, xpBefore, xpGain, xpAfter, levelBefore, levelAfter, seasonBefore, seasonAfter, reason: payload.reason || '', receiptId: payload.receiptId || '', createdAt: new Date().toISOString() };
  appendObject('Levels', levelRow);
  logEvent('', agentId, 'level.award', 'เพิ่ม XP: ' + xpGain + ' | Level ' + levelBefore + ' → ' + levelAfter, 'XP awarded: ' + xpGain + ' | Level ' + levelBefore + ' -> ' + levelAfter);
  return { ok: true, agentId, xpBefore, xpGain, xpAfter, levelBefore, levelAfter, seasonBefore, seasonAfter };
}

function getDashboardState() {
  setupSheets();
  const jobs = readObjects('Jobs'), missions = readObjects('Missions'), agents = readObjects('Agents'), receipts = readObjects('Receipts'), clones = readObjects('Clones'), mastery = readObjects('SkillMastery');
  const topAgent = agents.slice().sort((a,b) => Number(b.xp || 0) - Number(a.xp || 0))[0] || null;
  return { ok: true, kpi: { jobs: jobs.length, missions: missions.length, agents: agents.length, receipts: receipts.length, doneMissions: missions.filter(m => m.status === 'Done').length, reviewMissions: missions.filter(m => m.status === 'Review').length, evidenceRate: missions.length ? Math.round((missions.filter(m => m.evidenceUrl).length / missions.length) * 100) : 0, clonesActive: clones.filter(c => c.status === 'Doing').length, clonesDone: clones.filter(c => c.status === 'Done').length, seniorSkills: mastery.filter(s => s.rank === 'Senior').length, masterSkills: mastery.filter(s => s.rank === 'Master').length, legendarySkills: mastery.filter(s => s.rank === 'Legendary').length, avgAgentLevel: agents.length ? Math.round(agents.reduce((sum,a) => sum + Number(a.level || 1), 0) / agents.length) : 1, topAgentByXp: topAgent ? topAgent.name : '' }, jobs: jobs.slice(-20), missions: missions.slice(-50), agents, clones: clones.slice(-50), mastery: mastery.slice(-50) };
}

function classifyJobType(text) {
  const t = String(text).toLowerCase();
  if (/video|คลิป|ตัดต่อ|subtitle|storyboard/.test(t)) return 'Video';
  if (/seo|marketing|ขาย|shopee|affiliate|โฆษณา/.test(t)) return 'Marketing';
  if (/web|app|dashboard|github|lovable|deploy|prototype/.test(t)) return 'Build';
  if (/sop|รายงาน|เอกสาร|pdf|docx|ระเบียบ/.test(t)) return 'Report';
  if (/drive|sheet|data|bigdata|ข้อมูล/.test(t)) return 'Data';
  return 'Research';
}

function getRouting(jobType) {
  const map = { Video: { hatSet: 'Video Editing', ownerAgent: 'Captain AGIS', loopMode: 'Hybrid', difficulty: 'A' }, Marketing: { hatSet: 'Marketing SEO Sales', ownerAgent: 'Hook Sniper', loopMode: 'SWOT+OODA', difficulty: 'A' }, Build: { hatSet: 'WebApp GitHub Lovable', ownerAgent: 'Forge Dev', loopMode: 'PDCA+OODA', difficulty: 'S' }, Report: { hatSet: 'Report SOP Thai', ownerAgent: 'Copy Chef', loopMode: 'PDCA', difficulty: 'B' }, Data: { hatSet: 'Google Drive Big Data', ownerAgent: 'Archive Eye', loopMode: 'SWOT+PDCA', difficulty: 'A' }, Research: { hatSet: 'Research', ownerAgent: 'Archive Eye', loopMode: 'OODA', difficulty: 'B' } };
  return map[jobType] || map.Research;
}

function buildStarterMissions(job, routing) {
  const now = new Date().toISOString();
  const base = [['Define One Piece and acceptance criteria','Captain AGIS','Navi Map',50],['Run MiroFish routing and split missions','Navi Map','Archive Eye',50],['Collect source evidence and rules','Archive Eye','Jin Guard',75],['Produce first working draft or prototype',routing.ownerAgent,'Copy Chef,Forge Dev',100],['Validate output with evidence gate','Bug Doctor','Blade SEO,Jin Guard',75],['Create bilingual summary and receipt','Brook Log','Captain AGIS',50]];
  return base.map(row => ({ missionId: makeId('MIS'), jobId: job.jobId, title: row[0], ownerAgent: row[1], supportAgents: row[2], status: 'Todo', evidenceUrl: '', xpReward: row[3], dueDate: '', createdAt: now, updatedAt: now }));
}

function needsApproval(payload) { return /cost|payment|delete|public deploy|external|send email|เงินจริง|ลบ|ส่งจริง|เผยแพร่/.test(JSON.stringify(payload).toLowerCase()); }
function xpForSkillRank(rank) { return { Common: 25, Useful: 100, Senior: 300, Master: 600, Legendary: 1000 }[rank] || 100; }
function levelFromXp(xp) { if (xp >= 8000) return 7; if (xp >= 4000) return 6; if (xp >= 2000) return 5; if (xp >= 1000) return 4; if (xp >= 500) return 3; if (xp >= 200) return 2; return 1; }
function seasonFromLevel(level) { return ['','Rookie Sea','Grand Route','Sky Current','Water Forge','New Horizon','Warrior Mastery','Final Ocean'][Math.min(Number(level || 1),7)] || 'Rookie Sea'; }
function agentNameToId(name) { const a = readObjects('Agents').find(x => x.name === name || x.agentId === name); return a ? a.agentId : name; }

function upsertAgentSkillMap(m) {
  appendObject('AgentSkillMap', { agentId: m.agentId, skillName: m.skillName, skillRank: m.rank, skillPath: m.skillPath, lastUsedJobId: m.sourceJobId, lastUsedAt: new Date().toISOString(), successCount: 1, cloneReady: m.canClone });
}

function appendObject(sheetName, obj) { const sh = getSpreadsheet().getSheetByName(sheetName); const headers = HEADERS[sheetName]; sh.appendRow(headers.map(h => obj[h] !== undefined ? obj[h] : '')); }
function readObjects(sheetName) { const sh = getSpreadsheet().getSheetByName(sheetName); if (!sh || sh.getLastRow() < 2) return []; const values = sh.getDataRange().getValues(); const headers = values.shift(); return values.map(row => { const obj = {}; headers.forEach((h,i) => obj[h] = row[i]); return obj; }); }
function findById(sheetName, idField, idValue) { return readObjects(sheetName).find(o => String(o[idField]) === String(idValue)); }
function updateById(sheetName, idField, idValue, updates) { const sh = getSpreadsheet().getSheetByName(sheetName); const values = sh.getDataRange().getValues(); const headers = values[0]; const idCol = headers.indexOf(idField) + 1; for (let r = 2; r <= values.length; r++) { if (String(sh.getRange(r,idCol).getValue()) === String(idValue)) { Object.keys(updates).forEach(k => { const c = headers.indexOf(k) + 1; if (c > 0) sh.getRange(r,c).setValue(updates[k]); }); return true; } } return false; }
function seedAgentsIfEmpty() { const sh = getSpreadsheet().getSheetByName('Agents'); if (sh.getLastRow() > 1) return; const agents = [['AGT-001','Captain AGIS','Orchestrator','Command Hat',1,0,'Rookie Sea','standby','approval-gate',''],['AGT-002','Navi Map','Router','Routing Hat',1,0,'Rookie Sea','standby','route-low-risk',''],['AGT-003','Archive Eye','Knowledge Analyst','Knowledge Hat',1,0,'Rookie Sea','standby','read-and-extract',''],['AGT-004','Forge Dev','Builder','Builder Hat',1,0,'Rookie Sea','standby','build-internal',''],['AGT-005','Bug Doctor','Validator','QA Hat',1,0,'Rookie Sea','standby','validate',''],['AGT-006','Blade SEO','Precision Guard','Precision Hat',1,0,'Rookie Sea','standby','review',''],['AGT-007','Copy Chef','Content Writer','Content Hat',1,0,'Rookie Sea','standby','draft',''],['AGT-008','Hook Sniper','Growth Agent','Growth Hat',1,0,'Rookie Sea','standby','growth-draft',''],['AGT-009','Brook Log','Story and Log','Story Hat',1,0,'Rookie Sea','standby','summarize',''],['AGT-010','Jin Guard','Governance','Governance Hat',1,0,'Rookie Sea','standby','risk-gate','']]; sh.getRange(2,1,agents.length,agents[0].length).setValues(agents); }
function logEvent(jobId, agentId, eventType, messageTH, messageEN) { appendObject('Logs', { logId: makeId('LOG'), jobId, agentId, eventType, messageTH, messageEN, timestamp: new Date().toISOString() }); }
function makeId(prefix) { return prefix + '-' + Utilities.formatDate(new Date(), 'Asia/Bangkok', 'yyyyMMdd-HHmmss') + '-' + Math.floor(Math.random() * 10000); }
function jsonResponse(obj) { return ContentService.createTextOutput(JSON.stringify(obj, null, 2)).setMimeType(ContentService.MimeType.JSON); }
