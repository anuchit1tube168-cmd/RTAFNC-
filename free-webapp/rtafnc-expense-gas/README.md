# RTAFNC Expense Tracker - No Firebase Edition

เวอร์ชันนี้ตัด Firebase ออกทั้งหมด ใช้เฉพาะเครื่องมือฟรีของ Google ที่เหมาะกับองค์กร:

- Google Apps Script เป็นตัว WebApp และ Backend
- Google Sheets เป็นฐานข้อมูล
- Google Drive เก็บไฟล์หลักฐานแนบรายการ
- Google Account Login ผ่านสิทธิ์ของ Apps Script Web App
- GitHub ใช้เก็บ source code / version
- ไม่ต้องใช้ Firebase Auth
- ไม่ต้องใช้ Firestore
- ไม่ต้องใช้ Vercel
- ไม่ต้องติดตั้งโปรแกรมบนเครื่องผู้ใช้

## เหมาะกับกรณีไหน

เหมาะกับระบบภายในองค์กรที่ต้องการเริ่มเร็ว ต้นทุนต่ำ และอยากให้ข้อมูลอยู่ใน Google Drive / Google Sheets เช่น:

- ระบบบันทึกรายรับรายจ่าย
- ระบบบันทึกความดี
- ระบบติดตามงาน
- ระบบลาออนไลน์ฉบับเริ่มต้น
- ระบบเบิกวัสดุ
- ระบบกิจการนักเรียน

## ไฟล์หลัก

```text
free-webapp/rtafnc-expense-gas/
├── Code.gs
├── Index.html
├── appsscript.json
├── README.md
└── docs/
```

## ฟังก์ชันที่ทำแล้ว

- เปิดเป็น WebApp ผ่าน Google Apps Script
- Auto-create Google Sheet Database ครั้งแรก
- Auto-create Google Drive Folder สำหรับหลักฐาน
- Login ด้วย Google Account จาก Apps Script
- สร้าง user คนแรกเป็น admin อัตโนมัติ
- user คนถัดไปเป็น staff อัตโนมัติ
- role: admin / staff / viewer
- Dashboard สรุปรายรับ รายจ่าย คงเหลือ และรายการรออนุมัติ
- Form บันทึกรายการ
- แนบหลักฐานรูปภาพ/PDF ไม่เกิน 5MB ต่อรายการ
- Table ค้นหาและกรองรายการ
- Admin อนุมัติ / ไม่อนุมัติ / ลบรายการ
- Export CSV ภาษาไทย พร้อม link หลักฐาน
- Report พร้อม Print / Save PDF ผ่าน browser
- Settings สำหรับแก้ชื่อองค์กร ปีงบประมาณ และหมวดหมู่
- Audit log ลง Google Sheet
- Responsive รองรับมือถือ

## Sheet ที่ระบบสร้าง

```text
Users
Transactions
Settings
AuditLogs
```

## Drive Folder ที่ระบบสร้าง

```text
RTAFNC Expense Tracker Evidence
```

ไฟล์หลักฐานจะถูกเก็บใน folder นี้ และ URL จะถูกบันทึกใน column `evidenceUrl`

## Deploy แบบง่าย

1. เปิด Google Apps Script
2. สร้าง Project ใหม่
3. เพิ่มไฟล์ `Code.gs`
4. เพิ่มไฟล์ HTML ชื่อ `Index`
5. วางโค้ดจาก repo นี้
6. Project Settings > เปิด Show appsscript.json แล้ววาง manifest
7. กด Deploy > New deployment > Web app
8. Execute as: User accessing the web app หรือ Me ตามนโยบายหน่วยงาน
9. Who has access: Anyone with Google account หรือเฉพาะโดเมนองค์กร
10. เปิด URL ที่ได้

## หมายเหตุเรื่องหลักฐาน

ค่าเริ่มต้น `APP.evidencePublicLink = false` หมายถึงไฟล์หลักฐานจะไม่ถูกเปิด public link อัตโนมัติ

ถ้า admin เปิดไฟล์หลักฐานของ staff ไม่ได้ ให้ใช้หนึ่งในทางเลือกนี้:

1. Deploy แบบ Execute as: Me เพื่อให้ไฟล์ถูกสร้างภายใต้เจ้าของระบบ
2. ตั้ง sharing ของ folder หลักฐานใน Google Drive ให้ admin เปิดดูได้
3. ถ้าต้องการ link เปิดได้เลย ให้เปลี่ยน `APP.evidencePublicLink` เป็น `true` แต่ควรใช้เฉพาะข้อมูลที่ไม่อ่อนไหว

## หมายเหตุเรื่อง Login

ถ้าต้องการให้ระบบอ่านอีเมลผู้ใช้ได้ชัดเจนที่สุด ควรใช้ Google Workspace/โดเมนองค์กร และตั้งค่า WebApp ให้ผู้ใช้ต้อง login ก่อน

ถ้า Deploy แบบเปิดสาธารณะเกินไป Apps Script อาจไม่คืนค่าอีเมลผู้ใช้ ระบบจะเตือนว่าไม่พบอีเมล

## ข้อดีเมื่อเทียบกับ Firebase

- ข้อมูลง่ายต่อการตรวจสอบ เพราะอยู่ใน Google Sheet
- หลักฐานอยู่ใน Google Drive
- ผู้ดูแลที่ไม่ใช่โปรแกรมเมอร์เปิดดูข้อมูลได้ทันที
- ไม่ต้องตั้ง Firestore Rules
- ไม่ต้องตั้ง Firebase config
- ไม่ต้องกลัว billing จาก Firebase/Cloud
- เหมาะกับระบบ MVP ภายในองค์กร

## ข้อจำกัด

- ไม่เหมาะกับผู้ใช้พร้อมกันจำนวนมากมาก ๆ
- Apps Script มี quota รายวัน
- Sheet ไม่ใช่ฐานข้อมูลจริงสำหรับงานหนัก
- การกำหนดสิทธิ์ขั้นสูงสู้ Firebase ไม่ได้
- ถ้าโตแล้วค่อยย้ายไป Firebase/Supabase/Cloud SQL ในเฟส 2

## ทางที่แนะนำตอนนี้

สำหรับงาน วพอ. ที่ต้องเริ่มใช้จริงเร็ว ให้ใช้เวอร์ชันนี้ก่อน เพราะข้อมูลอยู่ใน Google Drive/Sheet ตรวจง่าย แก้ง่าย และไม่ต้องมีค่าใช้จ่าย
