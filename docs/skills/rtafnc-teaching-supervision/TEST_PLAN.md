# TEST PLAN — RTAFNC Teaching Supervision

## Objective

พิสูจน์ว่าระบบทำงานตาม SOP ป้องกันความผิดพลาดของคะแนน สิทธิ์ และหลักฐาน และพิมพ์รายงานได้ถูกต้องทั้ง desktop/mobile

## Test levels

1. Static validation — structure, syntax, broken links
2. Unit calculation — score/average/completion
3. Functional — forms, filters, upload, reports
4. Permission — role matrix and unauthorized paths
5. Data reconciliation — source rows vs imported records
6. Responsive/accessibility — mobile/tablet/keyboard/contrast
7. Print/PDF — A4 page breaks, images, signatures
8. Recovery — backup and restore

## Critical scenarios

| ID | Scenario | Expected result |
|---|---|---|
| TS-001 | เปิดระบบ | ไม่มี blank page/error blocking |
| TS-002 | ผู้ประเมินเลือกตนเอง | ระบบปฏิเสธ |
| TS-003 | คะแนน 0 หรือ 6 | ระบบปฏิเสธ |
| TS-004 | ส่งเมื่อคะแนนไม่ครบ | ไม่ส่งและบอกข้อที่ขาด |
| TS-005 | บันทึกร่าง | คงอยู่และไม่นับ completion |
| TS-006 | ส่งครบ 3 ระดับ | สถานะ 3/3 |
| TS-007 | ค่าเฉลี่ย | ตรง manual reconciliation, 2 decimals |
| TS-008 | ไฟล์ผิดชนิด/เกินขนาด | ปฏิเสธ |
| TS-009 | ผู้ตรวจสอบพยายามแก้ | ปฏิเสธและบันทึกเหตุการณ์ |
| TS-010 | รายงานรายบุคคล | ตรา/ชื่อ/คะแนน/รูป/ลายเซ็นครบ |
| TS-011 | Print หลายหน้า | ไม่มีหน้าว่าง ไม่ตัดแถว/ลายเซ็น |
| TS-012 | Mobile 360px | ใช้งาน flow หลักได้ |
| TS-013 | Duplicate level | ป้องกันรายการซ้ำ |
| TS-014 | แก้หลังส่ง | มีเหตุผล/ผู้อนุมัติ/Audit Log |
| TS-015 | Restore backup | จำนวน record/checksum ตรง |

## Evidence and exit criteria

ต้องมี screenshot/video, console/build log, calculation reconciliation, role matrix, PDF sample, backup receipt และ release receipt. Critical ต้อง PASS 100%, High defect = 0, data difference = 0, SOP/Skill/Changelog ต้องตรงกัน
