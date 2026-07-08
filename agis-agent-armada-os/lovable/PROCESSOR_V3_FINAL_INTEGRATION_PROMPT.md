# Lovable Prompt — Processor v3 Final Integration

ใช้ prompt นี้กับ Lovable Command Center หลัง deploy Apps Script Web App แล้ว

## Prompt

เชื่อม AGIS Agent Armada Command Center กับ Processor v3 Web App

### Settings
เพิ่มหน้า Settings:
- Processor Web App URL
- AUTH_TOKEN optional
- ปุ่ม Test Connection ใช้ GET และแสดง system/version/actions
- เก็บค่าใน localStorage

### API Client
ใช้ fetch แบบไม่ trigger preflight:
```ts
async function callProcessor(action: string, payload: any = {}) {
  const url = localStorage.getItem('processorUrl')
  const token = localStorage.getItem('processorToken')
  if (!url) throw new Error('Processor URL not set')
  const body: any = { action, payload }
  if (token) body.token = token
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(body)
  })
  return await res.json()
}
```

### Pages / Tabs
1. Dashboard v3
- Show KPI: jobs, missions, agents, receipts, doneMissions, reviewMissions, evidenceRate
- Add: clonesActive, clonesDone, seniorSkills, masterSkills, legendarySkills, avgAgentLevel, topAgentByXp
- Add: blockersOpen, blockersResolved, recruitRequests, expertsActive, skillRevisions, pendingApprovals

2. Job Center
- create job
- route job
- mission list
- update mission with evidence

3. Level + Clone Center
- level.award
- skill.mastery
- clone.create
- clone.merge

4. Fleet Scale Center
- blocker.report
- scale.evaluate
- recruit.request
- expert.register
- skill.revise

5. Receipt Center
- receipt.create
- show evidence and QA status

### Professional Rules
- Mission Done requires evidenceUrl
- Receipt requires evidence
- Skill Mastery requires evidenceUrl
- Clone Merge requires receiptId
- Recruit Warlord/Emperor shows Pending Boss Approval
- Expert authorityLimit must display clearly

### Design
Dark naval brown/gold RPG operations dashboard, clean tables, status badges, stepper workflow.

### Stepper Flow
Boss Command → Job Card → Route → Mission → Evidence → Receipt → Level/Clone → Blocker/Scale if needed → Skill Revise → Done
