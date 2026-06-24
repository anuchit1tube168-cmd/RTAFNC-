# github-issue-template.md — AI Playground OS Issue Template

ใช้สำหรับแตกงานจาก Clip Brief / Research Note ให้ Codex, Claude Code หรือ GPT ทำต่อได้เป็นชิ้น ๆ

---

## Standard Issue Template

```markdown
# [Room] Feature Title

## Goal
เขียนเป้าหมายให้ชัดใน 1–3 บรรทัด

## Context
สรุปจาก Clip Brief / Research Note เฉพาะที่จำเป็น

## User Story
ในฐานะ [ผู้ใช้] ฉันต้องการ [สิ่งที่ต้องทำ] เพื่อ [ผลลัพธ์]

## Files to Change
- `ai-playground-os/index.html`
- `ai-playground-os/README.md`
- `ai-playground-os/PROJECT_BOARD.md`

## Tasks
- [ ] วิเคราะห์ requirement
- [ ] แก้ UI / logic เฉพาะส่วนที่เกี่ยวข้อง
- [ ] ใช้ mock data เท่านั้น
- [ ] เพิ่ม responsive layout
- [ ] เพิ่ม manual test
- [ ] ตรวจ security/privacy

## Acceptance Criteria
- [ ] เปิดหน้าเว็บได้โดยไม่มี console error
- [ ] รองรับมือถือ
- [ ] copy output ได้ถ้าเป็น generator
- [ ] ไม่มี token/API key/secrets
- [ ] ไม่มีข้อมูลจริงของนักเรียน/บุคลากร
- [ ] มีข้อความเตือนเมื่อเกี่ยวกับ sensitive data

## Manual Test
1. เปิดหน้า `ai-playground-os/index.html`
2. ทดสอบบน mobile width
3. กรอกข้อมูล mock
4. กด generate/copy
5. ตรวจ console error
6. ตรวจ source code ว่าไม่มี secret

## Safety Checklist
- [ ] No secrets committed
- [ ] No private student data in public files
- [ ] No health/financial data in frontend
- [ ] No unauthorized scraping
- [ ] Human approval for sensitive workflow

## Next Step
หลังจบ issue นี้ งานต่อไปคืออะไร
```

---

## Prompt for Codex / Claude Code

```text
Read ai-playground-os/README.md, SKILL.md, AGENTS.md, PROJECT_BOARD.md, research-template.md, and github-issue-template.md first.
Implement only the task in this issue.
Do not modify unrelated folders.
Use mock data only.
Do not add external dependencies unless necessary.
Do not add API keys, tokens, or secrets.
Make the UI mobile responsive.
Return a summary of changed files, tests performed, and security checks.
```

---

## Recommended Labels

```text
ai-playground-os
clip-intake
deep-research
github-factory
prototype
security-review
rtainfc-sensitive
mock-data-only
```

---

## Issue Size Rule

ถ้า issue ใหญ่เกิน 1 หน้าจอมือถือ ให้แตกเป็น issue ย่อยทันที

ดี:
- เพิ่ม Clip Intake Form
- เพิ่ม Copy Issue Button
- เพิ่ม Research Tracker Table

ไม่ดี:
- ทำระบบ AI Playground OS ทั้งหมดให้เสร็จ
