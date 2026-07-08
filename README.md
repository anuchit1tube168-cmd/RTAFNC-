# RTAFNC Student System

ระบบต้นแบบสำหรับนักเรียนพยาบาลทหารอากาศ ใช้งานผ่าน LINE Official Account และ LINE LIFF พร้อม Staff Console สำหรับเจ้าหน้าที่

> **สถานะปัจจุบัน: Public Demo Repository**
> ห้ามใส่ข้อมูลนักเรียนจริง ข้อมูลสุขภาพจริง รหัสผ่าน หรือข้อมูลลับลงใน Repository นี้

## Online demo

เมื่อ GitHub Pages Workflow สำเร็จ:

- Student LIFF Demo: `https://anuchit1tube168-cmd.github.io/RTAFNC-/`
- Staff Console Demo: `https://anuchit1tube168-cmd.github.io/RTAFNC-/admin-demo/`
- Deployment health: `https://anuchit1tube168-cmd.github.io/RTAFNC-/health.json`

GitHub Pages ต้องตั้งค่า:

```text
Settings → Pages → Source → GitHub Actions
```

## Implemented demo functions

### Student LIFF

- Dashboard และบัตรสมาชิก
- บันทึกความดีครบ 8 ประเภท
- เพิ่ม แก้ไข ลบ คัดลอก และบันทึกร่าง
- ตรวจความถูกต้องของ Input
- แนบ JPG, PNG, WebP และ PDF ไม่เกิน 10 MB ต่อไฟล์
- ค้นหาและกรองประวัติ
- บันทึกการไปโรงพยาบาลแยกจากความดี
- นัดติดตามอาการและปิดการรักษา
- ข่าวใหม่ / อ่านแล้ว / รับทราบ
- ส่งออก JSON และพิมพ์สรุป
- เก็บข้อมูลสาธิตใน localStorage

### Staff Console

- Dashboard ภาพรวม
- คิวตรวจและอนุมัติความดี
- อนุมัติ / ส่งกลับแก้ไข / ไม่อนุมัติ
- Medical Role Panel แยกจากผู้ตรวจความดี
- จัดการข่าวและกลุ่มเป้าหมาย
- ทะเบียนนักเรียนและตรวจรหัสซ้ำ
- นำเข้ารายชื่อแบบ CSV
- สร้าง Activation Code แบบครั้งเดียว
- Audit Log
- Notification Queue Simulation
- Role-based UI Demo

## Planned production architecture

- LINE Login + LIFF
- Supabase PostgreSQL, Auth, RLS and Private Storage
- Edge Functions
- LINE Messaging API
- Telegram notifications
- PDF report export
- Google Sheet export / archive workflow

## Project structure

```text
apps/liff/                    Student LIFF frontend
apps/admin/                   Staff Console demo
supabase/migrations/          Database schema and RLS
supabase/functions/           Server-side Edge Functions
docs/                         Architecture and security documentation
docs/sop/                     SOP indexes and operational documentation
skills/                       Reusable AI/operator skills for this repository
tests/                        Static contract and secret checks
.github/workflows/pages.yml   Demo deployment
```

## Operational skills

This repository now includes reusable skills for building and auditing operating procedures.

- `skills/sop-it-operations/SKILL.md` - SOP skill for System Admin, IT Support Ticketing, incident, access control, backup/restore, patch, SLA/KPI, evidence, and audit controls.
- `skills/sop-it-operations/README.md` - usage guide for the SOP IT Operations skill.
- `docs/sop/sop-it-operations-index.md` - SOP catalog and operational index.

## Security rules

- Never commit real student records or health records.
- Never commit server-side credentials or messaging tokens.
- Browser code may contain only public project identifiers after RLS has passed testing.
- Hospital records and hospital files must have stricter policies than good-deed data.
- Staff UI role checks are not a security boundary; Production security must be enforced by Auth and RLS.
- LINE profile information is display-only. Identity must be verified server-side from the raw LINE ID token.

## Production readiness

See:

- `docs/PRODUCTION_GAP_ANALYSIS.md`
- `apps/liff/config.example.js`

Keep this setting until all go-live gates pass:

```js
demoMode: true
```

## Local preview

```bash
python3 tools/preview_server.py --port 5500
```

Then open:

```text
Student LIFF: http://localhost:5500/liff/
Staff Admin:  http://localhost:5500/admin/
```
