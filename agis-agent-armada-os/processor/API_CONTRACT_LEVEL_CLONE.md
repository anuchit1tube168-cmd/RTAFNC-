# API_CONTRACT_LEVEL_CLONE — Processor v2

ต่อยอดจาก Processor v1 เพิ่ม Level Up, Skill Mastery, Clone Agent

## New Actions

### level.award
ให้ XP กับ Agent จาก Mission / Job / Skill / Clone

```json
{
  "action": "level.award",
  "payload": {
    "agentId": "AGT-004",
    "xpGain": 200,
    "reason": "Mission A completed with evidence",
    "receiptId": "REC-..."
  }
}
```

### skill.mastery
บันทึกว่า Agent ได้เรียนรู้หรือใช้ Skill MD สำคัญ

```json
{
  "action": "skill.mastery",
  "payload": {
    "agentId": "AGT-003",
    "skillName": "SOP Extractor",
    "skillPath": "skills/sop-extractor/SKILL.md",
    "rank": "Senior",
    "sourceJobId": "JOB-...",
    "sourceMissionId": "MIS-...",
    "evidenceUrl": "https://...",
    "canClone": true
  }
}
```

### clone.create
สร้าง clone ชั่วคราวของ Agent สำหรับ mission เฉพาะ

```json
{
  "action": "clone.create",
  "payload": {
    "parentAgent": "Archive Eye",
    "cloneName": "Archive Eye PDF Clone 01",
    "jobId": "JOB-...",
    "missionId": "MIS-...",
    "hat": "Research Hat",
    "skillMdPath": "skills/sop-extractor/SKILL.md",
    "objective": "Extract rules from one PDF",
    "inputSource": "Google Drive file URL",
    "outputExpected": "Rule table",
    "autonomyLimit": "read-and-extract only",
    "expireCondition": "mission Done"
  }
}
```

### clone.merge
Merge clone output กลับ Parent Agent และให้ XP เมื่อมี receipt

```json
{
  "action": "clone.merge",
  "payload": {
    "cloneId": "CLN-...",
    "receiptId": "REC-...",
    "xpGain": 200
  }
}
```

## Dashboard v2 Adds
- clonesActive
- clonesDone
- seniorSkills
- masterSkills
- legendarySkills
- avgAgentLevel
- topAgentByXp

## Guard
- clone ต้องมี jobId และ missionId
- clone ไม่มีสิทธิ์เกิน parentAgent
- clone.merge ต้องมี receiptId
- skill.mastery ต้องมี evidenceUrl
- level.award ที่มาจาก completion ต้องมี receiptId
