# TEST_PLAN_SCALE — Processor v3 Scale

## Test 1: Setup Scale Sheets
Call `setupScaleSheets()` manually in Apps Script, or call setup after adding ScaleAddon.

Expected tabs:
- Blockers
- RecruitRequests
- ExpertRegistry
- SkillRevisions

## Test 2: Report Blocker
```json
{
  "action": "blocker.report",
  "payload": {
    "jobId": "JOB-test",
    "missionId": "MIS-test",
    "blockerType": "Skill Gap",
    "summary": "ทีมไม่มีผู้เชี่ยวชาญด้าน security review",
    "currentAgent": "Forge Dev",
    "attemptedFix": "ใช้ QA checklist ปกติ",
    "whyFailed": "ไม่มี security checklist"
  }
}
```
Expected:
- Blockers row created
- recommendedScaleLevel = Warlord หรือ Specialist ตาม keyword
- status = Open

## Test 3: Evaluate Scale
```json
{
  "action": "scale.evaluate",
  "payload": {
    "blockerId": "BLK-..."
  }
}
```
Expected:
- status = Evaluated
- expertNeeded filled

## Test 4: Recruit Request
```json
{
  "action": "recruit.request",
  "payload": {
    "jobId": "JOB-test",
    "missionId": "MIS-test",
    "blockerId": "BLK-...",
    "scaleLevel": "Warlord",
    "expertRole": "Cybersecurity Guard",
    "specialty": "Security review",
    "outputContract": "Security checklist and fix plan",
    "approvalRequired": true
  }
}
```
Expected:
- RecruitRequests row created
- status = Requested
- Blocker status = RecruitRequested

## Test 5: Expert Register
```json
{
  "action": "expert.register",
  "payload": {
    "name": "Cybersecurity Guard",
    "tier": "Warlord",
    "specialty": "Security",
    "authorityLimit": "review only",
    "skillMdPath": "scaling/experts/cybersecurity-guard/SKILL.md"
  }
}
```
Expected:
- ExpertRegistry row created
- status = Active

## Test 6: Skill Revise
```json
{
  "action": "skill.revise",
  "payload": {
    "skillName": "GitHub Deploy Loop",
    "skillPath": "skills/github-deploy-loop/SKILL.md",
    "reason": "QA failed twice on deploy permission",
    "changeSummary": "เพิ่ม permission checklist",
    "evidenceUrl": "https://example.com/evidence",
    "versionBefore": "v1.0",
    "versionAfter": "v1.1"
  }
}
```
Expected:
- SkillRevisions row created
- status = Review
