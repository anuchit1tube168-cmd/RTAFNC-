# Sheet Schema

ระบบสร้าง Google Sheet Database อัตโนมัติ 4 sheet และสร้าง Google Drive Folder สำหรับเก็บหลักฐาน

## Users

| column | ความหมาย |
|---|---|
| email | อีเมลผู้ใช้ ใช้เป็นรหัสหลัก |
| displayName | ชื่อแสดงผล |
| role | admin / staff / viewer |
| department | แผนก |
| active | true / false |
| createdAt | วันที่สร้าง |
| updatedAt | วันที่แก้ไข |

## Transactions

| column | ความหมาย |
|---|---|
| id | UUID ของรายการ |
| type | income / expense |
| category | หมวดหมู่ |
| amount | จำนวนเงิน |
| date | วันที่รายการ |
| note | รายละเอียด |
| evidenceName | ชื่อไฟล์หลักฐาน |
| evidenceUrl | URL ไฟล์หลักฐานใน Google Drive |
| status | pending / approved / rejected |
| createdByEmail | ผู้บันทึก |
| approvedByEmail | ผู้อนุมัติ |
| createdAt | วันที่สร้าง |
| updatedAt | วันที่แก้ไขล่าสุด |

## Settings

| key | value |
|---|---|
| organizationName | ชื่อองค์กร |
| fiscalYear | ปีงบประมาณ / ปีการศึกษา |
| categories | หมวดหมู่ แยกบรรทัด |

## AuditLogs

| column | ความหมาย |
|---|---|
| timestamp | เวลาที่เกิด action |
| action | ชื่อ action |
| targetSheet | sheet เป้าหมาย |
| targetId | id เป้าหมาย |
| actorEmail | ผู้กระทำ |
| detail | รายละเอียด |

## Drive Folder

ระบบสร้าง folder ชื่อ:

```text
RTAFNC Expense Tracker Evidence
```

ไฟล์หลักฐานจะใช้ชื่อประมาณ:

```text
transactionId_userEmail_originalFileName
```

## หมายเหตุ

อย่าเปลี่ยนชื่อหัวตารางเอง ถ้าต้องเพิ่ม column ให้เพิ่มท้ายตารางเท่านั้น เพื่อไม่ให้ code อ่านผิด

ถ้าระบบเคยสร้าง Sheet ก่อนเพิ่ม column ใหม่แล้ว code ล่าสุดจะเติม header ที่ขาดให้เองอัตโนมัติ
