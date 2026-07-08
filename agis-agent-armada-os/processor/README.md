# Processor v1 — AGIS Agent Armada OS

## Mission
ทำให้ Brain Layer ทำงานจริงด้วย Google Apps Script + Google Sheet ก่อน แล้วค่อยขยายเป็น Supabase/Cloudflare เมื่อโต

## Phase 1 Stack
- Brain Repo: GitHub `agis-agent-armada-os/brain/`
- State DB: Google Sheet
- Processor: Google Apps Script
- UI: Lovable Command Center
- Knowledge Lake: Google Drive

## What Processor Does
1. รับคำสั่งจาก UI หรือ manual API call
2. สร้าง Job Card
3. Classify job type
4. เลือก Hat Set
5. แจก Mission ตาม Agent
6. เขียนลง Google Sheet
7. อัปเดตสถานะ Mission
8. สร้าง Receipt
9. คำนวณ XP/Level
10. ส่ง Dashboard State กลับ UI

## Files
```text
processor/
├─ README.md
├─ API_CONTRACT.md
├─ TEST_PLAN.md
├─ apps-script/
│  ├─ Code.gs
│  └─ appsscript.json
└─ sheets/
   ├─ GOOGLE_SHEET_TEMPLATE.md
   └─ SEED_AGENTS.csv
```

## Setup
1. สร้าง Google Sheet ใหม่
2. สร้าง tabs ตาม `sheets/GOOGLE_SHEET_TEMPLATE.md`
3. เปิด Extensions → Apps Script
4. วาง `apps-script/Code.gs`
5. ตั้งค่า Script Properties: `SPREADSHEET_ID`
6. Deploy เป็น Web App
7. ใช้ endpoint จาก Lovable หรือ Postman ทดสอบ

## Safety
งานที่มีผลกับข้อมูลจริง ค่าใช้จ่าย การส่งออกภายนอก หรือ public deploy ต้องมี approval ก่อนเสมอ
