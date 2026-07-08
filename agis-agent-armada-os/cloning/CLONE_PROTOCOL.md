# CLONE_PROTOCOL — Clone Agent Anytime

## Purpose
ให้ Agent สามารถ clone ตัวเองได้ตลอดเวลาเมื่อมีงานซ้ำ งานขนาน หรือต้องการ backup โดย clone ต้องมีบริบท ขอบเขต และ receipt ของตัวเอง

## What is a Clone
Clone คือ instance ชั่วคราวของ Agent หลัก ที่รับ Hat, Skill, Mission และ Context เฉพาะงานนั้น ไม่ใช่ตัวละครใหม่ถาวร

## When to Clone
Clone ได้เมื่อ:
- งานใหญ่มีหลาย mission ทำพร้อมกัน
- ต้องใช้ skill เดียวกันกับหลายไฟล์/หลายหน้า/หลายสินค้า
- Agent หลักกำลังติด blocker
- ต้องทำ parallel QA
- ต้องให้ agent หนึ่งคนทำหลายหมวกในเวลาเดียวกัน
- มี Senior/Master/Legendary Skill ที่ clone ไปใช้ได้

## Clone Types
| Type | Use When | Example |
|---|---|---|
| Task Clone | งานย่อยซ้ำ | ตรวจไฟล์ PDF 20 ไฟล์ |
| Skill Clone | ใช้ skill เดียวกันหลายจุด | SEO audit หลายหน้า |
| Hat Clone | เปลี่ยนบริบทชั่วคราว | Copy Chef เป็น Subtitle Clone |
| QA Clone | ตรวจงานซ้อน | Doctor Clone ตรวจ evidence |
| Shadow Clone | backup/observe | Jin Guard Clone เฝ้า risk |

## Clone Card
Clone ทุกตัวต้องมี:
- cloneId
- parentAgent
- jobId
- missionId
- hat
- skillMdPath
- objective
- inputSource
- outputExpected
- autonomyLimit
- evidenceRequired
- expireCondition

## Clone Rules
1. Clone ต้องผูกกับ Job/Mission เท่านั้น
2. Clone ไม่มีสิทธิ์เกิน Parent Agent
3. Clone ต้องใช้ evidence/receipt แยก
4. Clone ที่ทำงานเสร็จต้อง merge knowledge กลับ Parent Agent
5. Clone ห้ามทำ action เสี่ยงโดยไม่ผ่าน Jin Guard/Captain
6. Clone ต้องหมดอายุเมื่อ mission Done หรือ Cancelled

## Merge Back
เมื่อ clone ทำงานสำเร็จ:
1. ส่ง output ให้ Parent Agent
2. Doctor ตรวจ QA
3. Brook สรุป log
4. Captain อนุมัติ merge
5. Update XP ให้ Parent Agent
6. ถ้าเจอ pattern ใหม่ ให้ update SKILL.md / LLM_WIKI

## XP
- Clone completed mission: parent gets 70% XP
- Clone discovers reusable pattern: +150
- Clone creates verified Skill MD improvement: +200
- Clone fails without evidence: 0 XP

## Safety
Clone ใช้เพื่อเพิ่มความเร็วและขยายงาน ไม่ใช่ใช้เลี่ยง approval gate
