# BLOCKER_ESCALATION_FLOW — ไปต่อไม่ได้ต้องทำอย่างไร

## Purpose
กำหนด flow เมื่อทีมทำงานต่อไม่ได้ เพื่อไม่ให้วนอยู่กับการคุยซ้ำหรือแก้แบบเดา

## Blocker Types
- Missing Data: ข้อมูลไม่พอ / source เปิดไม่ได้
- Skill Gap: ไม่มี skill ที่ตรง
- Tool Gap: เครื่องมือหรือ permission ไม่พอ
- Quality Failure: QA fail ซ้ำ
- Architecture Gap: โครงระบบไม่รองรับ
- Risk Blocker: privacy, cost, legal, public deploy
- Domain Expert Gap: ต้องใช้ผู้เชี่ยวชาญเฉพาะทาง

## Escalation Flow
1. Agent แจ้ง blocker
2. Doctor ตรวจว่าเป็น blocker จริงหรือแก้ได้ด้วย QA
3. Navi ใช้ MiroFish หา cause
4. Archive ตรวจว่ามี Skill MD หรือ LLM_WIKI เดิมไหม
5. ถ้ามี skill เดิม → ใช้ skill / clone agent
6. ถ้าไม่มี skill → Recruit Specialist
7. ถ้า risk สูง → Jin Guard ส่ง Captain/Boss approval
8. ถ้าแก้ได้ → สร้าง Receipt และ update Skill MD
9. ถ้าแก้ไม่ได้ → เปิด Warlord / Emperor Board

## Stop Conditions
หยุดงานชั่วคราวเมื่อ:
- ต้องลบข้อมูลจริง
- ต้องใช้เงิน
- ต้อง public deploy
- ข้อมูลสำคัญไม่ครบ
- มีผลด้านกฎหมาย แพทย์ การเงิน ความปลอดภัย

## Escalation Output
ทุก escalation ต้องมี:
- blockerId
- jobId
- missionId
- blockerType
- currentAgent
- attemptedFix
- whyFailed
- recommendedScaleLevel
- expertNeeded
- approvalRequired
- nextAction
