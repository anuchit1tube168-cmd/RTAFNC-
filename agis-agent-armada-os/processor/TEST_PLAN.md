# TEST_PLAN — Processor v1

## Test 1: Setup Sheets
Request:
```json
{
  "action": "setup",
  "payload": {}
}
```
Expected:
- ok = true
- Google Sheet has tabs: Jobs, Missions, Agents, Skills, Evidence, Receipts, Decisions, Logs, Levels, Config
- Agents seeded 10 rows

## Test 2: Create Job
Request:
```json
{
  "action": "job.create",
  "payload": {
    "bossCommand": "สร้างระบบบันทึกความดีจาก SOP",
    "onePiece": "ระบบบันทึกความดีที่ใช้งานได้จริง",
    "jobType": "Build",
    "priority": "High"
  }
}
```
Expected:
- ok = true
- jobId starts with JOB-
- Jobs row created
- status = Intake

## Test 3: Route Job
Request:
```json
{
  "action": "job.route",
  "payload": {
    "jobId": "JOB-..."
  }
}
```
Expected:
- starter missions generated
- Missions rows created
- Job status = Routing

## Test 4: Update Mission Without Evidence
Request:
```json
{
  "action": "mission.update",
  "payload": {
    "missionId": "MIS-...",
    "status": "Done"
  }
}
```
Expected:
- ok = false
- error = Evidence required before Done

## Test 5: Update Mission With Evidence
Request:
```json
{
  "action": "mission.update",
  "payload": {
    "missionId": "MIS-...",
    "status": "Done",
    "evidenceUrl": "https://example.com/evidence"
  }
}
```
Expected:
- ok = true
- status = Done
- evidenceUrl stored

## Test 6: Create Receipt
Request:
```json
{
  "action": "receipt.create",
  "payload": {
    "jobId": "JOB-...",
    "missionId": "MIS-...",
    "evidence": "https://example.com/evidence",
    "testResult": "Pass",
    "summaryTH": "ผ่านการทดสอบ",
    "summaryEN": "Test passed"
  }
}
```
Expected:
- ok = true
- receiptId starts with REC-
- Receipts row created

## Test 7: Dashboard State
Request:
```json
{
  "action": "dashboard.state",
  "payload": {}
}
```
Expected:
- kpi returned
- jobs, missions, agents arrays returned
