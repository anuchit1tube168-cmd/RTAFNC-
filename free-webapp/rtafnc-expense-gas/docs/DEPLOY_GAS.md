# Deploy Guide: Google Apps Script WebApp

## เป้าหมาย

Deploy ระบบโดยไม่ใช้ Firebase และไม่ใช้ Vercel ขึ้นเป็นเว็บผ่าน Google Apps Script โดยตรง

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

กด Run เพื่อให้ระบบขอสิทธิ์ Google Sheet / Drive / Email

### 5. Deploy เป็น Web App

ไปที่:

```text
Deploy > New deployment > Web app
```

ตั้งค่าแนะนำ:

```text
Description: v1 no-firebase
Execute as: User accessing the web app
Who has access: Anyone with Google account
```

ถ้าเป็น Google Workspace ขององค์กร ให้เลือกเฉพาะคนในโดเมนองค์กรได้

### 6. เปิด URL

กด Deploy แล้วเปิด URL ที่ได้ ระบบจะสร้าง Google Sheet Database อัตโนมัติใน Drive ของเจ้าของ Script

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
- เพิ่มรายการรายจ่าย
- เปิดหน้า Report
- Export CSV
- เปิด Sheet ตรวจว่าข้อมูลเข้า `Transactions`
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

### แก้ Code แล้วเว็บไม่เปลี่ยน

ให้ Deploy > Manage deployments > Edit > New version แล้ว deploy ใหม่
