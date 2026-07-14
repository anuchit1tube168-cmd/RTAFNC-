# Wiki — ระบบนิเทศการสอน วพอ.พอ.

## Quick links

- [Skill หลัก](SKILL.md)
- [บริบทโครงการ](PROJECT_CONTEXT.md)
- [SOP Mapping](SOP_MAP.md)
- [Data Dictionary](DATA_DICTIONARY.md)
- [QA Checklist](CHECKLIST.md)
- [Test Plan](TEST_PLAN.md)
- [Examples](EXAMPLES.md)
- [Change Log](CHANGELOG.md)

## One-minute overview

ระบบรวบรวมการประเมินการนิเทศ 3 ระดับ ได้แก่ คู่บัดดี้ หัวหน้ากลุ่มสาระ/หัวหน้าหน่วย และผู้บริหาร ใช้ PA4 แบ่งด้านที่ 1 และด้านที่ 2 รวม 12 ตัวชี้วัด แนบรูป 2 รูปต่อระดับ ตรวจสถานะ 0/3–3/3 วิเคราะห์ผล และพิมพ์รายงาน A4

## Status guide

| Status | Meaning |
|---|---|
| ร่าง | ยังแก้ได้ ไม่นับเป็นผล |
| ส่งผลแล้ว | นับคะแนนและความครบถ้วน |
| ต้องแก้ไข | ส่งคืนพร้อมเหตุผล |
| ยกเลิก | ไม่ลบถาวร ต้องมีเหตุผล |

## Production readiness

MVP ปัจจุบันเก็บข้อมูลใน localStorage เหมาะกับการสาธิตและทดสอบ UX เท่านั้น การใช้งานหลายผู้ใช้ต้องมี backend, auth, server validation, Drive upload, audit และ backup ก่อน
