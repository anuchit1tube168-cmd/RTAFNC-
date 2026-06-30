# Skill: Free Organizational WebApp Builder

## เป้าหมาย

สร้าง WebApp สำหรับองค์กรแบบเริ่มต้นฟรีหรือประหยัดที่สุด โดยใช้เครื่องมือผ่าน browser เป็นหลัก ไม่บังคับติดตั้งโปรแกรมในเครื่องผู้ใช้งาน

## Stack มาตรฐาน

- UI: Google Stitch หรือ AI Studio ช่วยออกแบบ
- Frontend: React + Vite
- Auth: Firebase Authentication ด้วย Google Sign-In
- Database: Cloud Firestore
- Version: GitHub
- Deploy: Vercel หรือ Firebase Hosting
- Phase 1: Static WebApp ไม่มี server backend

## หลักคิด

1. เริ่มจากระบบเล็กที่มี Form + Dashboard + Login + Database
2. แยก role ตั้งแต่วันแรก: admin / staff / viewer
3. ห้ามเปิดฐานข้อมูลแบบ public
4. ห้ามเอาข้อมูลจริงลงจนกว่าจะทดสอบ rules
5. ทำระบบให้ export ข้อมูลได้เสมอ เพื่อไม่ติด platform

## Prompt หลัก

```text
สร้าง WebApp ภาษาไทยสำหรับองค์กร ใช้ React + Vite + Firebase Authentication + Cloud Firestore
ต้องมี Login ด้วย Gmail, role admin/staff/viewer, Dashboard, Form, Table, Search, Filter, Export CSV, Audit Log และ Firestore Rules ที่ปลอดภัย
ห้ามใช้ Cloud Functions หรือ backend ในเฟสแรก
ออกแบบ UI ให้รองรับมือถือและเหมาะกับองค์กรราชการ
```

## ขั้นตอนทำงาน

1. เขียน requirement ระบบเป็นตาราง
2. ให้ AI ออกแบบ UI ก่อน ไม่เริ่มจาก code ทันที
3. สร้าง data model ของ Firestore
4. สร้าง rules แยกสิทธิ์
5. สร้าง frontend
6. Login ทดสอบด้วย user จริง
7. ตั้ง admin คนแรกใน Firestore
8. Deploy และทดสอบบนมือถือ
9. เปิดให้กลุ่มเล็กใช้ก่อน 7 วัน
10. เก็บ feedback แล้วค่อยเพิ่ม feature

## Definition of Done

- เปิดเว็บผ่านมือถือได้
- Login ได้
- เพิ่มข้อมูลแล้วเข้า Firestore จริง
- staff เห็นเฉพาะข้อมูลตนเอง
- admin เห็นและอนุมัติได้
- export CSV ได้
- ไม่มี `.env` จริงใน GitHub
- มี README และ security checklist

## ใช้ซ้ำกับระบบอื่นได้

ระบบนี้นำไปแตกเป็นงานอื่นได้ เช่น:

- ระบบบันทึกความดี
- ระบบลาออนไลน์
- ระบบครุภัณฑ์
- ระบบจัดซื้อจัดจ้างเบื้องต้น
- ระบบบันทึกการฝึก
- ระบบเบิกวัสดุสำนักงาน
- ระบบติดตามงานอาจารย์ที่ปรึกษา
