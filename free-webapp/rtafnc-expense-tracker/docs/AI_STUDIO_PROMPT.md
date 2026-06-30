# Prompt สำหรับ Google AI Studio / Stitch

ใช้ prompt นี้เพื่อให้ AI ช่วยต่อยอดหน้าจอหรือสร้างระบบเวอร์ชันใหม่จากแนวทางเดียวกัน

```text
คุณคือ Senior Full-stack Engineer และ UX Designer ภาษาไทย
ช่วยพัฒนาเว็บแอปองค์กรชื่อ RTAFNC Expense Tracker

เป้าหมาย:
สร้าง WebApp ฟรีหรือประหยัดที่สุด ใช้งานผ่าน browser ได้ ไม่ต้องติดตั้งโปรแกรมในเครื่องผู้ใช้

Tech stack:
- React + Vite
- Firebase Authentication: Google Sign-In
- Cloud Firestore
- Static hosting เท่านั้น
- ห้ามใช้ Cloud Functions, Cloud Run หรือ backend ที่ต้องเปิด billing ในเฟสแรก

ฟังก์ชันหลัก:
1. Login ด้วย Gmail
2. ตรวจสอบสิทธิ์ผู้ใช้จาก collection users
3. role: admin, staff, viewer
4. Dashboard สรุปรายรับ รายจ่าย คงเหลือ รายการรออนุมัติ
5. Form บันทึกข้อมูลรายรับรายจ่าย
6. Table ค้นหา กรอง Export CSV
7. Admin อนุมัติ ไม่อนุมัติ ลบรายการ
8. Firestore Security Rules ต้องปลอดภัย ไม่ public read/write
9. Audit log ทุกครั้งที่สร้าง/แก้ไข/ลบ/อนุมัติ
10. UI ภาษาไทย โทนราชการทันสมัย navy/cyan/white รองรับมือถือ

ขอให้สร้างโค้ดแบบ production-ready พร้อมคำอธิบายการ deploy ด้วย Firebase Hosting และ Vercel
```

## Prompt สำหรับออกแบบ UI ใน Stitch

```text
ออกแบบหน้าเว็บ Dashboard ภาษาไทยสำหรับระบบจัดการรายรับรายจ่ายองค์กร
ชื่อ RTAFNC Expense Tracker
โทนสี navy blue, white, cyan, ดูราชการ ทันสมัย สะอาด ใช้ง่าย
ต้องมี:
- Header แสดงชื่อองค์กรและผู้ใช้งาน
- Stat cards 4 ใบ: รายรับ รายจ่าย คงเหลือ รออนุมัติ
- ฟอร์มบันทึกรายการใหม่ด้านซ้าย
- ตารางรายการล่าสุดด้านขวา
- ปุ่ม Export CSV
- ป้ายสถานะ pending/approved/rejected
- Responsive สำหรับมือถือ
```
