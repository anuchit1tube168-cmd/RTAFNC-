# REVISE_SKILL_PROTOCOL — Revise / Upgrade Skill MD

## Purpose
เมื่อทีมติดขัดหรือพบว่า Skill MD เดิมไม่พอ ต้องปรับปรุง skill แทนการฝืนทำงานแบบเดิม

## When to Revise Skill
- QA fail ซ้ำ 2 รอบ
- Agent ใช้ Skill แล้ว output ยังไม่ถึง acceptance criteria
- งานระดับ A/S/SS ต้องใช้ขั้นตอนเพิ่ม
- พบ edge case ใหม่จากงานจริง
- Clone ใช้ skill แล้วได้ผลไม่สม่ำเสมอ
- มี expert เข้ามาช่วยและให้ pattern ใหม่
- ระบบเปลี่ยน tool เช่น GitHub, Lovable, Google Drive, Shopee, Apps Script

## Revision Loop
1. Collect failure evidence
2. Identify missing rule / missing step
3. Ask expert or recruit specialist if needed
4. Patch SKILL.md
5. Patch LLM_WIKI.md
6. Add CHECKLIST / TEST_PLAN
7. Run test mission
8. Doctor validates
9. Captain approves new version
10. Record changelog and receipt

## Versioning
ใช้ semantic version แบบง่าย:
- v1.0 = ใช้ได้ครั้งแรก
- v1.1 = เพิ่ม checklist หรือ prompt
- v1.2 = แก้ bug / edge case
- v2.0 = เปลี่ยน flow ใหญ่หรือเพิ่ม expert pattern

## Required Output
- updated SKILL.md
- updated LLM_WIKI.md ถ้ามี
- CHANGELOG.md
- test receipt
- owner agent
- reviewed by Doctor/Jin

## Rule
Skill ที่ revise สำเร็จและทำให้งานผ่าน QA ได้ จะให้ XP กับ agent ที่เสนอแก้ และ owner skill
