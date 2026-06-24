# PROJECT_BOARD.md — AI Playground OS Roadmap

## Project Status

```text
Stage: Working Static MVP
Repo: anuchit1tube168-cmd/RTAFNC-
Folder: ai-playground-os/
Owner: Boss Agis
Mode: Clip → Research → GitHub → Prototype → Deploy
Last Updated: 2026-06-24
```

---

## Board

### Backlog

| ID | งาน | Room | Priority | Status |
|---|---|---|---|---|
| APG-001 | สร้าง README/SKILL/AGENTS | Core | P0 | Done |
| APG-002 | สร้าง dashboard prototype | Prototype Studio | P0 | Done |
| APG-003 | เพิ่ม Clip Intake Form | Clip Intake | P1 | Done |
| APG-004 | เพิ่ม Research Source Tracker | Deep Research | P1 | Done |
| APG-005 | เพิ่ม GitHub Issue Generator | GitHub Factory | P1 | Done |
| APG-006 | เพิ่ม Command Center KPI | Command Center | P1 | Done |
| APG-007 | เพิ่ม RTAFNC Ops Room แบบ mock data | RTAFNC Ops | P1 | Done |
| APG-008 | เพิ่ม Content Office สำหรับ TikTok/Facebook/Shopee/YouTube | Content Office | P2 | Next |
| APG-009 | เพิ่ม localStorage save/load | Frontend | P2 | Next |
| APG-010 | เพิ่ม export/import JSON | Frontend | P2 | Next |
| APG-011 | แยก styles.css และ app.js เมื่อระบบใหญ่ขึ้น | Refactor | P3 | Later |
| APG-012 | ต่อ Firebase/Apps Script backend | Backend | P3 | Later |
| APG-013 | ต่อ LINE LIFF / Telegram notify | Automation | P3 | Later |

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
- [x] หน้าเว็บมี mobile responsive CSS
- [x] ไม่มี secret/token ในไฟล์ frontend
- [ ] เปิดผ่าน GitHub Pages path และตรวจด้วยตาจริง

---

## Sprint 2 — Clip to Issue

### Goal
ใส่ฟอร์มให้ผู้ใช้กรอก clip brief แล้วระบบ generate issue text ได้

### Tasks
- [x] เพิ่ม textarea สำหรับ clip summary
- [x] เพิ่ม dropdown เลือก room
- [x] เพิ่มปุ่ม Generate GitHub Issue Markdown
- [x] เพิ่ม copy button
- [x] เพิ่มตัวอย่าง issue APG-003

### Files
- `ai-playground-os/index.html`
- `ai-playground-os/github-issue-template.md`

---

## Sprint 3 — Research Tracker

### Goal
ทำตารางเก็บแหล่งข้อมูลและระดับความน่าเชื่อถือ

### Tasks
- [x] เพิ่ม source list table
- [x] แยก official / developer / news / community / unknown
- [x] เพิ่ม risk score
- [x] เพิ่มช่อง decision: use / use with review / reject
- [x] เพิ่ม research template

### Files
- `ai-playground-os/index.html`
- `ai-playground-os/research-template.md`

---

## Sprint 4 — RTAFNC Integration Layer

### Goal
เอา Playground OS ไปใช้เป็น command center สำหรับระบบ วพอ. โดยไม่ปนข้อมูลจริง

### Rooms ที่เพิ่มแล้ว
- Good Deed Room
- Leave LINE Room
- Scholarship Room
- Procurement Room
- Rubric Room
- Document Room
- Content Office
- Security Room

### Safety Rule
ใช้เฉพาะ metadata และ mock data ในหน้า public เท่านั้น ข้อมูลจริงต้องไป backend/private storage

---

## Sprint 5 — Content Office

### Goal
เพิ่มห้องผลิตคอนเทนต์สำหรับ TikTok / Facebook / Shopee / YouTube จาก Clip Brief เดียว

### Tasks
- [ ] เพิ่ม content brief form
- [ ] เพิ่ม social post generator
- [ ] เพิ่ม caption / hook / CTA / hashtag output
- [ ] เพิ่ม platform checklist
- [ ] เพิ่ม content risk checklist

---

## Sprint 6 — Data Persistence

### Goal
ทำให้หน้า prototype จำข้อมูลได้ในเครื่องและ export ได้โดยไม่ต้องมี backend

### Tasks
- [ ] เพิ่ม localStorage save/load
- [ ] เพิ่ม export JSON
- [ ] เพิ่ม import JSON
- [ ] เพิ่ม clear all data
- [ ] เพิ่ม print / export markdown

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
| Frontend ใหญ่เกินไฟล์เดียว | กลาง | เมื่อใหญ่ขึ้นให้แยก `styles.css` และ `app.js` |

---

## Done Log

- Created integrated project folder
- Added project overview
- Added AI skill file
- Added agent manifest
- Added project board
- Added static dashboard prototype
- Added Clip Intake Form
- Added GitHub Issue Generator
- Added Research Source Tracker
- Added RTAFNC Ops mock integration layer
- Added research template
- Added GitHub issue template
- Added workflow map

---

## Next Command for AI Coding Agent

```text
Read ai-playground-os/README.md, SKILL.md, AGENTS.md, PROJECT_BOARD.md, workflow-map.md, research-template.md, and github-issue-template.md first.
Implement APG-009 and APG-010: add localStorage save/load and export/import JSON to ai-playground-os/index.html.
Use mock data only. Do not touch unrelated folders. Do not add API keys or secrets.
```
