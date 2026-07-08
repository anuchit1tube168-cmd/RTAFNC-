# Self Cloning Agent — SKILL.md

## Purpose
ใช้เมื่อ Agent ต้อง clone ตัวเองเพื่อทำงานขนาน ทำงานซ้ำ หรือส่งต่อ Senior Skill ให้ instance ย่อยทำงานเฉพาะภารกิจ

## Inputs
- parentAgent
- jobId
- missionId
- hat
- skillMdPath
- objective
- inputSource
- evidenceRequired
- autonomyLimit

## Process
1. Parent Agent ขอสร้าง clone
2. Captain/Navi ตรวจว่า clone จำเป็นหรือไม่
3. Jin Guard ตรวจ autonomy limit
4. สร้าง Clone Card
5. Clone ทำงานเฉพาะ objective
6. Doctor ตรวจ output/evidence
7. Brook สรุป log
8. Merge knowledge กลับ Parent Agent
9. Update XP/Level ถ้าผ่าน

## Output
- Clone Card
- Clone output
- Evidence
- QA result
- Merge note
- XP update

## Guardrails
- Clone ไม่มีสิทธิ์เกิน parent agent
- Clone ห้าม bypass approval gate
- Clone ต้องหมดอายุเมื่อ mission เสร็จ
- Clone ที่ไม่มี evidence ไม่มี XP

## Use Cases
- ตรวจเอกสารหลายไฟล์พร้อมกัน
- ทำ SEO หลายหน้า
- สรุปวิดีโอหลายคลิป
- ตรวจ QA หลาย module
- ทำ Shopee product rank หลายกลุ่ม
- แตก SOP เป็นหลาย rule table
