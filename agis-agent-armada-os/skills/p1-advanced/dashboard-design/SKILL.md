---
name: dashboard-design
description: >-
  Designs decision-ready dashboards: 5-9 KPIs max, key metric top-left,
  understandable in 5 seconds, card-based with clear visual hierarchy.
  Use whenever the user mentions dashboard, กราฟ, รายงานผลแบบภาพ, KPI,
  สรุปผลให้ผู้บริหารดู, or wants any data displayed visually — even if they
  just say "อยากเห็นภาพรวม".
---

# Dashboard Design (จอเดียวตัดสินใจได้)

## เป้าหมาย
ผู้ใช้ (ผอ./ครู) มองจอ 5 วินาทีแล้วรู้ว่า "สถานการณ์เป็นยังไง ต้องทำอะไรต่อ"

## กติกาออกแบบ
- **5-second rule**: คำถามหลักของจอนี้ต้องตอบได้ใน 5 วิ
- KPI สำคัญสุด → มุมบนซ้าย (สายตากวาดแบบ F-pattern)
- จำกัด <= 9 visual ต่อจอ — เกินนั้นแตกเป็นแท็บ/หน้า
- ทุก KPI ต้องมี: นิยาม + แหล่งข้อมูล + owner + เกณฑ์เขียว/เหลือง/แดง
- เลือกกราฟตามคำถาม: เทียบ=bar, แนวโน้ม=line, สัดส่วน=stacked/donut(<=5 ชิ้น), กระจาย=scatter
- Design system ตามกลุ่มงาน (navy-gold / forest-green / dark-fantasy) + สองภาษา

## Workflow
1. **CLARIFY** — ถาม 3 ข้อก่อนวาด: ใครดู? ตัดสินใจอะไร? ดูบ่อยแค่ไหน?
2. **DESIGN** — ร่าง wireframe ข้อความ (ผังการ์ด) เสนอ 2-3 direction ก่อนลงมือจริง
3. **BUILD** — ทำ mock ด้วยข้อมูลจริงบางส่วน (ห้ามใช้ตัวเลขปลอมล้วน — จะหลอกสายตา scale)
4. **VERIFY** — ทดสอบ 5-second rule กับผู้ใช้จริง 1 คน + ดูบนมือถือ
5. เก็บนิยาม KPI ทั้งหมดใน references/kpi-dictionary.md ของโปรเจกต์นั้น

## กฎเหล็ก
- ไม่มี KPI ที่ไม่รู้ว่าใครใช้ตัดสินใจอะไร ("สวยแต่ไม่มีคนใช้" = ตัดทิ้ง)
- แกน Y เริ่มศูนย์สำหรับ bar chart เสมอ (กันภาพลวง)
- สีแดงสงวนไว้สำหรับ "ต้องลงมือ" เท่านั้น

## Fallback
เครื่องมือ dashboard ล่ม → ตารางสรุป 1 หน้าใน Sheet ที่ตอบคำถามเดียวกัน

## Receipt
screenshot dashboard + ผลทดสอบ 5-second กับผู้ใช้จริง + kpi-dictionary
