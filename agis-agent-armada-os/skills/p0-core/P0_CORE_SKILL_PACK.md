# P0_CORE_SKILL_PACK — 10 Core Skills for Boss + AGIS Crew

## Purpose
ติดตั้ง 10 Skill MD แรกที่จำเป็นที่สุด เพื่อให้ Boss และ AI Agent Team ทำงานจริงได้แบบมืออาชีพ ก่อนขยายไป P1/P2

## Core Rule
P0 ต้องใช้งานได้จริงก่อน ไม่ใช่แค่แผนฝึก

```text
Command → Requirement → Workflow → Data/Drive/Sheet → Build/Script/UI → QA → Evidence → Receipt → Level Up
```

---

# 1. Requirement Extraction Skill

## Purpose
ถอดคำสั่ง Boss หรือ requirement ลูกค้าให้กลายเป็น Goal, Scope, Data, User, Flow, Constraint, Acceptance Criteria

## Owner Agent
Captain AGIS + Navi Map

## Use When
- Boss สั่งงานใหม่
- Project ยังไม่ชัด
- ต้องทำ WebApp / SOP / Report / Dashboard

## Process
1. Extract Goal
2. Identify users
3. Identify data fields
4. Identify workflow
5. Identify constraints
6. Define acceptance criteria
7. Create Job Card

## Evidence
Requirement document / Job Card / acceptance criteria

## Level Up
Project Manager

---

# 2. SOP to Workflow Skill

## Purpose
แปลง SOP, ระเบียบ, PDF, คู่มือ ให้กลายเป็น workflow, checklist, approval point, rule table

## Owner Agent
Archive Eye + Copy Chef

## Process
1. Read source
2. Extract rule
3. Convert rule to workflow step
4. Add approval gate
5. Add risk point
6. Create checklist
7. Test with one scenario

## Evidence
Workflow doc / rule table / checklist

## Level Up
Process Designer

---

# 3. Google Drive Knowledge Index Skill

## Purpose
จัด Google Drive ให้เป็นคลังความรู้ ใช้ค้นซ้ำ อ้างอิง และดึงไปสร้าง Skill MD ได้

## Owner Agent
Archive Eye

## Process
1. Create folder taxonomy
2. Name files consistently
3. Add index document
4. Map source to skill/project
5. Mark active/deprecated
6. Add receipt link

## Evidence
Drive folder, index doc, file map

## Level Up
Knowledge Manager

---

# 4. Google Sheet State DB Skill

## Purpose
ใช้ Google Sheet เป็น State DB สำหรับ Jobs, Missions, Agents, Receipts, Skills, AgentSkillMap

## Owner Agent
Forge Dev + Archive Eye

## Process
1. Define sheet tabs
2. Define headers
3. Seed agents
4. Add formulas/KPI
5. Add receipt index
6. Test read/write

## Evidence
State DB sheet / screenshot / formula test

## Level Up
Data Analyst

---

# 5. Apps Script Processor Skill

## Purpose
สร้าง Apps Script เป็น processor ให้รับคำสั่งและ update State DB

## Owner Agent
Forge Dev

## Required Actions
- setup
- job.create
- job.route
- mission.update
- receipt.create
- dashboard.state

## Evidence
Code.gs / Web App URL / API test result

## Level Up
Automation Specialist

---

# 6. GitHub Repo Operating Skill

## Purpose
ใช้ GitHub เป็น source of truth สำหรับ skill, code, workflow, issue, commit, version history

## Owner Agent
Forge Dev + Brook Log

## Process
1. Create file
2. Fetch file
3. Update file
4. Record commit SHA
5. Link to receipt
6. Avoid overwriting without reading

## Evidence
GitHub commit log / file path / issue comment

## Level Up
DevOps Engineer

---

# 7. Lovable UI Builder Skill

## Purpose
สร้าง UI/Command Center ใช้งานจริงจาก workflow และ processor API

## Owner Agent
Forge Dev + Copy Chef

## Process
1. Define user flow
2. Create screen list
3. Define API actions
4. Create prompt for Lovable
5. Test preview
6. Connect to Processor URL

## Evidence
Lovable preview / UI screenshot / prompt file

## Level Up
UI/UX Designer

---

# 8. Evidence Gate / Receipt Skill

## Purpose
บังคับให้ทุกงานมีหลักฐานก่อน Done และสร้าง receipt หลังงานผ่าน

## Owner Agent
Bug Doctor + Brook Log

## Rules
- No Evidence = Not Done
- Evidence but QA failed = Review
- QA + Receipt = Done + XP

## Evidence
Receipt document / Evidence URL / QA status

## Level Up
Compliance Officer

---

# 9. QA Debug Skill

## Purpose
ตรวจ bug, reproduce error, isolate cause, fix ทีละจุด และทดสอบก่อนส่ง

## Owner Agent
Bug Doctor

## Process
1. Reproduce
2. Isolate
3. Identify root cause
4. Patch one part
5. Test
6. Regression check
7. Create QA report

## Evidence
Error log / test result / fix note

## Level Up
QA Manager

---

# 10. Agent Routing Skill

## Purpose
แปลงคำสั่ง Boss เป็น Job Card, mission split, owner agent, support agents, hat set และ evidence rule

## Owner Agent
Navi Map

## Process
1. Classify job type
2. Select owner agent
3. Select support agents
4. Split missions
5. Define done criteria
6. Define evidence required
7. Route to board

## Evidence
Routing log / Job Card / Mission list

## Level Up
Operations Manager

---

## Install Order
1. Requirement Extraction
2. Agent Routing
3. Evidence Gate / Receipt
4. Google Sheet State DB
5. GitHub Repo Operating
6. SOP to Workflow
7. Google Drive Knowledge Index
8. Apps Script Processor
9. QA Debug
10. Lovable UI Builder

## Done Criteria for P0 Pack
- All 10 skills registered
- Owner agent assigned
- Test job defined
- Evidence rule defined
- Receipt created after first real use
