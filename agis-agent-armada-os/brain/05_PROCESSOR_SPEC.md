# 05_PROCESSOR_SPEC — Processor Layer

## Purpose
หน่วยประมวลผลที่ทำให้ Brain ทำงานจริง ไม่ใช่แค่เอกสาร

## Recommended Phase 1 Stack
- UI: Lovable Command Center
- Processor: Google Apps Script
- Job State DB: Google Sheet
- Knowledge Lake: Google Drive
- Brain Repo: GitHub
- Notification: LINE / Gmail / Google Chat ในเฟสถัดไป

## Processor Responsibilities
1. Receive command from UI/form/webhook
2. Create Job Card
3. Read router policy
4. Classify job type
5. Select hat set
6. Generate missions
7. Write Jobs and Missions to Sheet
8. Track evidence and receipt
9. Mark approval needed when required
10. Export summary and receipt

## Suggested Endpoints
```text
POST /job/create
POST /job/route
POST /mission/update
POST /receipt/create
GET /dashboard/state
GET /agent/summary
POST /approval/request
POST /approval/decision
```

## Sheet Tabs
- Jobs
- Missions
- Agents
- Skills
- Evidence
- Receipts
- Decisions
- Logs
- Levels
- Config

## Processing Loop
Input Sensor → Brain Router → Decision Engine → Agent Dispatcher → Work Queue → Validator → Memory Writer → Level Engine

## Safety Gate
Processor ต้องตรวจ approvalStatus ก่อนงานที่มีผลต่อข้อมูลจริง บัญชีจริง ค่าใช้จ่าย หรือการเผยแพร่สาธารณะ

## Phase 2 Upgrade
เมื่อข้อมูลโต ให้ย้าย Job State DB ไป Supabase/PostgreSQL และใช้ Cloudflare Worker หรือ Supabase Edge Functions เป็น processor
