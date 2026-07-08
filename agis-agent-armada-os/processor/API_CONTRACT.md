# API_CONTRACT — Processor v1

## Base
Google Apps Script Web App URL

## Request Format
All POST requests use JSON body:

```json
{
  "action": "job.create",
  "payload": {}
}
```

## Actions

### job.create
Create a new Job Card from Boss Command.

Payload:
```json
{
  "bossCommand": "สร้างระบบบันทึกความดีจาก SOP",
  "onePiece": "ระบบบันทึกความดีที่มี job board และ receipt",
  "jobType": "Build",
  "priority": "High"
}
```

Returns:
```json
{
  "ok": true,
  "jobId": "JOB-...",
  "job": {}
}
```

### job.route
Route job to agents and generate starter missions.

Payload:
```json
{
  "jobId": "JOB-..."
}
```

### mission.update
Update mission status/evidence.

Payload:
```json
{
  "missionId": "MIS-...",
  "status": "Review",
  "evidenceUrl": "https://..."
}
```

### receipt.create
Create receipt for a job/mission.

Payload:
```json
{
  "jobId": "JOB-...",
  "missionId": "MIS-...",
  "summaryTH": "...",
  "summaryEN": "...",
  "evidence": "...",
  "testResult": "Pass"
}
```

### dashboard.state
Return current state for Lovable UI.

Payload:
```json
{}
```

## Status Values
- Intake
- Routing
- Working
- Review
- WaitingApproval
- Done

## Mission Status
- Todo
- Doing
- Review
- Done

## Difficulty
E, D, C, B, A, S, SS
