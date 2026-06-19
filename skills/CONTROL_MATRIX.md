# RTAFNC Skill Control Matrix

## ระดับการปฏิบัติ

| Level | เป้าหมาย | Skills | ผลลัพธ์ |
|---|---|---|---|
| L0 | เปิดหน้าระบบ | LIFF Shell | หน้าโหลดบน LINE ได้ |
| L1 | ยืนยันตัวตน | LINE Identity, Member Linking | ได้สมาชิกที่ผ่านการตรวจ |
| L2 | ควบคุมสิทธิ์ | Supabase Session and RLS | เห็นเฉพาะข้อมูลตามสิทธิ์ |
| L3 | ธุรกรรมหลัก | Good Deeds, Hospital | ส่งและอ่านข้อมูลได้ |
| L4 | ไฟล์และการสื่อสาร | Private Storage, Notification Hub | แนบไฟล์และแจ้งเตือนได้ |
| L5 | งานเจ้าหน้าที่ | Admin Review | ตรวจ อนุมัติ และติดตามได้ |
| L6 | เอกสารและรายงาน | Report Export | สร้าง Sheet และ PDF ได้ |
| L7 | เปิดใช้งานจริง | Deployment | ระบบขึ้น Server และ LIFF |
| L8 | รับรองคุณภาพ | Security QA | ผ่าน Release Gate |
| L9 | รับมือเหตุผิดปกติ | Incident Response | ควบคุมและกู้คืนระบบได้ |

## Dependency Graph

```text
00 Control Plane
├── 01 LIFF Shell
│   └── 02 LINE Identity
│       └── 03 Member Linking
│           └── 04 Supabase Session and RLS
│               ├── 05 Good Deeds
│               │   ├── 07 Private Storage
│               │   ├── 08 Notification Hub
│               │   └── 09 Admin Review
│               └── 06 Hospital
│                   ├── 07 Private Storage
│                   ├── 08 Notification Hub
│                   └── 09 Admin Review
├── 10 Report Export
├── 11 Deployment
├── 12 Security QA
└── 13 Incident Response
```

## Release Gate

ระบบจะเปิด Production ได้เมื่อ:

- L0–L4 ผ่าน Functional Test
- L1–L2 ผ่าน Identity และ RLS Test
- L3 แยกความดีและโรงพยาบาลโดยสมบูรณ์
- L4 ไฟล์ทั้งหมดอยู่ Private Bucket
- L5 ตรวจ Role และ Audit Log ได้
- L7 มี HTTPS และ Rollback
- L8 ไม่มี Critical หรือ High issue ค้าง

## Central Commands

- `START_LIFF` → 01 → 02 → 03 → 04
- `SUBMIT_GOOD_DEED` → 04 → 05 → 07 → 08
- `SUBMIT_HOSPITAL_VISIT` → 04 → 06 → 07 → 08
- `REVIEW_GOOD_DEED` → 04 → 09 → 08
- `EXPORT_REPORT` → 04 → 10 → 07 → 08
- `DEPLOY_RELEASE` → 11 → 12
- `HANDLE_INCIDENT` → 13 → 12 → 11
