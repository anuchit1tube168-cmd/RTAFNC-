# AGIS Grand Line Command Deck v6.3

เว็บแอปแบบ Hybrid Local-first + Google Apps Script Processor สำหรับ AGIS Agent Armada OS

## จุดเข้าใช้งาน
- `captain-console.html` — หน้า Captain หลักแบบ Responsive Desktop + Mobile
- `rpg-operations.html` — RPG Operations Hub แปลงระบบเกมเป็นระบบบริหารงาน Agent
- `processor-setup.html` — ศูนย์ติดตั้งและทดสอบ Processor v2
- `processor-console.html` — ทดสอบ Processor รายคำสั่ง
- `pixel-library.html` — Pixel Character Studio และ Sprite QA
- `index.html` — Mission Queue, 40D Evaluation และ Output Center

## RPG Operations Hub v6.3
ถอดแนวคิดจาก RPG Workflow มาเป็นโมดูลทำงานของ AGIS โดยไม่สร้างเกมจริง:

1. Command Town — ศูนย์รวมงานและสถานะ
2. Auto Operations — Captain รับคำสั่งและ Navigator Route งาน
3. Idle Rewards — XP, งานสำเร็จ และ Receipt สะสม
4. Agent & Loadout — Skill, Tool, Workload และ Mission ของ Agent
5. Asset Inventory — Template, SOP, Dataset, Evidence และ Output
6. Quest System — Jobs, Missions, Priority, Owner และ Evidence Gate
7. Skill Forge — อัปเกรด Skill MD และเกณฑ์ QA
8. Crew Guild — Chat, Collaboration, Handoff และ Human Approval
9. Boss Challenge — งาน Critical / High Risk
10. Patch Update — Version, CI Status, Known Issues และ Release Notes

หน้า RPG Hub เชื่อม Processor จริงเพื่ออ่าน `dashboard.state` และสั่ง `job.create` + `job.route`

Live path:
`https://anuchit1tube168-cmd.github.io/RTAFNC-/rpg-operations.html`

## Product Workflow
`Think → Concept → Design Doc → Review → Architecture → Build → Test & Loop`

## Tech Stack
- UI/Engine: HTML5, CSS Grid, JavaScript, SVG/Canvas
- Backend: Google Apps Script Processor v2
- State: Google Sheets State DB + LocalStorage
- Asset Pipeline: Pixel Character Engine + SVG Sprite Atlas
- Deploy: GitHub Pages + PWA Cache
- Output: Drive `output.save`, HTML, ZIP, PDF, JSON และ Receipt

## Captain Loop
`Intent → Spec → Route → Work → Guard → Validate → Review → Output`

เจ้าของแต่ละช่วง:
- Intent — AGIS
- Spec — Fable
- Route — Navigator
- Work — Specialist
- Guard — Swordsman
- Validate — Doctor
- Review — AGIS
- Output / Receipt — Clone + Cook

กฎบังคับ:
- `No Evidence = Not Done`
- `QA + Receipt = Done`

## Processor v2 Actions
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

## Deploy
Workflow: `.github/workflows/agis-crew-dashboard-pages.yml`

Captain:
`https://anuchit1tube168-cmd.github.io/RTAFNC-/captain-console.html`
