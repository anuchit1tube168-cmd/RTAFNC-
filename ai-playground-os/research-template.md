# research-template.md — Deep Research Tracker

ใช้ไฟล์นี้สำหรับเก็บข้อมูลเชิงลึกก่อนสร้างระบบจริงบน GitHub

---

## Research Header

```markdown
# Research Note

## Topic

## Date

## Owner

## Project Room
- Clip Intake / Deep Research / Skill Factory / GitHub Factory / Prototype Studio / RTAFNC Ops

## Decision
- Use / Use with review / Monitor / Reject
```

---

## Source Quality Rules

| Source Type | ความน่าเชื่อถือ | ใช้เมื่อไร |
|---|---:|---|
| Official Docs | สูงมาก | API, platform rule, deployment, security |
| Developer Docs | สูงมาก | SDK, workflow, code implementation |
| Standards / Law / Policy | สูงมาก | privacy, security, compliance |
| Reputable News | กลาง-สูง | trend, recent change, market signal |
| Community / Blog | กลาง | example, workaround, inspiration |
| Unknown / Viral Post | ต่ำ | ใช้เป็น idea เท่านั้น ต้อง verify ก่อน |

---

## Research Note Template

```markdown
# Research Note: [Topic]

## 1. Objective
ต้องการตรวจสอบอะไร และใช้ตัดสินใจเรื่องใด

## 2. Key Questions
- คำถามหลัก 1
- คำถามหลัก 2
- คำถามหลัก 3

## 3. Sources
| Source | Type | Finding | Risk | Decision |
|---|---|---|---|---|
|  | Official Docs |  | Low | Use |
|  | Community |  | Medium | Use with review |
|  | Unknown |  | High | Reject / verify first |

## 4. Findings
- ข้อค้นพบ 1
- ข้อค้นพบ 2
- ข้อค้นพบ 3

## 5. Implementation Recommendation
ควรทำแบบไหนใน MVP

## 6. Risk & Security
- Privacy:
- Secrets/API key:
- Copyright:
- Data storage:
- Human approval:

## 7. GitHub Tasks
- [ ] สร้าง/แก้ไฟล์
- [ ] เพิ่ม mock data
- [ ] เพิ่ม manual test
- [ ] ตรวจ security

## 8. Final Decision
Use / Use with review / Monitor / Reject
```

---

## RTAFNC Sensitive Data Rule

หากเกี่ยวกับข้อมูลนักเรียน บุคลากร สุขภาพ การเงิน เอกสารราชการ หรือการอนุมัติ ให้ถือว่าเป็น sensitive data ทันที

- หน้า GitHub Pages ใช้ mock data เท่านั้น
- ข้อมูลจริงต้องอยู่ใน private backend / Google Apps Script / Drive permission / database ที่กำหนดสิทธิ์
- ห้ามใส่ token หรือ API key ใน JavaScript ฝั่ง frontend
- ต้องมี human approval ทุก workflow ที่กระทบสิทธิ์หรือสถานะบุคคล
