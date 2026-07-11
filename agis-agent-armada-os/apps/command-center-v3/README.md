# AGIS Command Center v3 — 40D Evaluation & Output Center

เว็บแอปแบบ Hybrid Local-first + Google Apps Script Processor สำหรับ AGIS Agent Armada OS

## ความสามารถหลัก
- Mission Queue สูงสุด 40 ภารกิจ
- Auto-routing เข้าลูกเรือ Pixel 10 ตัว
- ตัวประเมิน 40 มิติ
  - P0 Core 10 มิติ
  - P1 Advanced 10 มิติ
  - P2 Master 10 มิติ
  - Quality & Production 10 มิติ
- Auto Score + Manual Review
- Findings / Blockers / Strengths
- Evidence Gate และ SHA-256 Receipt
- ดาวน์โหลด JSON, CSV, Markdown, HTML, Receipt JSON, PNG, SVG และ Print/PDF
- Import/Export ข้อมูลสำรอง
- LocalStorage ใช้งานได้แม้ Processor ไม่พร้อม

## Live Processor
Apps Script Processor URL ถูกติดตั้งใน `processor-client.js` แล้ว

Operations Console:
`processor-console.html`

Console รองรับ:
- Health Check
- Setup
- job.create
- job.route
- mission.update
- receipt.create
- dashboard.state

การเรียก POST ใช้ `Content-Type: text/plain;charset=utf-8` เพื่อลดปัญหา browser preflight กับ Apps Script Web App

## ตัวละคร Pixel
ตัวละครทุกตัวถูกสร้างแบบ procedural pixel art ใน browser จาก Character Preset ของ AGIS:
Fable, AGIS, Navigator, Archaeologist, Shipwright, Doctor, Swordsman, Cook, Sniper และ Clone

## Path
`agis-agent-armada-os/apps/command-center-v3/`

## Deploy
GitHub Pages workflow:
`.github/workflows/agis-command-center-v3-pages.yml`

## กฎระบบ
`No Evidence = Not Done` และ `QA + Receipt = Done`
