# แบบ นร./กสศ.01 สำหรับระบบขอทุน วพอ.

หน้า GitHub Pages:

```text
https://anuchit1tube168-cmd.github.io/RTAFNC-/gsef01/
```

โปรเจกต์นี้มี 2 ระดับ:

1. **GitHub Pages Preview** — ดูหน้าตาแบบฟอร์มราชการ A4 แนวนอน อ้างอิงแบบ นร./กสศ.01
2. **Production System** — ติดตั้งบน Google Apps Script เพื่อบันทึกข้อมูลจริงลง Google Sheets, อัปโหลดรูปไป Google Drive, ส่งให้อาจารย์ที่ปรึกษาอนุมัติ และ Print/Save PDF

## สิ่งที่ทำแล้วใน Preview

- โครงแบบฟอร์มราชการ A4 landscape
- โลโก้ กสศ. placeholder
- ช่องเลขบัตรประชาชน 13 ช่อง
- checkbox/radio พร้อมเครื่องหมายถูกสีน้ำเงิน
- ตารางสมาชิกครัวเรือนแบบหลายชั้น
- เพิ่ม/ลบสมาชิกครัวเรือน
- คำนวณรายได้รวมและรายได้เฉลี่ย
- อัปโหลดรูปประกอบและรูปบ้านในฝั่งหน้าเว็บ
- Print / Save PDF ผ่าน browser

## ระบบจริงที่เตรียมให้แล้ว

ไฟล์ชุดติดตั้งจริงอยู่ใน ZIP: `rtafnc_gsef01_real_system.zip`

โครงระบบจริง:

```text
apps_script/
├── Code.gs        backend + setup sheets + upload files + approve flow
├── index.html     หน้าเว็บระบบจริง
├── Styles.html    CSS + official A4 preview
└── Client.html    frontend logic ผ่าน google.script.run

docs/
├── SETUP_GUIDE.md
├── LINE_OA_SETUP.md
├── PDF_QA_CHECKLIST.md
└── SHEET_SCHEMA.md
```

## บัญชีทดสอบ

```text
นักเรียน: std1001 / s12345
อาจารย์: advisor / adv12345
กรรมการ: committee / c12345
แอดมิน: admin / a12345
```

## ขั้นติดตั้งจริงแบบย่อ

1. เปิด https://script.google.com
2. New project
3. สร้างไฟล์ `Code.gs`, `index.html`, `Styles.html`, `Client.html`
4. วางโค้ดจาก ZIP ให้ตรงไฟล์
5. Run ฟังก์ชัน `setup()`
6. Deploy เป็น Web App
7. เปิด URL แล้ว login ด้วยบัญชีทดสอบ

ดูคู่มือเต็ม: `gsef01/production-setup.md`

## หมายเหตุ

ข้อมูลส่วนบุคคลและรูปบ้านไม่ควรเก็บใน GitHub public repo ให้ใช้ GitHub Pages เฉพาะ preview ส่วนระบบจริงให้รันผ่าน Google Apps Script + Google Sheets + Google Drive
