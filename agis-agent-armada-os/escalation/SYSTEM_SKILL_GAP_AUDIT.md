# SYSTEM_SKILL_GAP_AUDIT

## Purpose
ใช้เป็นแบบฟอร์มให้ผู้เชี่ยวชาญภายนอกช่วยตรวจช่องว่างของ AGIS และเสนอ Skill MD ที่ควรสร้างต่อ

## Audit Questions
1. ระบบนี้ติดขัดตรงไหนบ่อยที่สุด
2. งานแบบไหนที่ทีมยังทำเองไม่จบ
3. Skill MD อะไรที่ควรสร้างก่อนเพื่อแก้ปัญหานั้น
4. Skill ใดควรเป็น P0, P1, P2
5. Agent ตัวไหนควรถือ Skill นั้น
6. ต้องทดสอบด้วยงานจริงอะไร
7. Evidence ที่ต้องเก็บคืออะไร
8. ถ้าเครื่องมือหลักใช้งานไม่สะดวก ควรมีวิธีสำรองอย่างไร

## Output Table
| Skill Needed | Why Needed | Risk if Missing | Owner Agent | Priority | Test Job | Evidence |
|---|---|---|---|---|---|---|

## Required Package
- SKILL.md
- LLM_WIKI.md
- CHECKLIST.md
- TEST_PLAN.md
- AGENT_INJECTION.md
- Receipt

## Rule
ทุกคำแนะนำต้องแปลงเป็น Skill MD ที่ใช้งานจริงได้ ไม่เก็บเป็นแค่ note
