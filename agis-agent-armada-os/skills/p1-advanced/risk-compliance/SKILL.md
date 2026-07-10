---
name: risk-compliance
description: >-
  Screens data, documents, systems, and content for risk before release:
  PII/PDPA (student data), official-document confidentiality, copyright,
  over-claiming in marketing, and trading-discipline guardrails. Use whenever
  student data, personal data, ข้อมูลลับ, การเผยแพร่, ขึ้นเว็บจริง, ส่งออก
  ภายนอก, or money/trading decisions are involved — ALWAYS trigger before
  any real data enters any system and before any public release.
---

# Risk / Compliance (ด่านสุดท้ายก่อนของจริง)

## เป้าหมาย
ไม่มีข้อมูลนักเรียน/ข้อมูลราชการ/เงิน ออกจากระบบโดยไม่ผ่านการตรวจ

## Redlist (ตรวจทุกงาน)
1. **PII นักเรียน**: ชื่อ-สกุล+เลขประจำตัว+ข้อมูลพฤติกรรม/สุขภาพ — เผยแพร่ต่อสาธารณะไม่ได้; ใช้ในระบบต้อง จำกัดสิทธิ์+จำเป็นเท่านั้น (data minimization)
2. **เอกสารราชการ**: ชั้นความลับ, ข้อมูลภายในที่ยังไม่อนุมัติเผยแพร่
3. **โค้ด/repo**: secret, key, ไฟล์ข้อมูลจริงหลุดเข้า commit
4. **คอนเทนต์**: อวดอ้างสรรพคุณเกินจริง, ภาพ/เพลง/ตัวละครติดลิขสิทธิ์
5. **เทรด/เงิน**: คำสั่งที่ผิดวินัยระบบ (ไม่มี stop/ขนาดเกินกติกา) → flag ห้ามเงียบ

## Workflow
1. รับงานจาก routing (งาน high-risk ถูกบังคับผ่านด่านนี้)
2. สแกนตาม redlist ทีละข้อ — บันทึกผลเป็น audit log (พบ/ไม่พบ/แก้ไขอย่างไร)
3. พบความเสี่ยง → เสนอทางแก้เสมอ (ปิดบังข้อมูล/ขอสิทธิ์/เปลี่ยนภาพ) ไม่ใช่แค่ปัดตก
4. เสี่ยงสูงเกินอำนาจ (กฎหมาย/วินัยราชการ) → ส่งมนุษย์ตัดสิน พร้อมสรุปประเด็น
5. ผ่าน → sign-off ลง audit log แล้วงานไปต่อได้

## กฎเหล็ก
- ไม่มี "ขอผ่านก่อน เดี๋ยวมาแก้" — เสี่ยงต้องปิดก่อนปล่อย
- audit log เขียนทันทีตอนตรวจ ไม่เขียนย้อนหลัง
- ข้อกฎหมายที่ไม่แน่ใจ ให้บอกตรง ๆ ว่าไม่แน่ใจ + แนะปรึกษาผู้รู้ ห้ามฟันธงมั่ว

## Fallback
ไม่มีเครื่องมือสแกน → ไล่ redlist ด้วยตา + สองคนตรวจไขว้สำหรับงาน high-risk

## Receipt
audit log + sign-off (ผู้ตรวจ+เวลา+ผล)
