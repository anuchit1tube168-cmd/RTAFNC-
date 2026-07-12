# AGIS Grand Line Command Deck v5

เว็บแอปแบบ Hybrid Local-first + Google Apps Script Processor สำหรับ AGIS Agent Armada OS

## จุดเข้าใช้งาน
- `captain-console.html` — หน้าใช้งานหลักแบบ Responsive Desktop + Mobile
- `processor-console.html` — ทดสอบ Processor รายคำสั่ง
- `index.html` — Mission Queue, Pixel Crew, 40D Evaluation และ Output Center

## Product Design v5
หน้า Captain ถูกสร้างใหม่ให้ใกล้เคียงตัวอย่างศูนย์บัญชาการบนเรือ:
- Crew Roster 10 ตัวละคร พร้อมสถานะและ Workload
- Loop Engineering 8 ขั้น
- Live Operations Deck แบบคลิกเลือกสถานี
- Boss Command กรอกคำสั่ง, Final Goal, Template, Priority, Risk และ Evidence URL
- Mission Control ด้านขวา
- Evidence Gate แบบ 5 จุดตรวจ
- Receipt Preview
- Output & Export
- Responsive Desktop / Tablet / Mobile พร้อม Bottom Quick Actions

## Data Analytics
ข้อมูลจาก `dashboard.state` แสดงเป็น:
- Active Missions
- Agents Online
- Route Efficiency
- Evidence Gate Pass Rate
- Mission Progress Overview

## Crew Chat
- ส่งถึง All Crew หรือราย Agent
- ระบบเพิ่มข้อความตามขั้น Loop
- เก็บ Chat ใน LocalStorage
- Chat ไม่ถือเป็น Evidence จนกว่าจะมี URL หลักฐาน

## Loop Engineering
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

## Output & Export
พร้อมใช้งานจาก Browser:
- Deploy as Web — ดาวน์โหลด Standalone HTML
- Export ZIP — รวม `index.html`, `mission.json`, `README.txt`
- Export PDF — Print/PDF ของ Browser
- Export JSON — ข้อมูล Job/Mission/Dashboard
- Receipt File — JSON พร้อม SHA-256
- Save to Google Drive — เรียก `output.save` เมื่อ Processor รองรับ; Processor v1 จะเตรียมไฟล์และเปิด Google Drive ให้แทน

## Live Processor
รองรับปัจจุบัน:
- `setup`
- `job.create`
- `job.route`
- `mission.update`
- `receipt.create`
- `dashboard.state`

`output.save` ถูกเตรียม Forward Compatibility ในหน้าเว็บ แต่ต้องอัปเกรด Apps Script Processor เป็น v2 เพื่อบันทึกไฟล์เข้า Drive อัตโนมัติ

## Canonical Crew
Fable, AGIS, Navigator, Archaeologist, Shipwright, Doctor, Swordsman, Cook, Sniper, Clone

## Deploy
Workflow: `.github/workflows/agis-crew-dashboard-pages.yml`

Live path: `https://anuchit1tube168-cmd.github.io/RTAFNC-/captain-console.html`
