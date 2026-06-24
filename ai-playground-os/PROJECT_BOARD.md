# PROJECT_BOARD.md — AI Playground OS Roadmap

## Project Status

```text
Stage: Integrated MVP Blueprint
Repo: anuchit1tube168-cmd/RTAFNC-
Folder: ai-playground-os/
Owner: Boss Agis
Mode: Clip → Research → GitHub → Prototype → Deploy
```

---

## Board

### Backlog

| ID | งาน | Room | Priority | Status |
|---|---|---|---|---|
| APG-001 | สร้าง README/SKILL/AGENTS | Core | P0 | Done |
| APG-002 | สร้าง dashboard prototype | Prototype Studio | P0 | Done |
| APG-003 | เพิ่ม Clip Intake Form | Clip Intake | P1 | Next |
| APG-004 | เพิ่ม Research Source Tracker | Deep Research | P1 | Next |
| APG-005 | เพิ่ม GitHub Issue Generator | GitHub Factory | P1 | Next |
| APG-006 | เพิ่ม Command Center KPI | Command Center | P1 | Next |
| APG-007 | เพิ่ม Content Office สำหรับ TikTok/Facebook/Shopee/YouTube | Content Office | P2 | Backlog |
| APG-008 | เพิ่ม RTAFNC Ops Room | RTAFNC Ops | P2 | Backlog |
| APG-009 | ต่อ Firebase/Apps Script backend | Backend | P3 | Later |
| APG-010 | ต่อ LINE LIFF / Telegram notify | Automation | P3 | Later |

---

## Sprint 1 — Static MVP

### Goal
สร้างระบบต้นแบบที่เปิดดูได้จาก GitHub Pages และใช้เป็นศูนย์รวมงานถอดคลิปเป็นโปรเจกต์

### Scope
- Static HTML dashboard
- Mock data
- Room cards
- Project pipeline
- Manual checklist

### Acceptance Criteria
- [x] มี folder `ai-playground-os/`
- [x] มี `README.md`
- [x] มี `SKILL.md`
- [x] มี `AGENTS.md`
- [x] มี `PROJECT_BOARD.md`
- [x] มี `index.html`
- [ ] เปิดผ่าน GitHub Pages path ได้
- [ ] มือถืออ่านได้
- [ ] ไม่มี secret/token

---

## Sprint 2 — Clip to Issue

### Goal
ใส่ฟอร์มให้ผู้ใช้กรอก clip brief แล้วระบบ generate issue text ได้

### Tasks
- [ ] เพิ่ม textarea สำหรับ clip summary
- [ ] เพิ่ม dropdown เลือก room
- [ ] เพิ่มปุ่ม Generate GitHub Issue Markdown
- [ ] เพิ่ม copy button
- [ ] เพิ่มตัวอย่าง issue APG-003

### Files
- `ai-playground-os/index.html`

---

## Sprint 3 — Research Tracker

### Goal
ทำตารางเก็บแหล่งข้อมูลและระดับความน่าเชื่อถือ

### Tasks
- [ ] เพิ่ม source list table
- [ ] แยก official / news / community / unknown
- [ ] เพิ่ม risk score
- [ ] เพิ่มช่อง decision: use / monitor / reject

### Files
- `ai-playground-os/index.html`
- `ai-playground-os/research-template.md`

---

## Sprint 4 — RTAFNC Integration Layer

### Goal
เอา Playground OS ไปใช้เป็น command center สำหรับระบบ วพอ. โดยไม่ปนข้อมูลจริง

### Rooms ที่จะเพิ่ม
- Good Deed Room
- Leave LINE Room
- Scholarship Room
- Procurement Room
- Rubric Room
- Document Room
- Care & Finance Room

### Safety Rule
ใช้เฉพาะ metadata และ mock data ในหน้า public เท่านั้น ข้อมูลจริงต้องไป backend/private storage

---

## Risk Register

| Risk | Impact | Mitigation |
|---|---|---|
| เอาคลิปมาใช้เกินสิทธิ์ | สูง | ใช้เป็น inspiration/summary ไม่ copy เต็ม |
| token รั่วใน frontend | สูงมาก | ห้ามใส่ API key ใน HTML/JS public |
| ข้อมูลนักเรียนรั่ว | สูงมาก | ใช้ mock data, backend แยก, human approval |
| โปรเจกต์รวมกันจนมั่ว | กลาง | แยก room/folder/module ชัดเจน |
| AI สร้างโค้ดผิด | กลาง | ใช้ issue + acceptance criteria + human review |
| GitHub Actions fail | กลาง | เริ่ม static ก่อน ยังไม่เพิ่ม workflow จนพร้อม |

---

## Done Log

- Created integrated project folder
- Added project overview
- Added AI skill file
- Added agent manifest
- Added project board
- Added static dashboard prototype

---

## Next Command for AI Coding Agent

```text
Implement APG-003: Add Clip Intake Form to ai-playground-os/index.html.
Follow AGENTS.md. Use mock data only. Do not touch other folders.
```
