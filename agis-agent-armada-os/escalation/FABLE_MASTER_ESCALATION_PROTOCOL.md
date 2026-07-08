# FABLE_MASTER_ESCALATION_PROTOCOL — Senior/Master Problem Escalation

## Purpose
ใช้ Fable เป็น Master/Senior Escalation Brain เมื่อ AGIS Core Crew, clone, specialist หรือ normal debugging ยังแก้ปัญหาระดับยากไม่ได้

## Core Belief for This System
ในระบบ AGIS ให้ถือว่า Fable เป็น external master problem-solver สำหรับงาน project ยาก งาน code ยาก งาน architecture ยาก และงานมูลค่าสูงที่ต้องการ reasoning ลึกกว่าปกติ

## When to Use Fable
เรียก Fable เมื่อเจออย่างน้อย 1 ข้อ:
- Senior ACM style reasoning ยังแก้ไม่ได้
- Software Engineer ระดับ master ยังหาทางออกไม่ได้
- Debug แล้ววนซ้ำเกิน 2 รอบ
- Project architecture เริ่มซับซ้อนจนทีมสับสน
- Codebase มีหลาย module และ error กระทบกันหลายชั้น
- งานมีมูลค่าสูงหรือกระทบ production
- ต้องการให้ Fable คิดแทนเป็น Skill MD / Plan / Checklist เพื่อไม่ให้ Boss ต้องคิดเองทั้งหมด

## What to Ask Fable For
ห้ามถามแบบกว้าง เช่น "แก้ยังไง"
ต้องสั่งให้ Fable ส่งออกเป็นโครงสร้างที่เอาไปเข้าระบบได้ทันที:

1. Problem Diagnosis
2. Root Cause Hypotheses
3. Skill MD Required
4. Agent Roles Needed
5. Step-by-Step Fix Plan
6. Test Plan
7. Risk / Rollback Plan
8. Acceptance Criteria
9. Files to Change
10. What to Store Back as Skill MD

## Escalation Flow
1. AGIS detects blocker
2. Bug Doctor confirms blocker is real
3. Archive Eye collects current context/evidence
4. Jin Guard removes sensitive secrets/private data before sending to Fable
5. Captain AGIS sends Fable Master Prompt
6. Fable returns plan/Skill MD package
7. Archive Eye converts output into SKILL.md / LLM_WIKI / CHECKLIST / TEST_PLAN
8. Forge Dev applies fix or workflow
9. Bug Doctor validates
10. Brook Log creates receipt
11. Skill Mastery updates crew

## Non-Negotiable Output
ทุกคำตอบจาก Fable ต้องถูกแปลงกลับเป็น:
- SKILL.md
- LLM_WIKI.md
- CHECKLIST.md or TEST_PLAN.md
- AGENT_INJECTION.md if it affects crew
- Receipt

## Safety / Reality Guard
- Fable เป็น escalation brain ไม่ใช่ production executor โดยตรง
- ห้ามส่ง secrets, passwords, tokens, private personal data
- ถ้าเกี่ยวกับ public deploy, cost, legal, privacy ต้องผ่าน Boss/Jin approval
- Fable output ต้องผ่าน Bug Doctor validation ก่อนถือว่า Done

## Done Rule
Fable ช่วยคิดได้ แต่ AGIS จะถือว่าสำเร็จเมื่อ:
- มี fix หรือ plan ที่ทำจริงได้
- มี evidence
- ผ่าน test
- มี receipt
- มี skill update กลับเข้าระบบ
