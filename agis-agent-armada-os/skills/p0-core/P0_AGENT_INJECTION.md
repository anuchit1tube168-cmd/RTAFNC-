# P0_AGENT_INJECTION — Install Core Skills into AGIS Crew

## Purpose
ติดตั้ง P0 Core Skills ให้ลูกเรือทุกตัว เพื่อให้เริ่มทำงานจริงแบบมี Evidence/Receipt ได้

## Skill-to-Agent Map

| P0 Skill | Primary Agent | Backup Agent | First Test Job |
|---|---|---|---|
| Requirement Extraction | Captain AGIS | Navi Map | ถอดคำสั่ง Boss เป็น Job Card |
| SOP to Workflow | Archive Eye | Copy Chef | แปลง SOP/PDF เป็น workflow |
| Google Drive Knowledge Index | Archive Eye | Brook Log | ทำ index folder ความรู้ |
| Google Sheet State DB | Forge Dev | Archive Eye | สร้าง/ตรวจ State DB |
| Apps Script Processor | Forge Dev | Bug Doctor | Deploy P0 processor |
| GitHub Repo Operating | Forge Dev | Brook Log | สร้าง/อัปเดต skill file |
| Lovable UI Builder | Forge Dev | Copy Chef | สร้าง Command Center prompt |
| Evidence Gate / Receipt | Bug Doctor | Brook Log | Reject Done without evidence |
| QA Debug | Bug Doctor | Jin Guard | Reproduce + fix + test |
| Agent Routing | Navi Map | Captain AGIS | Route Boss command to missions |

## Crew Rule
- Captain chooses priority
- Navi routes work
- Archive extracts knowledge
- Forge builds
- Bug Doctor validates
- Jin Guard checks risk
- Brook Log records receipt

## Level Rule
- Useful = ใช้ตาม checklist ได้
- Senior Candidate = ใช้กับงานจริงและมี receipt
- Master Candidate = ใช้ซ้ำ 3 job types
- Clone Ready = clone agent ใช้ skill ได้ไม่พัง
