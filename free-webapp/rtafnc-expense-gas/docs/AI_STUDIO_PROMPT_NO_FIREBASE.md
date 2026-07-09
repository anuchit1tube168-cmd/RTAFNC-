# Prompt: No Firebase WebApp

ใช้ prompt นี้กับ Google AI Studio เมื่ออยากสร้างระบบองค์กรโดยไม่ใช้ Firebase

```text
สร้าง WebApp ภาษาไทยสำหรับองค์กร โดยไม่ใช้ Firebase และไม่ใช้ Vercel
ให้ใช้ Google Apps Script เป็น WebApp/Backend และ Google Sheets เป็น Database

ข้อกำหนด:
- ไฟล์หลักต้องมี Code.gs และ Index.html
- ใช้ HtmlService แสดงหน้าเว็บ
- ใช้ SpreadsheetApp อ่าน/เขียนข้อมูล
- ใช้ Session.getActiveUser().getEmail() สำหรับระบุตัวผู้ใช้
- สร้าง Google Sheet Database อัตโนมัติถ้ายังไม่มี
- มี role: admin, staff, viewer
- user คนแรกเป็น admin อัตโนมัติ
- user คนถัดไปเป็น staff อัตโนมัติ
- admin เห็นทุกข้อมูล อนุมัติ/ลบได้
- staff เห็นเฉพาะข้อมูลของตัวเอง และบันทึกได้เป็น pending เท่านั้น
- viewer ดูได้อย่างเดียว
- มี Dashboard, Form, Table, Search, Filter, Report, Export CSV, Print/Save PDF, Settings, AuditLogs
- UI ภาษาไทย โทน navy/cyan/white เหมาะกับองค์กรราชการ
- รองรับมือถือ
- ห้ามใช้ Firebase Auth, Firestore, Cloud Functions, Vercel, Node backend

ขอให้สร้างโค้ดครบพร้อมวิธี Deploy เป็น Google Apps Script Web App
```

## Prompt สำหรับระบบอื่น

```text
นำสถาปัตยกรรม Google Apps Script + Google Sheets นี้ไปปรับเป็นระบบ [ชื่อระบบ]
ให้คง pattern เดิม: role, audit log, dashboard, report, export, mobile responsive
และอธิบาย Sheet Schema ก่อนเริ่มเขียน code
```
