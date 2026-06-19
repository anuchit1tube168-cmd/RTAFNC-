# Skill: Private Storage

## หน้าที่
จัดเก็บรูปภาพและ PDF แยกตามเจ้าของข้อมูลและโมดูล โดยไม่เปิดเผย URL ถาวร

## Buckets
- good-deed-files
- hospital-files
- student-documents
- public-news

## Path Convention
- good-deed-files/{student_uuid}/{record_uuid}/{file_uuid}-{safe_name}
- hospital-files/{student_uuid}/{visit_uuid}/{file_uuid}-{safe_name}
- student-documents/{student_uuid}/{document_uuid}/{file_uuid}-{safe_name}

## Validation
- JPEG, PNG, WebP, PDF
- ขนาดไม่เกิน 10 MB ต่อไฟล์
- ชื่อไฟล์ต้องผ่านการทำความสะอาด
- ตรวจ MIME type และนามสกุล

## Access
- Private Bucket ใช้ RLS ตาม student UUID และ Role
- เปิดดูด้วย authenticated request หรือ Signed URL อายุสั้น
- public-news ใช้ได้เฉพาะสื่อประชาสัมพันธ์ทั่วไป

## Failure Handling
- ลบไฟล์ที่อัปโหลดสำเร็จแต่สร้าง metadata ไม่สำเร็จ
- Retry แบบจำกัดจำนวนครั้ง
- บันทึก error โดยไม่เก็บเนื้อหาไฟล์ใน Log
