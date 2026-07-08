# STEP_6_DEPLOY_AND_TEST_GUIDE — Real Google Sheet + Apps Script Deploy

## Objective
ทำให้ AGIS Agent Armada OS ใช้งานจริงบน Google Sheet + Apps Script Web App โดยต่อจาก Brain, Agent, Level/Clone และ Fleet Scale ที่สร้างไว้แล้ว

## Owner Agents
- Forge Dev: ติดตั้ง Apps Script / Deploy
- Archive Eye: ตรวจ Sheet schema
- Bug Doctor: ทดสอบ API
- Jin Guard: ตรวจ access / approval / risk
- Captain AGIS: อนุมัติ endpoint และปิด Step

## Output
- Google Sheet จริงสำหรับ State DB
- Apps Script Web App URL
- Processor v3 API ใช้งานได้
- Test receipt จาก setup, job.create, job.route, blocker.report, scale.evaluate

## Files to Use
```text
processor/apps-script/Code_v2_LevelClone.gs
processor/apps-script/ScaleAddon_v3.gs
processor/apps-script/Code_v3_RouterPatch.gs
processor/sheets/GOOGLE_SHEET_TEMPLATE_V3_SCALE.md
processor/TEST_PAYLOADS_V3.md
```

## Step 6.1 — Create Google Sheet
1. สร้าง Google Sheet ใหม่
2. ตั้งชื่อ: `AGIS Agent Armada State DB`
3. Copy Spreadsheet ID จาก URL

## Step 6.2 — Create Apps Script
1. เปิด Google Sheet
2. Extensions → Apps Script
3. ลบโค้ดเดิม
4. วาง `Code_v2_LevelClone.gs`
5. เพิ่มไฟล์ใหม่ `ScaleAddon_v3.gs`
6. เพิ่มไฟล์ใหม่ `Code_v3_RouterPatch.gs`

## Step 6.3 — Set Script Property
Apps Script → Project Settings → Script Properties

```text
SPREADSHEET_ID = <Google Sheet ID>
AUTH_TOKEN = <ตั้งรหัสลับเอง ถ้าต้องการ>
```

ถ้าตั้ง `AUTH_TOKEN` ทุก POST ต้องส่ง `token` ให้ตรงกัน

## Step 6.4 — Deploy Web App
1. Deploy → New deployment
2. Type: Web app
3. Execute as: Me
4. Who has access: Anyone with the link หรือเฉพาะองค์กร ถ้าใช้งานภายใน
5. Copy Web App URL

## Step 6.5 — First Test
เปิด Web App URL ด้วย browser ต้องเห็น JSON:
```json
{
  "ok": true,
  "system": "AGIS Agent Armada Processor v3"
}
```

## Step 6.6 — POST Test Order
ทดสอบตามลำดับ:
1. setup
2. job.create
3. job.route
4. mission.update แบบไม่มี evidence ต้อง fail
5. receipt.create
6. level.award
7. skill.mastery
8. clone.create
9. clone.merge
10. blocker.report
11. scale.evaluate
12. recruit.request
13. expert.register
14. skill.revise
15. dashboard.state

## Acceptance Criteria
- [ ] Google Sheet มีทุก tab v1/v2/v3
- [ ] Agents seed ครบ 10 คน
- [ ] job.create สร้าง Jobs row
- [ ] job.route สร้าง Missions row
- [ ] Mission Done ไม่มี evidence แล้วระบบ reject
- [ ] receipt.create ต้องมี evidence
- [ ] level.award เพิ่ม XP และ Level
- [ ] clone.create / clone.merge ใช้ได้
- [ ] blocker.report / scale.evaluate ใช้ได้
- [ ] recruit.request สร้างคำขอ expert ได้
- [ ] dashboard.state แสดง KPI v3

## Evidence / Receipt
เก็บหลักฐาน:
- Apps Script Web App URL
- Screenshot Sheet tabs
- Screenshot API responses
- Test payload + response
- GitHub commit / file path

## Next Step
Step 7: ต่อ Lovable Command Center ด้วย Processor URL และสร้าง UI สำหรับ Job / Mission / Level / Clone / Scale
