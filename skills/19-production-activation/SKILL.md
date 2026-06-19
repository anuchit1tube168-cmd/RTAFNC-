# Skill: Production Activation

## หน้าที่
ควบคุมการเปลี่ยนระบบจาก Demo หรือ Staging ไปเป็น Production โดยใช้เกณฑ์เดียวกันทุกโมดูล

## เงื่อนไขก่อนเปิดจริง
- Supabase migrations ผ่าน
- LINE verification ผ่าน
- Member Linking ผ่าน
- RLS และ Private Storage ผ่าน
- Good Deeds และ Hospital ผ่าน Functional Test
- Staff Role และ Audit Log ผ่าน
- GitHub Actions ผ่าน
- มี Backup และ Rollback Plan

## ขั้นตอน
1. ระบุ Commit สำหรับ Release
2. สำรองฐานข้อมูลและค่าคอนฟิก
3. Deploy ไป Staging
4. ทดสอบ LIFF จาก Rich Menu
5. ทดสอบสิทธิ์ผู้ใช้หลายบทบาท
6. อนุมัติ Release
7. ตั้งค่า Runtime สำหรับ Production
8. เปลี่ยน Demo Mode เป็น false
9. Deploy ไป Production
10. ตรวจ Health Check และธุรกรรมตัวอย่าง
11. เปิด Monitoring และ Notification

## เงื่อนไขย้อนกลับ
- Login หรือ Member Linking ผิดปกติ
- RLS ไม่ผ่าน
- Upload หรือ Database error สูงผิดปกติ
- LINE LIFF เปิดไม่ได้

## Output
- release commit SHA
- deployment timestamp
- approver
- health status
- rollback reference
