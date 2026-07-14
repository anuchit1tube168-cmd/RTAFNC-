# Prompt Library

## เปิดโหมดโครงการ

```text
เข้าสู่ rtafnc supervision mode อ่าน SKILL.md และ PROJECT_CONTEXT.md ก่อน จากนั้นวิเคราะห์งานแบบไม่เดาข้อมูลราชการ แก้ทีละส่วนและทดสอบตาม CHECKLIST.md
```

## Product Design

```text
ออกแบบหน้า [ชื่อหน้า] ของระบบนิเทศการสอน วพอ.พอ. ใช้ตรา วพอ. ชื่อระบบเต็ม สีสถานะตาม Skill รองรับ desktop/mobile และลดจำนวนคลิก ห้ามตัด validation หรือสิทธิ์เพื่อความสวยงาม
```

## Add feature

```text
เพิ่มฟังก์ชัน [ฟังก์ชัน] โดยระบุผลกระทบต่อ data model, permissions, Audit Log, SOP และรายงานก่อนลงมือ จากนั้นแก้โค้ด ทดสอบ regression และอัปเดต CHANGELOG
```

## Data import

```text
นำเข้ารายชื่อจากไฟล์ต้นฉบับ รักษาข้อความราชการเดิม สร้าง immutable ID แยกชื่อ/ตำแหน่ง/หน่วย/ประเภทบุคลากร ระบุ source_date และทำ needs_review สำหรับแถวกำกวม ห้ามเดาวิทยฐานะ
```

## QA review

```text
ตรวจระบบตาม CHECKLIST.md และ TEST_PLAN.md แบบ evidence-based ระบุ PASS/FAIL/BLOCKED พร้อมขั้นตอนทำซ้ำ ห้ามสรุปว่าผ่านหากไม่ได้รันทดสอบจริง
```

## Production migration

```text
ย้าย MVP localStorage ไปเป็นระบบหลายผู้ใช้บน Google Apps Script + Google Sheets + Drive โดยรักษา UX เดิม ออกแบบ schema, API, locking, auth, audit, backup, migration และ rollback ก่อนเขียนโค้ด
```
