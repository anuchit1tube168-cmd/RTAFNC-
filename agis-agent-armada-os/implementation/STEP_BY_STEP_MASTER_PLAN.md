# STEP_BY_STEP_MASTER_PLAN — ทำแบบมืออาชีพทีละ Step

## Goal
สร้าง AGIS Agent Armada OS แบบเป็นระบบ ไม่กระโดดข้ามขั้น จบทีละชั้น ตรวจทีละจุด และเก็บ receipt ทุกครั้ง

## Professional Build Rule
ทุก Step ต้องมี:
- Objective
- Output
- Owner Agent
- Acceptance Criteria
- Test Plan
- Evidence / Receipt
- Next Step

## Step 1: Brain Layer
Status: Done
Output:
- brain/00_BRAIN_CORE.md
- brain/01_ROUTER_POLICY.md
- brain/02_DECISION_ENGINE.md
- brain/03_AGENT_DISPATCH.md
- brain/04_MEMORY_AND_RECEIPT.md
- brain/05_PROCESSOR_SPEC.md
- brain/06_JOB_STATE_SCHEMA.md

## Step 2: Agent Roles + Hat Matrix
Status: Done
Output:
- agents/*/SKILL.md
- HAT_MATRIX.md
- MODE_SWITCHING_PROTOCOL.md
- modes/*/LLM_WIKI.md

## Step 3: Processor v1
Status: Done
Output:
- processor/apps-script/Code.gs
- processor/API_CONTRACT.md
- processor/TEST_PLAN.md
- processor/sheets/GOOGLE_SHEET_TEMPLATE.md

## Step 4: Level + Clone
Status: Done
Output:
- leveling/*
- cloning/*
- processor/apps-script/Code_v2_LevelClone.gs

## Step 5: Fleet Scale + Expert Recruit
Status: In Progress
Objective:
ทำให้ระบบรู้ว่าเมื่อไรต้องเพิ่มลูกเรือ ผู้เชี่ยวชาญ หรือ revise skill

Output Target:
- scaling/* protocols
- processor scale actions
- blocker/recruit/expert/revision schema
- Lovable Scale UI prompt

## Step 6: Real Google Sheet + Apps Script Deploy
Status: Next
Objective:
สร้าง Sheet จริง วาง Code v3 และ deploy Web App

## Step 7: Lovable Command Center Integration
Status: Next
Objective:
เชื่อม UI กับ Processor URL และทดสอบกดงานจริง

## Step 8: Drive Big Data Index
Status: Later
Objective:
สร้าง index ดึง Google Drive / Skill MD / SOP / Big Data เข้าสมอง

## Step 9: Automation Watch
Status: Later
Objective:
ให้ระบบตรวจ blocker, review, approval, missing evidence แบบรอบเวลา

## Step 10: Production Governance
Status: Later
Objective:
Permission, approval, audit, security, backup, export
