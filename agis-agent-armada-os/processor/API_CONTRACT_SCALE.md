# API_CONTRACT_SCALE — Processor v3 Scale Actions

## Purpose
เพิ่ม API สำหรับ blocker, recruit, expert, revise skill เพื่อให้กองเรือขยายตัวได้ตามความเป็นจริง

## New Actions

### blocker.report
รายงานว่า Mission ไปต่อไม่ได้

```json
{
  "action": "blocker.report",
  "payload": {
    "jobId": "JOB-...",
    "missionId": "MIS-...",
    "blockerType": "Skill Gap",
    "summary": "ไม่มี expert ด้าน cybersecurity",
    "currentAgent": "Forge Dev",
    "attemptedFix": "ตรวจด้วย QA ปกติแล้วไม่พอ",
    "whyFailed": "ไม่มี security checklist"
  }
}
```

### scale.evaluate
ประเมินว่าต้อง scale ระดับไหน

```json
{
  "action": "scale.evaluate",
  "payload": {
    "blockerId": "BLK-..."
  }
}
```

### recruit.request
สร้างคำขอเพิ่มลูกเรือ/ผู้เชี่ยวชาญ

```json
{
  "action": "recruit.request",
  "payload": {
    "jobId": "JOB-...",
    "missionId": "MIS-...",
    "blockerId": "BLK-...",
    "scaleLevel": "Warlord",
    "expertRole": "Cybersecurity Guard",
    "specialty": "Security review and risk control",
    "outputContract": "Security checklist and fix plan",
    "approvalRequired": true
  }
}
```

### expert.register
เพิ่ม expert เข้า registry หลังได้รับอนุมัติ

```json
{
  "action": "expert.register",
  "payload": {
    "expertId": "EXP-...",
    "name": "Cybersecurity Guard",
    "tier": "Warlord",
    "specialty": "Security",
    "authorityLimit": "review only",
    "skillMdPath": "scaling/experts/cybersecurity-guard/SKILL.md"
  }
}
```

### skill.revise
บันทึกการ revise Skill MD เมื่อแก้ blocker แล้ว

```json
{
  "action": "skill.revise",
  "payload": {
    "skillName": "GitHub Deploy Loop",
    "skillPath": "skills/github-deploy-loop/SKILL.md",
    "reason": "QA failed twice on deployment permission",
    "changeSummary": "Added permission checklist",
    "evidenceUrl": "https://...",
    "reviewedBy": "Bug Doctor"
  }
}
```

## New Tabs
- Blockers
- RecruitRequests
- ExpertRegistry
- SkillRevisions

## Guard
- Warlord/Emperor recruit requires approvalRequired=true
- expert.register should happen after approval
- skill.revise requires evidenceUrl
- blocker.report must include attemptedFix and whyFailed
