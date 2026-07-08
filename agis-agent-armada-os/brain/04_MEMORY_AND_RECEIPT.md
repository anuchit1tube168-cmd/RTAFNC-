# 04_MEMORY_AND_RECEIPT — Memory and Receipt Standard

## Purpose
กำหนดว่าจะจำอะไรไว้ที่ไหน และหลักฐานงานต้องมีอะไรจึงจะปิด Job ได้

## Memory Layers

### GitHub
ใช้เก็บสมองถาวร version-controlled:
- SKILL.md
- LLM_WIKI.md
- Brain policies
- Agent roles
- Issues / PR / commits

### Google Drive
ใช้เก็บ knowledge lake / big data:
- SOP
- PDF / DOCX / Sheet / Slide
- รูปภาพ / transcript / source files
- รายงาน / output final

### Job State DB
เริ่มด้วย Google Sheet และย้าย Supabase เมื่อโต:
- Jobs
- Missions
- Agents
- Skills
- Evidence
- Receipts
- Decisions
- Logs
- Levels

### Lovable
ใช้เป็น Command Center UI:
- Dashboard
- Job board
- Agent board
- MiroFish map
- Decision room
- Receipt center

## Receipt Required Fields
```yaml
receiptId:
jobId:
missionId:
onePiece:
ownerAgent:
supportAgents:
loopMode:
hatSet:
evidence:
testResult:
decision:
risk:
approvalStatus:
summaryTH:
summaryEN:
nextAction:
createdAt:
```

## Done Rule
- Missing evidence = Todo/Doing only
- Evidence exists but not checked = Review
- QA passed + approval clear = Done
- Done triggers XP and Level Up

## Update Rule
ถ้างานสร้าง pattern ใหม่ที่ใช้ซ้ำได้ ให้เพิ่มหรือแก้:
- SKILL.md
- LLM_WIKI.md
- CHECKLIST.md
- MATCH_ROUTING.md
