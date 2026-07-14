# AGIS Armada OS v6.3

เว็บแอปแบบ Hybrid Local-first + Google Apps Script Processor สำหรับรับงาน แตก Mission ตรวจ Evidence สร้าง Receipt และส่งออกผลงาน

## จุดเข้าใช้งาน
- `captain-console.html` — Captain Deck รับคำสั่งและควบคุม Loop
- `project-forge.html` — Project Forge เปลี่ยนโครงการเป็น Workflow, Quest, Asset, Crew, Gate และ Release
- `processor-setup.html` — Processor v2 Deployment Center
- `processor-console.html` — ทดสอบ Processor รายคำสั่ง
- `pixel-library.html` — Pixel Character Studio
- `index.html` — Mission Queue, 40D Evaluation และ Output Center

## Project Forge v6
ถอดแนวคิดระบบ RPG มาใช้กับงานจริงโดยไม่คัดลอกตัวละครหรือทรัพย์สินของเกมต้นฉบับ:

1. Town Hub — Project Profile, Tech Stack และสถานะโครงการ
2. Auto Loop — สร้าง Job และ Route Mission ผ่าน Processor
3. Idle Rewards — XP จาก Mission, Evidence และ Receipt
4. Crew & Equipment — Agent, Skill และ Tool Loadout
5. Asset Inventory — เอกสาร รูปภาพ Code URL และ Evidence
6. Quest System — Backlog พร้อม Owner, Status, XP และ Evidence
7. Forge & Upgrade — ยกระดับ Skill, Template, Workflow และ Version
8. Community & Guild — Crew Chat, Decision และ Blocker Log
9. Boss Challenge — Critical Gate: Guard, QA, Evidence, Review และ Receipt
10. Patch Update — Release Note และ Version History

## Idea-to-Release Workflow
`Idea → Visual → GDD / Spec → Analyze → System Design → Build → Guard → Test → Release`

## Tech Stack Profiles
- WebApp — HTML/CSS/JS, PWA, Apps Script, Sheets, Drive, GitHub Pages
- Data Dashboard — Google Sheets, Apps Script, Data Validation และ Charts
- Document / SOP — Google Docs, PDF, Evidence Register และ Version Control
- AI Agent System — AGIS Processor, State DB, Routing, Evidence Gate และ Receipt
- Game Prototype — Unity 6/C#, 2D Tilemap, Sprite Pipeline, PlayerPrefs JSON, WebGL/Mobile
- Research — Evidence Matrix, Data Analysis, Citation และ Report

## Export & Delivery
Project Forge ส่งออกได้:
- GDD / SPEC.md
- Project JSON
- Standalone HTML
- ZIP Package
- Print / PDF
- Google Drive ผ่าน `output.save` ของ Processor v2

## Production Rules
- `No Evidence = Not Done`
- `QA + Receipt = Done`
- งาน Critical ต้องผ่าน Swordsman Guard และ Doctor QA
- Release ต้องมี Asset/Source, Evidence และ Receipt

## Processor v2
รองรับ:
- `setup`
- `job.create`
- `job.route`
- `mission.update`
- `receipt.create`
- `dashboard.state`
- `output.save`
- `output.list`
- `chat.append`
- `chat.list`

## Canonical Crew
Fable, AGIS, Navigator, Archaeologist, Shipwright, Doctor, Swordsman, Cook, Sniper, Clone

## Live URLs
- Captain Deck: `https://anuchit1tube168-cmd.github.io/RTAFNC-/captain-console.html`
- Project Forge: `https://anuchit1tube168-cmd.github.io/RTAFNC-/project-forge.html`
- Processor Center: `https://anuchit1tube168-cmd.github.io/RTAFNC-/processor-setup.html`
