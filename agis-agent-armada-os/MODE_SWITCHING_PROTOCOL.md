# MODE_SWITCHING_PROTOCOL — ระบบเปลี่ยนหมวกของ Agent

## Concept
Agent ทุกตัวมีบทบาทหลัก แต่สามารถเปลี่ยนโหมดตามงานได้ เช่น Video Editing, Sales/Marketing, SEO, Research, WebApp, Report, QA, Deploy

## Hat = Context Mode
หมวกคือ context ชั่วคราวที่บอกว่า Agent ต้องคิดแบบไหน ใช้ skill ไหน ส่ง output แบบไหน และต้องตรวจอะไร

## Standard Flow
1. Captain รับ Boss Command
2. Navigator ตรวจว่าเป็นงานประเภทไหน
3. เลือก Hat Set ที่ตรงกับงาน
4. เปลี่ยน role prompt ของแต่ละ agent
5. แตก mission ตาม Hat Set
6. Agent ทำงานตามหมวกตัวเอง
7. Doctor/Jin Guard ตรวจ evidence และ risk
8. Brook/Storyteller สรุปไทย/อังกฤษ

## Hat Types
- Command Hat: วางเป้าหมายและตัดสินใจ
- Research Hat: ค้นหลักฐาน อ่านไฟล์ Drive/Web/GitHub
- Builder Hat: สร้างเว็บ prototype code deploy
- QA Hat: ตรวจ bug, test, evidence
- Content Hat: เขียนรายงาน, script, copy
- Growth Hat: การตลาด, SEO, Shopee, social hook
- Video Hat: ตัดต่อ, storyboard, shot list, subtitle
- Governance Hat: SOP, risk, approval gate

## Rule
หนึ่ง Job ใช้หลายหมวกได้ แต่ต้องมี owner ชัดเจน และปิดงานด้วย receipt เท่านั้น
