---
name: dashboard-design
description: >-
  Designs decision-ready dashboards: 5-9 KPIs max, key metric top-left,
  understandable in 5 seconds, card-based with clear visual hierarchy.
  Use whenever the user mentions dashboard, กราฟ, รายงานผลแบบภาพ, KPI,
  สรุปผลให้ผู้บริหารดู, or wants any data displayed visually.
---

# Dashboard Design (จอเดียวตัดสินใจได้)

## เป้าหมาย
ผู้ใช้มองจอ 5 วินาทีแล้วรู้ว่า "สถานการณ์เป็นอย่างไร และต้องทำอะไรต่อ"

## กติกาออกแบบ
- 5-second rule: คำถามหลักของจอต้องตอบได้ใน 5 วินาที
- KPI สำคัญสุดอยู่มุมบนซ้าย
- จำกัดไม่เกิน 9 visual ต่อจอ
- ทุก KPI ต้องมีนิยาม แหล่งข้อมูล owner และเกณฑ์เขียว/เหลือง/แดง
- เลือกกราฟตามคำถาม: เทียบ=bar, แนวโน้ม=line, สัดส่วน=stacked/donut, กระจาย=scatter
- ใช้ design system เดียวกันทั้งระบบและรองรับสองภาษา

## Workflow
1. **CLARIFY** — ใครดู ตัดสินใจอะไร ดูบ่อยแค่ไหน
2. **DESIGN** — ร่าง wireframe ข้อความก่อนลงมือ
3. **BUILD** — ทำ mock ด้วยข้อมูลจริงบางส่วน
4. **VERIFY** — ทดสอบ 5-second rule กับผู้ใช้จริงและดูบนมือถือ
5. เก็บนิยาม KPI ใน `references/kpi-dictionary.md`

## กฎเหล็ก
- ไม่มี KPI ที่ไม่รู้ว่าใช้ตัดสินใจอะไร
- bar chart ต้องเริ่มแกน Y ที่ศูนย์
- สีแดงใช้เฉพาะสิ่งที่ต้องลงมือ

## Fallback
เครื่องมือ dashboard ล่ม → ตารางสรุปหนึ่งหน้าใน Sheet

## Receipt
screenshot dashboard + ผลทดสอบ 5-second + kpi-dictionary
