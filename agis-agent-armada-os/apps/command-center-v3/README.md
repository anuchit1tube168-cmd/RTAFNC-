# AGIS Grand Line Command Deck v4 — Captain + Loop Engine + Analytics + Crew Chat

เว็บแอปแบบ Hybrid Local-first + Google Apps Script Processor สำหรับ AGIS Agent Armada OS

## จุดเข้าใช้งานหลัก
- `captain-console.html` — หน้า Command Deck หลัก รับคำสั่งจาก Boss, Crew Roster, Live Deck, Analytics และ Crew Chat
- `processor-console.html` — Console สำหรับทดสอบ Processor รายคำสั่ง
- `index.html` — Mission Queue, Pixel Crew, 40D Evaluation และ Output Center

## Product Design v4
หน้า Captain ถูกออกแบบใหม่ให้เหมือนศูนย์บัญชาการบนเรือ แต่ยังใช้งานง่ายในงานจริง:
- Boss Command Console กรอกคำสั่ง, One Piece, Template, Priority, Risk และ Evidence URL
- Interactive Crew Roster เลือกลูกเรือแล้วดู Role, Workload, Abilities และ Current Mission
- Live Operations Deck แสดงสถานี Command, Spec, Route, Build, Research, QA, Guard และ Output
- Selected Crew Panel พร้อม Quick Action: ส่งข้อความ, มอบหมายงาน และเพิ่ม Priority
- Mission Control Dialog สำหรับ Evidence Gate และ Receipt
- Responsive Desktop / Tablet / Mobile
- PWA cache สำหรับไฟล์ UI, SVG scene และ Crew sprites

## Data Analytics
ข้อมูลจาก `dashboard.state` ถูกนำมาคำนวณและแสดงแบบใช้งานได้ทันที:
- Active Missions
- Evidence Verified
- Agents Online
- Route Efficiency
- Mission Flow chart
- System Health
- Latest Missions
- Workload ของตัวละครจากจำนวน Mission ที่รับผิดชอบ

## Crew Chat
- Boss ส่งข้อความถึง All Crew หรือ Agent รายตัว
- ระบบเพิ่มข้อความอัตโนมัติตามสถานะ Loop
- เก็บประวัติ Chat ใน LocalStorage
- Chat ใช้ประกอบการติดตามงาน แต่ไม่ถือเป็น Evidence จนกว่าจะมี URL หลักฐาน

## Loop Engineering
ลำดับทำงานจริง:

`Intent → Spec → Route → Work → Guard → Validate → Review → Receipt`

เจ้าของแต่ละช่วง:
- Intent — AGIS
- Spec — Fable
- Route — Navigator
- Work — Specialist ตามประเภทงาน
- Guard — Swordsman
- Validate — Doctor
- Review — AGIS
- Receipt / Backup — Clone

กฎบังคับ:
- `No Evidence = Not Done`
- `QA + Receipt = Done`
- งานเสี่ยงสูงต้องผ่าน Swordsman
- งานเผยแพร่จริงต้องผ่าน AGIS

## Canonical Crew
1. Fable — Master Skill Architect
2. AGIS — Captain / Orchestrator
3. Navigator — Routing Agent
4. Archaeologist — Knowledge / Research
5. Shipwright — Builder / Dev
6. Doctor — QA / Debug
7. Swordsman — Risk / Compliance
8. Cook — Docs / Graphic / Content
9. Sniper — Marketing / Growth
10. Clone — Scale / Backup

## ความสามารถหลัก
- AGIS Captain รับคำสั่ง สร้าง Job และ Route Mission
- Mission Queue สูงสุด 40 ภารกิจ
- Auto-routing เข้าลูกเรือ 10 ตัว
- Evidence Gate และ Receipt
- Google Apps Script Processor เขียน State DB
- ตัวประเมิน 40 มิติ
- ดาวน์โหลด JSON, CSV, Markdown, HTML, Receipt JSON, PNG, SVG และ Print/PDF
- Import/Export ข้อมูลสำรอง
- LocalStorage ใช้งานได้แม้ Processor ไม่พร้อม

## Live Processor
Apps Script Processor URL ถูกติดตั้งใน `processor-client.js` และ Health Check ผ่านแล้ว

รองรับ:
- `setup`
- `job.create`
- `job.route`
- `mission.update`
- `receipt.create`
- `dashboard.state`

## ขอบเขตความพร้อม
พร้อมแล้ว:
- รับคำสั่ง
- สร้าง Job
- Route Mission
- ติดตามสถานะ
- Analytics Dashboard
- Crew Chat แบบ Local
- Evidence Gate
- Receipt
- เขียน State DB

งานที่ยังต้องมี Executor ภายนอกเพื่อทำอัตโนมัติเต็มรูปแบบ:
- แก้ไฟล์โครงการจริง
- เรียก private connectors
- สร้างเอกสารหรือไฟล์ปลายทาง
- Deploy ระบบภายนอก
- ส่งอีเมลหรือข้อความออกนอกระบบ

## Deploy
GitHub Pages workflow:
`.github/workflows/agis-crew-dashboard-pages.yml`

Live path:
`https://anuchit1tube168-cmd.github.io/RTAFNC-/captain-console.html`
