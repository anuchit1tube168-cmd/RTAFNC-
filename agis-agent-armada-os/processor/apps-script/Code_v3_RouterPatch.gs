// Code_v3_RouterPatch.gs — Router patch for Processor v3
// ใช้ไฟล์นี้ร่วมกับ Code_v2_LevelClone.gs + ScaleAddon_v3.gs
// วิธีใช้: วางไฟล์นี้ใน Apps Script project เดียวกัน แล้วใช้ doPost/doGet ชุดนี้เป็นตัวหลัก

function doGet() {
  return jsonResponse({
    ok: true,
    system: 'AGIS Agent Armada Processor v3',
    version: '3.0.0',
    actions: [
      'setup',
      'job.create', 'job.route', 'mission.update', 'receipt.create', 'dashboard.state',
      'level.award', 'skill.mastery', 'clone.create', 'clone.merge',
      'blocker.report', 'scale.evaluate', 'recruit.request', 'expert.register', 'skill.revise'
    ]
  });
}

function doPost(e) {
  try {
    const body = e && e.postData && e.postData.contents ? JSON.parse(e.postData.contents) : {};
    const action = body.action || '';
    const payload = body.payload || {};

    const auth = checkAuth_(body);
    if (!auth.ok) return jsonResponse(auth);

    if (action === 'setup') {
      const base = setupSheets();
      const scale = setupScaleSheets();
      return jsonResponse({ ok: true, base, scale, message: 'Processor v3 setup completed' });
    }

    // Core v1/v2
    if (action === 'job.create') return jsonResponse(createJob(payload));
    if (action === 'job.route') return jsonResponse(routeJob(payload));
    if (action === 'mission.update') return jsonResponse(updateMission(payload));
    if (action === 'receipt.create') return jsonResponse(createReceipt(payload));
    if (action === 'dashboard.state') return jsonResponse(getDashboardStateV3());

    // Level / Skill / Clone v2
    if (action === 'level.award') return jsonResponse(awardLevelXp(payload));
    if (action === 'skill.mastery') return jsonResponse(recordSkillMastery(payload));
    if (action === 'clone.create') return jsonResponse(createClone(payload));
    if (action === 'clone.merge') return jsonResponse(mergeClone(payload));

    // Scale v3
    if (action === 'blocker.report') return jsonResponse(reportBlocker(payload));
    if (action === 'scale.evaluate') return jsonResponse(evaluateScale(payload));
    if (action === 'recruit.request') return jsonResponse(requestRecruit(payload));
    if (action === 'expert.register') return jsonResponse(registerExpert(payload));
    if (action === 'skill.revise') return jsonResponse(reviseSkill(payload));

    return jsonResponse({ ok: false, error: 'Unknown action', action });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err), stack: err && err.stack ? err.stack : '' });
  }
}

function checkAuth_(body) {
  const token = PropertiesService.getScriptProperties().getProperty('AUTH_TOKEN');
  if (!token) return { ok: true };
  if (body && body.token === token) return { ok: true };
  return { ok: false, error: 'Unauthorized: token missing or invalid' };
}

function getDashboardStateV3() {
  setupSheets();
  setupScaleSheets();

  const base = getDashboardState();
  const blockers = readScaleObjects('Blockers');
  const recruits = readScaleObjects('RecruitRequests');
  const experts = readScaleObjects('ExpertRegistry');
  const revisions = readScaleObjects('SkillRevisions');

  base.kpi.blockersOpen = blockers.filter(b => b.status === 'Open').length;
  base.kpi.blockersResolved = blockers.filter(b => b.status === 'Resolved').length;
  base.kpi.recruitRequests = recruits.length;
  base.kpi.expertsActive = experts.filter(e => e.status === 'Active').length;
  base.kpi.skillRevisions = revisions.length;
  base.kpi.pendingApprovals = recruits.filter(r => r.approvalRequired === true || r.approvalRequired === 'true').filter(r => r.status === 'Requested').length;

  base.blockers = blockers.slice(-50);
  base.recruits = recruits.slice(-50);
  base.experts = experts.slice(-50);
  base.revisions = revisions.slice(-50);
  base.version = '3.0.0';

  return base;
}
