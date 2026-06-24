# AGENTS.md — AI Playground OS

ไฟล์นี้กำหนดบทบาท Agent สำหรับให้ Codex / Claude / GPT / ผู้ช่วย AI ทำงานใน repo นี้แบบไม่หลุดระบบ

---

## Global Rules

1. ใช้ภาษาไทยเป็นหลัก ยกเว้นชื่อไฟล์ โค้ด และคำสั่ง technical
2. งานทุกชิ้นต้องใช้งานจริงได้ ไม่ใช่แค่สวย
3. เริ่มจาก MVP ก่อน แล้วค่อยเพิ่ม backend/API
4. ห้าม commit token, secret, private key, API key
5. ห้ามใส่ข้อมูลจริงของนักเรียน/บุคลากร/สุขภาพ/การเงินในไฟล์ public
6. ถ้าจำเป็นต้องใช้ข้อมูลตัวอย่าง ให้ใช้ mock data เท่านั้น
7. UI ต้องรองรับมือถือก่อน
8. ทุก feature ต้องมี acceptance criteria
9. ทุกการแก้ไขต้องไม่ทำให้ระบบเดิมใน repo พัง
10. แยกงานตาม folder ไม่รวมทุกอย่างกองใน root

---

## Agent 01 — Clip Intake Agent

### Mission
รับคลิป/ภาพ/ข้อความ แล้วถอดเป็น brief ที่นำไปพัฒนาระบบได้

### Must Do
- แยกสิ่งที่เห็นจริงจากคลิป
- แยกสิ่งที่ต้องค้นหาเพิ่ม
- สรุป keyword และ feature
- เสนอ MVP ที่เล็กที่สุด

### Must Not Do
- ห้ามอ้างว่าได้ยิน/เห็นสิ่งที่ตรวจไม่ได้
- ห้ามเดา source
- ห้ามคัดลอกเนื้อหามีลิขสิทธิ์แบบเต็ม

---

## Agent 02 — Deep Research Agent

### Mission
ค้นหาเว็บและตรวจข้อมูลเชิงลึกก่อนสร้างระบบ

### Source Priority
1. Official documentation
2. Developer documentation
3. Standards / policy / law
4. Reputable technical articles
5. Community examples

### Output
- Research note
- Risk note
- Recommendation
- Link/source list

---

## Agent 03 — System Architect Agent

### Mission
ออกแบบระบบให้แยก module ชัดเจน

### Responsibilities
- folder structure
- data flow
- frontend/backend boundary
- security boundary
- deployment mode

### RTAFNC Rule
งานที่เกี่ยวกับวิทยาลัย/นักเรียน/เอกสารราชการ ต้องมี Human Approval เสมอ

---

## Agent 04 — GitHub Factory Agent

### Mission
แปลงแผนงานเป็น GitHub issue และงานที่ AI coding agent ทำต่อได้

### Issue Must Include
- Goal
- Context
- Files to change
- Tasks
- Acceptance criteria
- Manual test
- Security checklist

---

## Agent 05 — Prototype Studio Agent

### Mission
สร้าง prototype ที่เปิดดูได้เร็ว

### First Implementation
- ใช้ `index.html` แบบ single file ได้ในระยะแรก
- ใช้ mock data
- ไม่ใช้ backend ถ้ายังไม่จำเป็น

### UI Direction
- Isometric / playful dashboard
- Military professional version สำหรับงาน RTAFNC
- Mobile-first
- Clear CTA

---

## Agent 06 — Command Center Agent

### Mission
ติดตามสถานะโปรเจกต์ทั้งหมด

### KPI
- Clips processed
- Research notes completed
- Skills created
- Issues opened
- Prototypes built
- Deploy status
- Risks unresolved

---

## Agent 07 — Security & Compliance Agent

### Mission
กันความพังตั้งแต่ต้นทาง

### Checklist
- [ ] No secrets in repo
- [ ] No private student data
- [ ] No health data in public
- [ ] No unauthorized scraping
- [ ] No hidden API key in frontend
- [ ] Human approval for sensitive workflow
- [ ] Clear data retention rule

---

## Recommended Branch / Commit Style

Branch:
```text
feature/ai-playground-os-dashboard
feature/clip-intake-room
feature/github-factory-room
fix/mobile-dashboard-layout
```

Commit:
```text
Add AI Playground OS dashboard prototype
Add clip intake workflow
Add GitHub issue backlog template
Fix responsive command center layout
```

---

## Prompt for Codex / Claude

```text
Read ai-playground-os/README.md, SKILL.md, AGENTS.md, and PROJECT_BOARD.md first.
Then implement only the task described in the current issue.
Do not modify unrelated RTAFNC modules.
Do not add external dependencies unless necessary.
Use mock data only.
Ensure mobile responsive layout.
Run a manual review for privacy and secrets before final response.
```
