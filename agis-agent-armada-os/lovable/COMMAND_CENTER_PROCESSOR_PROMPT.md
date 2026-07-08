# Lovable Prompt — Connect Command Center to Processor v1

ใช้ prompt นี้ใน Lovable project AGIS Agent Armada เพื่อเชื่อม UI กับ Google Apps Script Processor

## Prompt

เพิ่มหน้า Settings สำหรับใส่ Processor Web App URL และเก็บใน localStorage

เพิ่ม API client สำหรับเรียก Google Apps Script Processor ด้วย JSON body:

```ts
async function callProcessor(action: string, payload: any) {
  const url = localStorage.getItem('processorUrl')
  if (!url) throw new Error('Processor URL not set')
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action, payload })
  })
  return await res.json()
}
```

เพิ่มปุ่ม:
- Setup Sheets → action `setup`
- Create Job Card → action `job.create`
- Route Job → action `job.route`
- Update Mission → action `mission.update`
- Create Receipt → action `receipt.create`
- Refresh Dashboard → action `dashboard.state`

เพิ่มหน้า Dashboard ให้แสดง kpi จาก `dashboard.state`:
- jobs
- missions
- agents
- receipts
- doneMissions
- reviewMissions
- evidenceRate

เพิ่มฟอร์ม Create Job:
- bossCommand
- onePiece
- jobType
- priority

เมื่อ create job สำเร็จ ให้แสดง jobId และปุ่ม Route Job

กติกา UI:
- ถ้า mission status Done แต่ไม่มี evidence ให้แสดง error
- ถ้า approvalRequired = true ให้แสดง badge Pending Boss Approval
- ทุก receipt ต้องมี evidence

ดีไซน์ใช้ RPG dashboard dark naval brown/gold ตามเดิม
