# LEVEL_UP_SYSTEM — Agent Growth Rules

## Purpose
กำหนดว่า Agent จะ Level Up เมื่อไร และ Skill จะโตขึ้นจากงานจริงอย่างไร

## Level Up Sources
Agent ได้ XP และ Level Up จาก 3 แหล่งหลัก:

1. Job Complete
- Job ใหญ่สำเร็จตาม One Piece / Gold
- มี evidence
- มี receipt
- ผ่าน QA
- ผ่าน approval gate ถ้าจำเป็น

2. Mission Complete
- ภารกิจย่อยสำเร็จ
- มี evidenceUrl หรือผลทดสอบ
- status = Done หลัง Doctor/Jin Guard ตรวจแล้ว

3. Skill MD Mastery
- Agent ได้เรียนรู้ Skill MD ที่มีประโยชน์สูงมาก
- ใช้ Skill นั้นทำงานจริงสำเร็จ
- สามารถสอน/ส่งต่อ/clone ให้ agent อื่นใช้ได้
- มี LLM_WIKI หรือ CHECKLIST รองรับ

## Senior / Legendary Skill Rule
Skill ที่ถือว่า senior หรือใครทำแทนยาก ต้องผ่านเกณฑ์:
- ใช้แก้ปัญหาจริงระดับ A/S/SS ได้
- ลดเวลาทำงานได้มาก
- ใช้ซ้ำได้หลายงาน
- มี SOP / SKILL.md / LLM_WIKI / CHECKLIST / Receipt
- มี evidence ว่าเคยใช้สำเร็จ
- Agent อื่นสามารถ clone ไปใช้ได้

## XP Formula
| Source | XP |
|---|---:|
| Mission E | 10 |
| Mission D | 25 |
| Mission C | 50 |
| Mission B | 100 |
| Mission A | 200 |
| Mission S | 400 |
| Mission SS | 800 |
| Job Complete Bonus | +25% total mission XP |
| Evidence Perfect Bonus | +10% |
| Senior Skill Learned | +300 |
| Senior Skill Used Successfully | +500 |
| Skill MD Created/Improved | +150 |
| Clone Created and Passed QA | +200 |

## Level Bands
| Level | Title | XP Range |
|---|---|---:|
| 1 | Rookie | 0-199 |
| 2 | Trainee | 200-499 |
| 3 | Operator | 500-999 |
| 4 | Specialist | 1000-1999 |
| 5 | Senior | 2000-3999 |
| 6 | Master | 4000-7999 |
| 7 | Legendary | 8000+ |

## Season Growth
- Rookie Sea: Level 1
- Grand Route: Level 2
- Sky Current: Level 3
- Water Forge: Level 4
- New Horizon: Level 5
- Warrior Mastery: Level 6
- Final Ocean: Level 7+

## Done Gate
ไม่มี Evidence = ไม่ได้ XP
มี Evidence แต่ QA ไม่ผ่าน = ได้เฉพาะ Learning XP ไม่ได้ Completion XP
มี Receipt verified = ได้ Completion XP และ Level Up ได้

## Update Rule
เมื่อ Agent Level Up ต้องบันทึกใน Levels tab และถ้าเป็น skill ใหม่ให้ update SKILL.md หรือ LLM_WIKI
