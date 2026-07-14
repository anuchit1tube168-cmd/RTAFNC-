# Data Dictionary and Source Rules

## Source priority

1. คำสั่ง/แบบประเมินที่ได้รับอนุมัติล่าสุด
2. Google Sheet master ที่ระบุวันที่ข้อมูล
3. ไฟล์ต้นฉบับ XLS/XLSX/PDF
4. ข้อมูลที่ผู้มีอำนาจยืนยันในระบบ
5. Mock data เฉพาะ demo และต้องติดป้าย

## Personnel categories

- นายทหารสัญญาบัตร
- นายทหารประทวน
- พนักงานราชการ
- ลูกจ้างชั่วคราว

ห้ามใช้ “วิทยฐานะ” แทน “ประเภทบุคลากร” หากแหล่งข้อมูลไม่ได้ระบุวิทยฐานะ

## Required identifiers

- `personnel_id`: immutable internal ID
- `source_row_id`: reference to imported source row
- `source_date`: date of source list
- `active_status`: active / study_leave / temporary_assignment / inactive / needs_review

## Evaluation uniqueness

`(cycle_id, personnel_id, evaluator_level, status != cancelled)`

## Status transitions

`new → draft → submitted → returned_for_correction → resubmitted → approved` และ `cancelled` ต้องมีเหตุผล

## Display conventions

- No data: `—`
- Unverified: `รอตรวจสอบ`
- Missing source: `ไม่ระบุในแหล่งข้อมูล`
- Store dates as ISO 8601; display Buddhist year in Thai UI
