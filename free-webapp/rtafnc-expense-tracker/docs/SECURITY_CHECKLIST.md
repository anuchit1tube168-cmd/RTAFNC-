# Security Checklist สำหรับระบบองค์กร

## ต้องทำก่อนใช้งานจริง

- ใช้ GitHub private repo ถ้าระบบมีข้อมูลส่วนบุคคลหรือข้อมูลราชการ
- ห้าม commit ไฟล์ `.env` จริงขึ้น GitHub
- เปิด Firebase Authentication เฉพาะ provider ที่ต้องใช้
- ตรวจสอบ Authorized domains ให้ตรงกับเว็บที่ deploy
- ตั้ง Firestore rules จากไฟล์ `firestore.rules`
- ทดสอบ role admin / staff / viewer ก่อนใส่ข้อมูลจริง
- กำหนดผู้ดูแลระบบหลักอย่างน้อย 2 คน
- ตรวจสอบ audit log ทุกครั้งที่มีรายการผิดปกติ

## สิ่งที่ห้ามทำ

- ห้ามเปิดฐานข้อมูลแบบ public read/write
- ห้ามเก็บ API key ลับหรือ service account ใน frontend
- ห้ามใช้ข้อมูลจริงระหว่างทดสอบ rules
- ห้ามให้ทุกคนเป็น admin
- ห้ามแชร์ลิงก์ deploy กับคนนอกหน่วยงานถ้ายังไม่มีการจำกัดสิทธิ์

## เฟสถัดไปที่ควรเพิ่ม

- จำกัดโดเมน Gmail ขององค์กรผ่าน `VITE_ALLOWED_DOMAIN`
- เพิ่ม Firebase Storage rules ถ้าจะอัปโหลดใบเสร็จหรือหลักฐาน
- เพิ่ม PDF export ที่มีหัวกระดาษหน่วยงาน
- เพิ่ม backup เป็น CSV/Google Sheet รายเดือน
- เพิ่มเลขที่เอกสารอัตโนมัติ
- เพิ่มประวัติการแก้ไขรายรายการแบบละเอียด
