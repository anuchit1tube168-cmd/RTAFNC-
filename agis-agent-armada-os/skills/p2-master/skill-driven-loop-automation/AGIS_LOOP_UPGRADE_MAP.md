# AGIS Loop Automation Upgrade Map v1

Date: 2026-07-09  
Owner: AGIS + Fable + Doctor  
Mission: แปลงแนวคิด Claude Loops ให้เข้ากับ 30 Skills ของ AGIS Agent Armada OS และอัปเกรดเป็นระบบ loop automation ที่ควบคุมได้จริง

## Executive Summary

แนวคิด Claude Loops ที่ Boss ส่งมาไม่ควรถูกใช้เป็น routine อัตโนมัติทันที แต่ต้องแปลงเป็นระบบของ AGIS ดังนี้:

```text
Existing Skill Library
→ Loop Skill Matrix
→ Manual Test x3
→ Human Approval Gate
→ Run Log
→ Receipt
→ Routine / Automation
→ Ecosystem Monitoring
```

AGIS มีฐาน skills พร้อมแล้ว 30 ตัว ดังนั้นงานที่ต้องทำไม่ใช่สร้างใหม่ทั้งหมด แต่คือจัด skill ที่มีอยู่ให้กลายเป็น loop engine ที่ปลอดภัยและตรวจสอบได้

---

## 1. data-ingestion-loop

### เป้าหมาย
ดูดข้อมูลจากแหล่งภายใน เช่น Drive, Gmail, Calendar, Sheet, แชท, เอกสารประชุม แล้วตัด noise เหลือ insight ที่ใช้ทำงานได้

### Skills ที่ใช้
- google-drive-knowledge-index
- google-sheet-state-db
- requirement-extraction
- evidence-gate-receipt
- risk-compliance
- big-data-knowledge-brain

### Owner / Backup
- Owner: Archaeologist
- Backup: Doctor
- Controller: AGIS

### Manual Test
1. อ่านไฟล์/ข้อความ 24 ชั่วโมงล่าสุด
2. แยก noise ออกจากสาระ
3. สร้าง Knowledge Inbox 1 ชุด
4. เขียน run log
5. สร้าง receipt

---

## 2. external-alpha-farming-loop

### เป้าหมาย
ล่า insight จากโลกภายนอก เช่น YouTube, GitHub, paper, newsletter, Reddit, market report แล้วแปลงเป็น skill/project/content

### Skills ที่ใช้
- youtube-to-skill-md
- prompt-pack-builder
- shopee-affiliate-analysis
- seo-marketing-hook
- risk-compliance
- evidence-gate-receipt

### Owner / Backup
- Owner: Sniper
- Backup: Fable
- QA: Doctor

### Guardrail
ทุก external claim ต้องมี source/citation และต้องแยก basic summary ออกจาก level-2 insight

---

## 3. internal-alpha-farming-loop

### เป้าหมาย
ขุดปัญหาซ้ำ ๆ จากข้อมูลภายใน เช่น งาน วพอ., WebApp, เอกสาร, รายงาน, คำสั่ง, งานนักเรียน แล้วแปลงเป็น implementation plan

### Skills ที่ใช้
- big-data-knowledge-brain
- google-drive-knowledge-index
- google-sheet-state-db
- project-recovery
- system-skill-gap-audit
- sop-to-workflow
- requirement-extraction

### Owner / Backup
- Owner: Archaeologist
- Backup: Swordsman
- QA: Doctor

### Manual Test
ใช้โปรเจกต์ Dashboard ประเมิน วพอ. หา blocker ซ้ำ สร้าง implementation plan และผ่าน plan verification

---

## 4. optimization-loop

### เป้าหมาย
รีดประสิทธิภาพด้วยวงจร measure → improve → measure

### Skills ที่ใช้
- dashboard-design
- qa-debug
- failure-debugging
- webapp-deployment
- apps-script-processor
- organization-automation

### Owner / Backup
- Owner: Doctor
- Backup: Shipwright
- Controller: AGIS

### Metrics ที่เหมาะกับ Boss
- เวลา generate รายงานลดลง 50%
- เวลาเปิด dashboard ต่ำกว่า 2 วินาที
- ลดงาน manual approval 30%
- ลด error จาก GAS/WebApp
- เพิ่มจำนวนงานที่มี receipt 100%

### Guardrail
แก้ทีละจุดเท่านั้น ห้ามปรับหลายตัวแปรพร้อมกัน

---

## 5. code-build-loop

### เป้าหมาย
สร้าง software/webapp แบบมีขั้นตอน ไม่ให้ AI เขียนโค้ดยาวแล้วเละ

### Skills ที่ใช้
- requirement-extraction
- system-architect
- agent-routing
- github-repo-operating
- lovable-ui-builder
- apps-script-processor
- qa-debug
- failure-debugging
- evidence-gate-receipt
- risk-compliance

### Six-Step AGIS Chain

```text
1 Requirement Extraction
2 System Architecture
3 Human Approval Gate
4 Build / Implement
5 Code Review + Fix
6 Verify + Receipt
```

### Owner / Backup
- Owner: Shipwright
- Backup: Doctor
- Controller: AGIS

### Approval Gate
ต้องหยุดรอคนอนุมัติเมื่อกระทบ production, ข้อมูลจริง, public deploy, เอกสารราชการ, หรือระบบนักเรียน/ข้อมูลส่วนบุคคล

---

## 6. improve-system-loop

### เป้าหมาย
ให้ AGIS เก่งขึ้นเองจาก receipt, failure, run log, skill gap

### Skills ที่ใช้
- skill-revision
- system-skill-gap-audit
- failure-debugging
- expert-recruit-scale
- ai-agent-team-orchestration
- multi-model-routing
- project-recovery
- personal-operating-system

### Three-Bucket System

```text
Auto-approve:
- เพิ่ม example
- เพิ่ม checklist
- แก้คำอธิบายเล็กน้อย

Need sign-off:
- แก้ core rule
- เปลี่ยน routing
- เปลี่ยน approval gate
- แก้ production workflow

More context needed:
- ข้อมูลไม่พอ
- source ขัดแย้ง
- ไม่รู้ owner
```

### Output
- changelog.md
- skill revision proposal
- missing skill ticket
- next training job

---

## 7. ecosystem-monitoring-loop

### เป้าหมาย
คุมลูปทั้งหมดไม่ให้ซ้ำซ้อน เปลือง token หรือทำงานผิด

### Skills ที่ใช้
- ai-agent-team-orchestration
- google-sheet-state-db
- evidence-gate-receipt
- clone-agent-protocol
- organization-automation
- big-data-knowledge-brain
- multi-model-routing
- risk-compliance

### Health Metrics
- loops run successfully
- failed runs
- token/cost estimate
- duplicated skills
- stale loops
- loops without receipt
- loops without owner

### Output
- Loop Health Dashboard
- Merge/Refactor Recommendation
- Pause List
- Duplicate Logic Report

---

## 8. north-star-loop

### เป้าหมาย
คุมทิศทางชีวิต/งาน/เงิน/วิจัย/องค์กรของ Boss ไม่ให้หลุดเป้าหมาย

### Skills ที่ใช้
- personal-operating-system
- ai-agent-team-orchestration
- dashboard-design
- big-data-knowledge-brain
- shopee-affiliate-analysis
- seo-marketing-hook
- thai-official-report
- system-architect

### North Star Buckets ของ Boss

```text
1 งาน วพอ./ราชการ
2 WebApp/Automation องค์กร
3 งานวิจัย/วิชาการ
4 รายได้เสริม/Shopee/อสังหา
5 Skill/AI Agent Team
6 สุขภาพ/เวลา/ครอบครัว
```

### Output
- 6-month forecast
- drift warning
- weekly priority reset
- next 3 missions
- stop-doing list

---

## Implementation Roadmap

### Phase 1 — Core Loop Skill
สร้าง skill หลัก `skill-driven-loop-automation`

### Phase 2 — Shared Utilities
สร้าง shared utilities:
- `write-run-log`
- `human-approval-gate`
- `loop-receipt-gate`
- `plan-verification`

### Phase 3 — First Production Loop
เริ่มจาก `code-build-loop` เพราะตรงกับงาน WebApp/HTML/GitHub ปัจจุบัน

### Phase 4 — System Health
เพิ่ม `ecosystem-monitoring-loop`

### Phase 5 — Personal/Strategy
เพิ่ม `north-star-loop`

## New AGIS Rule

```text
ห้ามตั้ง automation จนกว่า skill จะ manual pass 3 รอบ
ทุก loop ต้องมี run log
ทุก loop ต้องมี receipt
ทุก loop ต้องมี owner + backup
ทุก loop ต้องมี stop condition
ทุก high-risk loop ต้องมี human approval gate
ทุก loop ต้องลงท้ายด้วย -loop
```
