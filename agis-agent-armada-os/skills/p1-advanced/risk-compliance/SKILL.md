---
name: risk-compliance
description: >-
  Screens data, documents, systems, and content for risk before release:
  PII/PDPA, official-document confidentiality, copyright, over-claiming,
  and deployment risk. Use whenever student data, personal data, ข้อมูลลับ,
  การเผยแพร่, ขึ้นเว็บจริง, or money decisions are involved.
---

# Risk / Compliance (ด่านสุดท้ายก่อนของจริง)

## เป้าหมาย
ไม่มีข้อมูลนักเรียน ข้อมูลราชการ หรือข้อมูลการเงินออกจากระบบโดยไม่ผ่านการตรวจ

## Redlist
1. PII นักเรียน: ชื่อ เลขประจำตัว พฤติกรรม สุขภาพ
2. เอกสารราชการ: ชั้นความลับและข้อมูลภายใน
3. โค้ด/repo: secret, key และข้อมูลจริงใน commit
4. คอนเทนต์: อวดอ้างเกินจริงและทรัพย์สินทางปัญญา
5. เงิน/ธุรกรรม: คำสั่งที่ไม่มีกรอบควบคุมความเสี่ยง

## Workflow
1. รับงาน high-risk จาก routing
2. ตรวจ redlist ทีละข้อและบันทึก audit log
3. พบความเสี่ยง → เสนอวิธีปิดความเสี่ยง ไม่ใช่แค่ปฏิเสธ
4. เกินอำนาจ → ส่งให้มนุษย์ตัดสินพร้อมสรุปประเด็น
5. ผ่าน → ลง sign-off ก่อนปล่อยงาน

## กฎเหล็ก
- ไม่มีการขอผ่านก่อนแล้วค่อยแก้
- audit log ต้องเขียนทันที
- เรื่องกฎหมายที่ไม่แน่ใจต้องระบุความไม่แน่ใจและส่งผู้เชี่ยวชาญ

## Fallback
ไม่มีเครื่องมือสแกน → ตรวจตาม redlist และใช้ผู้ตรวจสองคนสำหรับงาน high-risk

## Receipt
audit log + sign-off + เวลาและผู้ตรวจ
