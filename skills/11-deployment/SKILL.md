# Skill: Deployment

## หน้าที่
นำระบบจาก Private GitHub ไปยัง Private Server ที่มี HTTPS และกำหนดเป็น LIFF Endpoint

## ขั้นตอน
1. ดึงโค้ดจาก Branch ที่ผ่านการตรวจ
2. ติดตั้งค่าคอนฟิกเฉพาะสภาพแวดล้อม
3. Build และตรวจไฟล์ผลลัพธ์
4. Deploy แบบมีเวอร์ชันและ Rollback ได้
5. ตั้ง HTTPS, Security Headers และ Cache Policy
6. ตั้ง LIFF Endpoint ให้ตรงกับโดเมนจริง
7. ทดสอบผ่าน LINE Client บน Android และ iOS
8. ตรวจ Health Check หลัง Deploy

## Environments
- development
- staging
- production

## Rules
- ห้าม Deploy จาก Branch ที่ยังไม่ผ่าน Security QA
- ห้ามวางค่าลับในไฟล์ Frontend
- Production ต้องเปิดผ่าน HTTPS
- ต้องมีวิธีย้อนกลับเวอร์ชันก่อนหน้า
- Deploy ควรทำช่วงเวลาที่กระทบผู้ใช้น้อย

## Done Criteria
- Rich Menu เปิด LIFF ได้
- LINE Login กลับหน้าเดิมได้
- Supabase และ Edge Function ตอบสนอง
- Upload และ RLS ผ่านการทดสอบ
