# คู่มือติดตั้ง RTAFNC จาก Demo ไปใช้งานจริง

อัปเดต: 20 มิถุนายน 2569

> เอกสารนี้เป็น Runbook สำหรับผู้ดูแลระบบ ห้ามเปลี่ยน `demoMode` เป็น `false` จนกว่าการทดสอบ RLS, Storage และ LINE Identity จะผ่านครบ

## ภาพรวมลำดับติดตั้ง

```text
1. GitHub Pages Online
2. Supabase Project
3. Database Migrations
4. RLS + Storage Policies
5. Edge Functions
6. LINE Login + LIFF
7. LINE Messaging + Telegram
8. Test Accounts
9. Security Tests
10. Import Real Data
```

---

## ขั้นที่ 1 เปิด GitHub Pages

Repository:

```text
anuchit1tube168-cmd/RTAFNC-
```

ตั้งค่า:

```text
Settings
→ Pages
→ Build and deployment
→ Source: GitHub Actions
```

จากนั้นเปิด:

```text
Actions
→ Deploy RTAFNC LIFF Demo
→ Run workflow
→ main
→ Run workflow
```

เมื่อสำเร็จต้องเปิดได้ 3 URL:

```text
Student LIFF: https://anuchit1tube168-cmd.github.io/RTAFNC-/
Staff Demo:   https://anuchit1tube168-cmd.github.io/RTAFNC-/admin-demo/
Health:       https://anuchit1tube168-cmd.github.io/RTAFNC-/health.json
```

หาก `health.json` ไม่มี commit ล่าสุด ให้ตรวจ Workflow ก่อนล้าง Cache มือถือ

---

## ขั้นที่ 2 สร้าง Supabase Project

สร้าง Project ใหม่สำหรับ RTAFNC โดยแยก Development และ Production

แนะนำชื่อ:

```text
rtafnc-dev
rtafnc-prod
```

ค่าที่นำมาใส่หน้าเว็บได้:

```text
Project URL
Publishable Key
```

ค่าที่ห้ามใส่หน้าเว็บหรือ GitHub:

```text
service_role key
Database password
JWT signing secret
```

เปิด Anonymous Sign-ins เฉพาะเมื่อใช้ Session ชั่วคราวสำหรับส่ง LINE ID Token เข้า `line-auth` และต้องมี RLS ปิดกั้นทุกตาราง

---

## ขั้นที่ 3 รัน Database Migrations

รัน Core Schema ก่อน แล้วจึงรัน Migration เสริมตามลำดับเวลา

Migration ที่เพิ่มใน Repository:

```text
202606200001_atomic_line_linking.sql
202606200002_notification_delivery_state.sql
```

ตรวจว่าตารางหลักมีครบ:

```text
students
line_accounts
user_roles
activation_codes
good_deed_categories
good_deed_records
hospital_visits
announcements
news_reads
activities
activity_registrations
documents
notification_events
notification_deliveries
audit_logs
```

ห้ามนำข้อมูลจริงเข้า จนกว่าจะทดสอบ RLS ผ่าน

---

## ขั้นที่ 4 สร้าง Storage Buckets

สร้าง Bucket ดังนี้:

```text
good-deed-files     Private
hospital-files      Private
student-documents   Private
public-news         Public
```

รูปแบบ Path สำหรับไฟล์ส่วนบุคคล:

```text
<student_uuid>/<reference_uuid>/<random_uuid>-<safe_filename>
```

ทดสอบตาม `docs/RLS_TEST_MATRIX.md`

ข้อห้าม:

- ห้ามใช้ Public URL กับใบรับรองแพทย์
- ห้ามใช้ชื่อหรือรหัสนักเรียนเป็นชื่อ Folder หลัก ให้ใช้ UUID
- ห้ามให้ผู้ตรวจความดีอ่าน `hospital-files`
- ห้ามเก็บไฟล์ Binary ในคอลัมน์ฐานข้อมูล

---

## ขั้นที่ 5 Deploy Edge Functions

Functions ที่เตรียมแล้ว:

```text
line-auth
notification-worker
```

ตัวแปรลับของ `line-auth`:

```text
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
LINE_CHANNEL_ID
ALLOWED_ORIGINS
```

ตัวอย่าง `ALLOWED_ORIGINS`:

```text
https://anuchit1tube168-cmd.github.io,https://liff.line.me
```

ตัวแปรลับของ `notification-worker`:

```text
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
LINE_CHANNEL_ACCESS_TOKEN
TELEGRAM_BOT_TOKEN
TELEGRAM_STAFF_CHAT_ID
NOTIFICATION_WORKER_SECRET
```

ห้ามพิมพ์ Secret ลงใน `config.js`

Notification Worker รองรับ:

- Claim งานเพื่อไม่ให้ส่งซ้ำจาก Worker หลายตัว
- LINE Push Message
- Telegram `sendMessage`
- Retry แบบ Exponential Backoff
- Dead Letter เมื่อเกินจำนวนครั้ง
- บันทึกผลใน `notification_deliveries`

---

## ขั้นที่ 6 ตั้งค่า LINE Login และ LIFF

สร้างหรือเลือก LINE Login Channel แล้วเพิ่ม LIFF App

ตั้งค่าแนะนำ:

```text
LIFF app name: RTAFNC Student Portal
Size: Full
Endpoint URL: https://anuchit1tube168-cmd.github.io/RTAFNC-/
Scopes: openid, profile
Module mode: Off
```

เมื่อได้ LIFF ID ให้นำเฉพาะ LIFF ID ใส่ `apps/liff/config.js`

ตัวอย่าง Production Browser Config:

```js
window.RTAFNC_CONFIG = Object.freeze({
  demoMode: false,
  defaultSemester: 1,
  liffId: "YOUR-LIFF-ID",
  lineOaId: "@YOUR_LINE_OA_ID",
  supabaseUrl: "https://YOUR_PROJECT_REF.supabase.co",
  supabasePublishableKey: "YOUR_SUPABASE_PUBLISHABLE_KEY",
});
```

หลักสำคัญ:

- LINE Profile ใช้แสดงผล
- LINE ID Token ต้องส่งแบบ Raw ไปตรวจที่ Server
- ห้ามเชื่อ `userId` ที่ Browser ส่งมาโดยไม่ Verify Token
- หนึ่ง LINE Account เชื่อมกับนักเรียนได้หนึ่ง UUID
- Activation Code ใช้ครั้งเดียวและหมดอายุได้

---

## ขั้นที่ 7 ตั้งค่า Staff Console จริง

Public Staff Demo ที่ `/admin-demo/` ใช้ทดสอบ UX เท่านั้น

Production Staff Console ต้องมี:

```text
Supabase Auth
user_roles
Route Guard
RLS
Medical Role Isolation
Append-only Audit Log
```

บทบาทขั้นต่ำ:

```text
student
good_deed_reviewer
medical
registrar
news_editor
admin
auditor
```

ห้ามใช้ Dropdown เปลี่ยนบทบาทเป็นระบบสิทธิ์จริง

---

## ขั้นที่ 8 ทดสอบบัญชีจำลอง

สร้างข้อมูลทดสอบอย่างน้อย:

```text
Student A
Student B
Good-deed Reviewer
Medical Staff
Registrar
News Editor
Admin
Auditor
```

ทดสอบทั้ง Allow และ Deny

ตัวอย่าง Deny ที่ต้องผ่าน:

```text
Student A อ่าน Student B ไม่ได้
Reviewer อ่านข้อมูลโรงพยาบาลไม่ได้
Registrar อ่านใบรับรองแพทย์ไม่ได้
Student แก้ approved_hours ไม่ได้
Activation Code ใช้ซ้ำไม่ได้
LINE Account เดียวผูก 2 คนไม่ได้
```

---

## ขั้นที่ 9 เปิด Notification Worker

เรียก Worker จากระบบ Scheduler หรือ Cron ด้วย Header:

```text
x-worker-secret: <NOTIFICATION_WORKER_SECRET>
```

Body แบบประมวลผลคิวทั้งหมด:

```json
{}
```

Body แบบระบุ Event:

```json
{
  "eventIds": ["EVENT_UUID"]
}
```

ความถี่แนะนำเริ่มต้น:

```text
ทุก 1–5 นาที
```

อย่าส่งถี่เกินข้อจำกัดของผู้ให้บริการ และต้องตรวจค่าใช้บริการข้อความของ LINE OA

---

## ขั้นที่ 10 ก่อนนำเข้าข้อมูลจริง

Checklist:

- [ ] GitHub Pages เปิดได้และ Health Commit ตรง
- [ ] LINE LIFF เปิดใน LINE ได้
- [ ] LINE ID Token Verify ผ่าน Server
- [ ] Atomic Activation Linking ผ่าน Concurrent Test
- [ ] RLS Test Matrix ผ่านครบ
- [ ] Private Storage Test ผ่านครบ
- [ ] Staff Auth และ Role Guard ใช้งานจริง
- [ ] Medical View สร้าง Audit Log
- [ ] LINE และ Telegram ส่งสำเร็จ
- [ ] Retry และ Dead Letter ทำงาน
- [ ] Backup / Restore ผ่านการทดสอบ
- [ ] Privacy Notice ได้รับอนุมัติ
- [ ] ลบข้อมูล Demo ก่อน Import จริง

เมื่อครบทุกข้อจึงเปลี่ยน:

```js
demoMode: false
```

---

## เอกสารที่ต้องอ่านร่วมกัน

```text
docs/PRODUCTION_GAP_ANALYSIS.md
docs/RLS_TEST_MATRIX.md
apps/liff/config.example.js
apps/admin/config.example.js
```
