# Skill: Observability

## หน้าที่
ติดตามสุขภาพระบบ ประสิทธิภาพ คิวงาน และข้อผิดพลาดโดยไม่เปิดเผยข้อมูลส่วนบุคคลใน Log

## Metrics
- จำนวนผู้ใช้รายวัน
- เวลาโหลดหน้า LIFF
- อัตราสำเร็จของ Login และ Member Linking
- จำนวนรายการความดีที่ส่งและรอตรวจ
- จำนวนรายการติดตามอาการ
- อัตราสำเร็จการอัปโหลดไฟล์
- สถานะการส่ง LINE, Telegram และ In-app
- Error rate ของ Edge Functions

## Logs
- ใช้ request id และ reference id
- ซ่อนข้อมูลสุขภาพ เนื้อหาเอกสาร และข้อมูลยืนยันตัวตน
- แยก application log, security log และ audit log
- กำหนดระยะเวลาเก็บตามความจำเป็น

## Alerts
- Login failure สูงผิดปกติ
- RLS denial เพิ่มขึ้นผิดปกติ
- Upload failure ต่อเนื่อง
- Notification queue ค้าง
- Storage หรือฐานข้อมูลใกล้เต็ม
- Edge Function ตอบช้าหรือผิดพลาด

## Dashboard
แสดงสถานะระบบแบบสรุปโดยไม่แสดงข้อมูลนักเรียนรายบุคคล
