# AGIS Command Center v3 — Captain + Loop Engine + 40D

เว็บแอปแบบ Hybrid Local-first + Google Apps Script Processor สำหรับ AGIS Agent Armada OS

## จุดเข้าใช้งานหลัก
- `captain-console.html` — Boss ส่งคำสั่งครั้งเดียว ให้ AGIS รับงานและเริ่ม Loop
- `processor-console.html` — Console สำหรับทดสอบ Processor รายคำสั่ง
- `index.html` — Dashboard, Mission Queue, Pixel Crew, 40D และ Output Center

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
- Auto-routing เข้าลูกเรือ Pixel 10 ตัว
- Evidence Gate และ Receipt
- Google Apps Script Processor เขียน State DB
- ตัวประเมิน 40 มิติ
  - P0 Core 10 มิติ
  - P1 Advanced 10 มิติ
  - P2 Master 10 มิติ
  - Quality & Production 10 มิติ
- ดาวน์โหลด JSON, CSV, Markdown, HTML, Receipt JSON, PNG, SVG และ Print/PDF
- Import/Export ข้อมูลสำรอง
- LocalStorage ใช้งานได้แม้ Processor ไม่พร้อม

## Live Processor
Apps Script Processor URL ถูกติดตั้งใน `processor-client.js` แล้ว และ Health Check ผ่านแล้ว

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
- Evidence Gate
- Receipt
- เขียน State DB

งานที่ยังต้องมี Executor ภายนอกเพื่อทำอัตโนมัติเต็มรูปแบบ:
- แก้ไฟล์โครงการจริง
- เรียก private connectors
- สร้างเอกสารหรือไฟล์ปลายทาง
- Deploy ระบบภายนอก
- ส่งอีเมลหรือข้อความ

## Deploy
GitHub Pages workflow:
`.github/workflows/agis-crew-dashboard-pages.yml`
