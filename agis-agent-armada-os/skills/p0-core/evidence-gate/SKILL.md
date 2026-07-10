---
name: evidence-gate
description: >-
  Blocks any task from being marked done until valid evidence (a "receipt")
  is produced and logged in the State DB. Use whenever an agent claims a task
  is complete, before writing status=done, when closing any job, or when the
  user mentions receipts, proof, verification, evidence, or "เสร็จแล้ว".
  Always trigger on any completion claim, even if verification is not
  explicitly requested.
---

# Evidence Gate / Receipt (ด่านหลักฐาน)

## เป้าหมาย
ไม่มีงานใด "เสร็จ" ถ้าไม่มี receipt ที่ตรวจสอบได้
คำพูด ("ทำเสร็จแล้ว") ไม่ใช่หลักฐาน — สถานะปลายทางที่เปลี่ยนจริงคือหลักฐาน

## Receipt Types
| type | ใช้กับงาน | ตัวอย่าง |
|---|---|---|
| file | เอกสาร/รายงาน | .docx หนังสือราชการที่เปิดได้ |
| commit-sha | โค้ด/skill | SHA บน main |
| sheet-row | ข้อมูล/สถานะ | row ใน State DB/JobLog |
| live-url | webapp/deploy | URL เปิดได้ + ทำงานจริง |
| screenshot | UI/ผลบนจอ | ภาพหน้าจอ state ล่าสุด |
| test-output | ตรรกะ/คำนวณ | ผลเทียบคำนวณมือ/สูตร |

## Workflow (VERIFY เข้ม)
1. อ่าน task + expected receipt type จาก spec/State DB
2. ตรวจว่า artifact **มีจริงและเปิดได้** (คลิกลิงก์/เปิดไฟล์จริง ไม่ดูแค่ชื่อ)
3. รัน **state_check**: ปลายทางเปลี่ยนจริงไหม (เช่น URL ไม่ 404, row มีค่าใหม่, ไฟล์ render ถูก)
4. ตรวจความสด: receipt ต้องเป็นของ state ล่าสุด ไม่ใช่ของรอบก่อน
5. ไม่ผ่าน → คืนสถานะ `BLOCKED` + ระบุชัดว่า "ขาดหลักฐานอะไร" (ห้ามเดา ห้ามปล่อยผ่าน)
6. ผ่าน → log receipt_link + last_verified ลง State DB แล้วจึงอนุญาต done

## กฎเหล็ก
- ต้องดู state จริงเสมอ ห้ามเชื่อคำกล่าวอ้างของ agent ใด รวมทั้งตัวเอง
- receipt 1 ชิ้นใช้ปิดได้ 1 งาน — ห้าม reuse ข้ามงาน
- งาน high-risk (ข้อมูลนักเรียน/เงิน/หนังสือออกจริง) ต้อง receipt >= 2 ชนิด

## Fallback
ระบบอัตโนมัติล่ม → ตรวจมือตาม CHECKLIST + ลงบันทึกกระดาษ/CSV แล้ว sync กลับ

## Receipt (ของตัว gate เอง)
ReceiptIndex row: receipt_id, type, link, verified_by, verified_at
