# RTAFNC Expense Tracker

ระบบต้นแบบ WebApp ภาษาไทยสำหรับองค์กร ใช้แนวทางฟรีสแต็ก: AI Studio / Firebase / GitHub / Vercel หรือ Firebase Hosting

## สถานะโปรเจกต์

สร้างเป็น MVP พร้อมใช้งานต่อได้ทันทีในโฟลเดอร์ `free-webapp/rtafnc-expense-tracker`

สิ่งที่ทำแล้ว:

- React + Vite WebApp
- Login ด้วย Gmail ผ่าน Firebase Authentication
- Cloud Firestore สำหรับเก็บรายการรายรับรายจ่าย
- Dashboard สรุปรายรับ รายจ่าย คงเหลือ และรายการรออนุมัติ
- ฟอร์มบันทึกรายการ
- ตารางค้นหา/กรองรายการ
- Admin อนุมัติ/ไม่อนุมัติ/ลบรายการ
- Export CSV ภาษาไทย
- หน้า Report พร้อมปุ่ม Print / Save PDF ผ่าน browser
- กราฟสรุป 6 เดือนล่าสุดแบบไม่ใช้ library เพิ่ม
- หน้า Settings สำหรับ admin แก้ชื่อองค์กร ปีงบประมาณ และหมวดหมู่
- Firestore Security Rules แยกสิทธิ์ admin / staff / viewer และล็อก staff ไม่ให้อนุมัติรายการเอง
- Audit log เบื้องต้น
- Responsive รองรับมือถือ แท็บเล็ต และคอมพิวเตอร์

## โครงสร้างข้อมูล Firestore

```text
users/{uid}
  email
  displayName
  role: admin | staff | viewer
  department
  active
  createdAt
  updatedAt

transactions/{id}
  type: income | expense
  category
  amount
  date
  note
  status: pending | approved | rejected
  createdBy
  createdByEmail
  approvedBy
  approvedByEmail
  createdAt
  updatedAt

settings/app
  organizationName
  fiscalYear
  categories
  updatedBy
  updatedByEmail
  updatedAt

auditLogs/{id}
  action
  targetCollection
  targetId
  actorUid
  actorEmail
  timestamp
```

## วิธีใช้แบบไม่ติดตั้งโปรแกรมบนเครื่อง

1. เปิด Firebase Console ใน browser
2. สร้าง Project ใหม่
3. เปิด Authentication > Sign-in method > Google
4. เปิด Firestore Database
5. คัดลอกค่า Firebase config ไปใส่ใน Environment Variables ของ Vercel หรือ Firebase Hosting
6. Import repository นี้เข้า Vercel และตั้ง Root Directory เป็น `free-webapp/rtafnc-expense-tracker`
7. Deploy

## Environment Variables

ดูตัวอย่างใน `.env.example`

```text
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_ORG_NAME=วิทยาลัยพยาบาลทหารอากาศ
VITE_ALLOWED_DOMAIN=
```

`VITE_ALLOWED_DOMAIN` เว้นว่างได้ ถ้าต้องการให้ Gmail ทุกโดเมนเข้าได้ในช่วงทดสอบ

## วิธีตั้ง admin คนแรก

หลังจาก login ครั้งแรก ระบบจะสร้าง user เป็น `staff` อัตโนมัติ

ให้เข้า Firestore > collection `users` > เลือกเอกสาร uid ของตัวเอง แล้วแก้ field:

```text
role = admin
active = true
```

จากนั้นกลับเข้าเว็บ จะเห็นเมนู `ตั้งค่า` และปุ่มอนุมัติรายการ

## ข้อห้ามสำคัญ

- ห้าม commit ไฟล์ `.env` จริงขึ้น GitHub
- ห้ามเปิด Firestore เป็น public read/write
- ห้ามใส่ข้อมูลส่วนบุคคลจริงจนกว่าจะทดสอบ rules ผ่าน
- ระบบนี้ยังเป็น MVP ต้องตรวจสอบก่อนใช้งานราชการจริง

## รอบพัฒนาถัดไป

- เพิ่มแนบหลักฐานใบเสร็จผ่าน Firebase Storage
- จำกัดสิทธิ์ตามหน่วยงาน/แผนก
- เพิ่ม Dashboard รายเดือนแบบละเอียด
- เพิ่ม backup เป็น Google Sheet รายเดือน
- เพิ่ม Line Notify/Telegram ผ่าน Google Apps Script หรือ webhook ฝั่ง server ในเฟสถัดไป
