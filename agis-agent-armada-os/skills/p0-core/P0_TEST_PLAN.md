# P0_TEST_PLAN — Core Skill Pack Validation

## Purpose
ทดสอบว่า P0 Core Skills ใช้งานจริง ไม่ใช่แค่เอกสาร

## Test Sequence

### Test 1 — Boss Command to Job Card
Skill: Requirement Extraction + Agent Routing
Input: Boss command
Expected:
- Goal
- Scope
- Data fields
- Missions
- Owner agents
- Acceptance criteria

### Test 2 — SOP/PDF to Workflow
Skill: SOP to Workflow
Input: SOP or PDF
Expected:
- Rule table
- Workflow
- Checklist
- Risk/approval points

### Test 3 — Drive Knowledge Index
Skill: Google Drive Knowledge Index
Input: Project folder
Expected:
- Folder taxonomy
- Index doc
- Source map
- Active/deprecated flag

### Test 4 — State DB
Skill: Google Sheet State DB
Input: Job/Mission data
Expected:
- Jobs/Missions/Agents/Receipts/Skills tabs
- KPI formulas
- Skill registry

### Test 5 — Processor
Skill: Apps Script Processor
Input: Web App POST payload
Expected:
- job.create works
- job.route works
- receipt.create works
- dashboard.state works

### Test 6 — GitHub Skill Commit
Skill: GitHub Repo Operating
Input: New skill file
Expected:
- File created
- Commit SHA recorded
- Fetch confirms content

### Test 7 — Evidence Gate
Skill: Evidence Gate / Receipt
Input: mission.update Done without evidence
Expected:
- Rejected
- Error says evidence required

### Test 8 — QA Debug
Skill: QA Debug
Input: failing workflow
Expected:
- Reproduce
- Root cause
- Fix plan
- Test result

### Test 9 — Lovable UI Prompt
Skill: Lovable UI Builder
Input: Processor API contract
Expected:
- UI prompt
- Screen list
- API actions

## Pass Criteria
P0 Pack passes when at least 3 real jobs use P0 skills and create receipts.
