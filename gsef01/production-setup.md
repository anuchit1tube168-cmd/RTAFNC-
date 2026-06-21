# Production Setup: ระบบขอทุน นพอ. แบบ นร./กสศ.01

ไฟล์หน้า `gsef01/` บน GitHub Pages เป็น Preview สำหรับดูหน้าตาแบบฟอร์มราชการเท่านั้น ส่วนระบบใช้งานจริงที่ต้องบันทึกข้อมูล อัปโหลดรูปบ้าน เก็บไฟล์ใน Drive และแจ้ง LINE OA ให้ติดตั้งบน Google Apps Script

## โครงระบบจริง

```text
Google Apps Script Web App
├── Code.gs      backend + setup sheets + upload files + approve flow
├── index.html   หน้าเว็บระบบ
├── Styles.html  CSS + official A4 landscape preview
└── Client.html  frontend logic ผ่าน google.script.run

Google Sheets
├── Users
├── Applications
├── HouseholdMembers
├── EvidenceFiles
├── StatusLogs
└── Settings

Google Drive
└── RTAFNC_GSEF01_Scholarship_System_Evidence
```

## ขั้นติดตั้งเร็ว

1. เปิด https://script.google.com
2. New project
3. สร้างไฟล์ `Code.gs`, `index.html`, `Styles.html`, `Client.html`
4. วางโค้ดจาก ZIP ชุด `rtafnc_gsef01_real_system.zip`
5. Run ฟังก์ชัน `setup()` หนึ่งครั้ง
6. Deploy > New deployment > Web app
7. Execute as: Me
8. Who has access: Anyone with the link หรือเฉพาะโดเมนหน่วยงาน
9. เปิด Web App URL แล้ว login

## บัญชีทดสอบ

```text
นักเรียน: std1001 / s12345
อาจารย์: advisor / adv12345
กรรมการ: committee / c12345
แอดมิน: admin / a12345
```

## ฟังก์ชันที่พร้อมใช้งาน

- Login แยก role
- กรอกข้อมูลแบบ นร./กสศ.01
- Official Preview แบบ A4 landscape
- เพิ่ม/ลบสมาชิกครัวเรือน
- คำนวณรายได้รวมและรายได้เฉลี่ย
- อัปโหลดรูปนักเรียน/ผู้ปกครอง
- อัปโหลดรูปบ้าน/ที่พัก
- บันทึกลง Google Sheets
- เก็บไฟล์ใน Google Drive
- ส่งให้อาจารย์ที่ปรึกษา
- อนุมัติ / ส่งกลับแก้ไข
- Print / Save PDF
- รองรับ LINE OA notification ผ่าน `configureLine()`

## หมายเหตุด้านความปลอดภัย

ข้อมูลส่วนบุคคลและรูปบ้านไม่ควรเก็บใน GitHub public repo ให้ใช้ GitHub Pages เฉพาะ preview ส่วนระบบจริงให้เก็บผ่าน Google Apps Script, Google Sheets และ Google Drive เท่านั้น
