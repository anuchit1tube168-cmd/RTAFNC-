# Deploy Guide: Google Apps Script WebApp

## เป้าหมาย

Deploy ระบบโดยไม่ใช้ Firebase และไม่ใช้ Vercel ขึ้นเป็นเว็บผ่าน Google Apps Script โดยตรง พร้อม Google Sheet Database และ Google Drive Evidence Folder

## ขั้นตอน

### 1. สร้าง Apps Script Project

เปิด Google Apps Script แล้วสร้าง Project ใหม่ เช่น:

```text
RTAFNC Expense Tracker GAS
```

### 2. วางไฟล์

สร้างไฟล์ตามนี้:

```text
Code.gs
Index.html
appsscript.json
```

คัดลอกจาก repo:

```text
free-webapp/rtafnc-expense-gas/
```

### 3. เปิด appsscript.json

ไปที่ Project Settings แล้วเปิด:

```text
Show appsscript.json manifest file in editor
```

จากนั้นวางเนื้อหา `appsscript.json`

### 4. Run ครั้งแรก

เลือก function:

```text
doGet
```

กด Run เพื่อให้ระบบขอสิทธิ์:

- Google Sheets
- Google Drive
- Email ของผู้ใช้

ระบบต้องใช้ Drive scope เพราะมีการอัปโหลดไฟล์หลักฐานไปเก็บใน Google Drive

### 5. Deploy เป็น Web App

ไปที่:

```text
Deploy > New deployment > Web app
```

ตั้งค่าแนะนำแบบควบคุมสิทธิ์ง่าย:

```text
Description: v1 no-firebase
Execute as: Me
Who has access: Anyone with Google account
```

เหตุผล: ถ้า Execute as: Me ไฟล์หลักฐานจะถูกสร้างใน Drive ของเจ้าของระบบ ทำให้จัดการ folder และแชร์สิทธิ์ให้ admin ได้ง่ายกว่า

ถ้าเป็น Google Workspace ขององค์กร ให้เลือกเฉพาะคนในโดเมนองค์กรได้

### 6. เปิด URL

กด Deploy แล้วเปิด URL ที่ได้ ระบบจะสร้างสิ่งต่อไปนี้อัตโนมัติ:

```text
RTAFNC Expense Tracker Database
RTAFNC Expense Tracker Evidence
```

### 7. Admin คนแรก

บัญชีแรกที่เปิดระบบจะเป็น admin อัตโนมัติ

บัญชีถัดไปจะเป็น staff อัตโนมัติ

ถ้าต้องการเปลี่ยน role ให้เปิด Sheet `Users` แล้วแก้ column `role` เป็น:

```text
admin
staff
viewer
```

## ทดสอบขั้นต่ำ

- Login ด้วยบัญชีแรก แล้วดูว่าเป็น admin
- เพิ่มรายการรายจ่ายพร้อมแนบรูปภาพหรือ PDF ไม่เกิน 5MB
- เปิด Sheet ตรวจว่าข้อมูลเข้า `Transactions`
- เปิด Drive Folder ตรวจว่าไฟล์เข้า `RTAFNC Expense Tracker Evidence`
- เปิด link หลักฐานในตาราง
- เปิดหน้า Report
- Export CSV แล้วตรวจว่ามี `evidenceUrl`
- Login ด้วยบัญชีที่สอง แล้วตรวจว่าเห็นเฉพาะรายการตัวเอง
- Admin อนุมัติรายการของ staff ได้

## ปัญหาที่พบบ่อย

### ระบบขึ้นว่าไม่พบอีเมลผู้ใช้

ให้ตรวจ Deploy setting ว่าต้อง login ด้วย Google Account และไม่ได้เปิดแบบ anonymous

### ไม่เห็น Sheet Database

ระบบสร้าง Sheet ใน Drive ของเจ้าของ Script อัตโนมัติ ชื่อประมาณ:

```text
RTAFNC Expense Tracker Database
```

### ไม่เห็น Folder หลักฐาน

ระบบจะสร้างเมื่อมีการบันทึกรายการพร้อมไฟล์ครั้งแรก ชื่อประมาณ:

```text
RTAFNC Expense Tracker Evidence
```

### Admin เปิดหลักฐานของ staff ไม่ได้

แนวทางแก้:

1. Deploy แบบ `Execute as: Me`
2. แชร์ folder `RTAFNC Expense Tracker Evidence` ให้ admin
3. หรือปรับ `APP.evidencePublicLink = true` ใน `Code.gs` ถ้าต้องการให้เปิดผ่าน link ได้ทันที

### แก้ Code แล้วเว็บไม่เปลี่ยน

ให้ Deploy > Manage deployments > Edit > New version แล้ว deploy ใหม่
