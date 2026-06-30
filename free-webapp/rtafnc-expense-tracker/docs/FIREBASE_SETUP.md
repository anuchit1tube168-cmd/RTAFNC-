# Firebase Setup

## 1. สร้าง Firebase Project

เปิด Firebase Console ใน browser แล้วสร้าง Project ใหม่ เช่น `rtafnc-expense-tracker`

## 2. เปิด Authentication

ไปที่ Authentication > Sign-in method แล้วเปิด Google provider

เพิ่ม domain ที่ใช้งานจริงใน Authorized domains เช่น domain ของ Vercel หรือ Firebase Hosting

## 3. เปิด Firestore Database

ไปที่ Firestore Database แล้วสร้างฐานข้อมูลแบบ Production mode

จากนั้นนำ rules ในไฟล์ `firestore.rules` ไป deploy หรือคัดลอกไปวางในหน้า Rules

## 4. คัดลอก Web App Config

ไปที่ Project settings > Your apps > Web app แล้วคัดลอกค่า config ไปใส่ Environment Variables

รายการค่าที่ต้องใช้:

```text
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

## 5. ตั้ง Admin คนแรก

หลัง login ครั้งแรก ระบบจะสร้างเอกสารใน `users/{uid}` อัตโนมัติเป็น role `staff`

ให้แก้ user ตัวแรกเป็น:

```text
role: admin
active: true
```

## 6. Deploy ผ่าน Vercel แบบไม่ติดตั้งโปรแกรม

1. เปิด Vercel ใน browser
2. Add New Project
3. Import repo `anuchit1tube168-cmd/RTAFNC-`
4. ตั้ง Root Directory เป็น `free-webapp/rtafnc-expense-tracker`
5. ใส่ Environment Variables ให้ครบ
6. กด Deploy

## 7. Checklist หลัง Deploy

- Login ด้วย Gmail ได้
- Firestore สร้าง users ได้
- เพิ่มรายการได้
- staff เห็นเฉพาะของตัวเอง
- admin เห็นทุกคนและอนุมัติได้
- viewer ดูได้อย่างเดียว
- Firestore rules ไม่เปิด public read/write
