# AGIS Fleet Operating System v7

ระบบบริหารงานจริงแบบ Hybrid Local-first + Google Apps Script Processor โดยใช้ UX และ Motion แบบ RPG เพื่ออธิบายสถานะงาน ไม่ใช่เพื่อสร้างเกม

## Product Rule
- Business Logic ต้องมาจาก Processor และ Google Sheets State DB
- RPG ใช้เฉพาะ Character, Motion, Map, Emote, Feedback และ Progress Visualization
- ห้ามแสดง Done จาก Timer หรือ Animation จำลอง
- ห้ามอ้าง Online, ETA, XP หรือความสำเร็จที่ไม่มีข้อมูลจริงรองรับ
- `No Evidence = Not Done`
- `QA + Receipt = Done`

## จุดเข้าใช้งาน
- `active-operations.html` — จุดเข้าหลักของ AGIS Active Operations
- `captain-console.html` — Operations Deck, Boss Command และ Mission Control
- `processor-setup.html` — ศูนย์ติดตั้งและทดสอบ Processor v2
- `processor-console.html` — ทดสอบ Processor รายคำสั่ง
- `pixel-library.html` — Pixel Character Studio และ Sprite QA
- `index.html` — Mission Queue, 40D Evaluation และ Output Center
- `rpg-operations.html` — หน้าทดลองเชิงภาพเดิม เก็บไว้เป็น Visual Reference รอง ไม่ใช่ Business Logic หลัก

## Architecture
### Reality Layer
`Apps Script Processor → State DB → Google Sheets → Google Drive → GitHub → Receipt`

### Work Engine
`Captain → Loop Engine → Mission Engine → Routing → Guard → QA → Evidence → Review → Receipt`

### Interaction Layer
`Crew → Deck → Motion → Emote → Event Log → Workflow Map`

## Active Operations Loop
`Intent → Spec → Route → Work → Guard → Validate → Review → Receipt`

เจ้าของแต่ละช่วง:
- Intent — AGIS
- Spec — Fable
- Route — Navigator
- Work — Specialist
- Guard — Swordsman
- Validate — Doctor
- Review — AGIS
- Receipt / Backup — Clone
- Output Formatting — Cook

## State-driven Character Runtime
สถานะตัวละครที่รองรับ:
- `idle` — ไม่มี Mission ที่รับผิดชอบ
- `assigned` — Processor สร้างหรือ Route งานแล้ว
- `working` — Mission อยู่สถานะ Working / Active
- `waiting` — Mission รอข้อมูล รอ Evidence หรือ Hold
- `blocked` — Processor ปฏิเสธ, Error, Failed หรือ Evidence ไม่ครบ
- `review` — รอ QA, Review หรือ Receipt
- `handoff` — เกิดหลัง `job.route` สำเร็จและส่งงานให้ Specialist
- `done` — มี Mission Done พร้อม Evidence และ Receipt

Motion เกิดจาก:
- Processor Request / Response Event
- การเปลี่ยน Mission Status ใน `dashboard.state`
- การเพิ่ม Evidence URL
- การสร้าง Receipt

ไม่ใช้ Random Motion เพื่ออ้างความสำเร็จ

## Operational Event Log
แยกออกจาก Team Note:
- Job Created
- Mission Created
- Mission State Changed
- Evidence Attached
- Request Failed
- Receipt Created
- Processor Offline

Event Log อ่านจากเหตุการณ์จริง ส่วนช่องข้อความใช้สำหรับหมายเหตุของ Boss และ Crew

## Verified Experience
Verified Experience นับเฉพาะ Mission ที่มีครบ:
1. Status = Done
2. Evidence URL
3. Receipt ที่อ้างถึง Mission เดียวกัน

ไม่ใช้ Idle Reward หรือ XP ที่สร้างจากเวลา

## Processor Actions
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
- Active Operations: `https://anuchit1tube168-cmd.github.io/RTAFNC-/active-operations.html`
- Captain Console: `https://anuchit1tube168-cmd.github.io/RTAFNC-/captain-console.html`
- Processor Setup: `https://anuchit1tube168-cmd.github.io/RTAFNC-/processor-setup.html`

## Deploy
Workflow: `.github/workflows/agis-crew-dashboard-pages.yml`
