# RTAFNC Scholarship Portal

โปรเจกต์แยกสำหรับระบบขอทุน นักเรียนพยาบาลทหารอากาศ วพอ.

เส้นทางเปิดใช้งานบน GitHub Pages:

```text
https://anuchit1tube168-cmd.github.io/RTAFNC-/apps/scholarship/
```

## แนวคิดที่เรียนรู้จาก template เดิม

ใช้แนว UI เดียวกับ RTAFNC Student Portal เดิม ได้แก่

- mobile-first app shell
- topbar แบบ sticky
- brand mark วพอ.
- member card ขนาดใหญ่
- metric cards
- bottom navigation
- โทนสีเขียว-ทองของ วพอ.

แต่แยกโฟลเดอร์ใหม่ทั้งหมด ไม่แก้ไฟล์เดิมใน `apps/liff/`

## Flow ระบบขอทุน

1. นักเรียนเปิดลิงก์ผ่าน LINE Official Account
2. กรอกคำขอทุน
3. แนบรูปนักเรียน
4. แนบรูปบ้าน/ที่พักหลายรูป
5. กดส่งให้อาจารย์ที่ปรึกษา
6. อาจารย์ที่ปรึกษาอนุมัติหรือส่งกลับแก้ไข
7. ระบบสร้างแบบ PDF สำหรับเสนอคณะกรรมการ

## ไฟล์ในโปรเจกต์

```text
apps/scholarship/
├── index.html
├── styles.css
├── app.js
└── README.md
```

## ขั้นเชื่อมจริงถัดไป

- ใส่ LIFF ID จริงใน `index.html` หรือ `app.js`
- เพิ่ม Google Apps Script Web App backend
- อัปโหลดรูปไป Google Drive
- บันทึกข้อมูลลง Google Sheets
- ส่ง LINE OA push message ไปอาจารย์ที่ปรึกษา
- ออก PDF server-side เพื่อความเป๊ะของฟอร์มราชการ

## หมายเหตุด้านความปลอดภัย

โปรเจกต์หน้า GitHub Pages เป็น front-end preview สำหรับดู UI/UX ก่อน ส่วนข้อมูลจริงและรูปภาพจริงควรเก็บใน Google Drive/Google Sheets ผ่าน Apps Script หรือ backend ที่กำหนดสิทธิ์เข้าถึง ไม่ควรเก็บรูปบ้านหรือข้อมูลส่วนตัวลง GitHub public repo
