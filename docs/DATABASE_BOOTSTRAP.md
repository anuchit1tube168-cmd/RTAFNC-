# RTAFNC Database Bootstrap

เอกสารนี้ใช้สำหรับสร้าง Supabase Staging Database ก่อนเชื่อม LINE LIFF จริง

## เป้าหมาย

เมื่อทำครบ จะได้:

- ตารางนักเรียน
- ตาราง LINE Account และ Activation Code
- ระบบความดี 8 หัวข้อ
- ระบบไปโรงพยาบาลแยกตาราง
- ข่าว กิจกรรม เอกสาร และการแจ้งเตือน
- Row Level Security
- Private Storage
- ข้อมูลสาธิตสำหรับทดสอบ Dashboard

## ขั้นที่ 1: สร้าง Supabase Project

สร้าง Project ชื่อแนะนำ:

```text
rtafnc-staging
```

ใช้ Staging ก่อนและห้ามใส่ข้อมูลนักเรียนจริงในช่วงทดสอบ

## ขั้นที่ 2: รัน Migration ตามลำดับ

เปิด SQL Editor แล้วรันทีละไฟล์ตามลำดับนี้:

```text
1. supabase/migrations/0001_core_schema.sql
2. supabase/migrations/0002_line_member_auth.sql
3. supabase/migrations/0003_staff_roles_and_policies.sql
```

ต้องรอให้คำสั่งแต่ละไฟล์สำเร็จก่อนรันไฟล์ถัดไป

## ขั้นที่ 3: ใส่ข้อมูลสาธิต

รัน:

```text
supabase/seed.sql
```

ข้อมูลที่สร้าง:

```text
นักเรียนทดสอบ: 6700000
ชื่อ: นพอ.ตัวอย่าง ระบบทดสอบ
รุ่น: 67
ชั้นปี: 2
รหัสเปิดใช้งาน Staging: RTAFNC-DEMO-6700000
```

รหัสนี้ใช้เฉพาะ Staging และต้องไม่ใช้ใน Production

## ขั้นที่ 4: ตรวจผล

รัน:

```text
supabase/verify.sql
```

ผลที่ควรได้:

- ตารางหลักครบ 15 ตาราง
- RLS เป็น true ทุกตารางข้อมูลส่วนบุคคล
- หมวดความดี active เท่ากับ 8
- good-deed-files เป็น Private
- hospital-files เป็น Private
- student-documents เป็น Private
- public-news เป็น Public
- พบนักเรียนทดสอบรหัส 6700000

## ขั้นที่ 5: คัดลอก Browser-safe Values

จาก Supabase Project Settings นำเฉพาะ:

```text
Project URL
Publishable Key
```

ใส่ใน Private Server `.env`:

```text
SUPABASE_URL=https://PROJECT_REF.supabase.co
SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
LIFF_ID=
LINE_OA_ID=
DEFAULT_SEMESTER=1
DEMO_MODE=true
```

ห้ามใส่ใน Frontend หรือ GitHub:

```text
service-role key
Database password
LINE Channel Secret
LINE Channel Access Token
Telegram Bot Token
```

## ขั้นที่ 6: Deploy Edge Function ภายหลัง

หลัง Database ผ่านการตรวจแล้ว จึง Deploy:

```text
supabase/functions/line-auth
```

และตั้ง Server Secrets:

```text
LINE_CHANNEL_ID
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
```

## ขั้นที่ 7: เชื่อม Lovable

ใน Lovable Project ให้เชื่อม Supabase Staging Project เดียวกัน และกำชับว่า:

- ใช้ตารางเดิม
- ห้ามสร้างตารางชื่อซ้ำ
- ห้ามปิด RLS
- ใช้ Hospital Private Storage
- ผู้ตรวจความดีห้ามอ่านข้อมูลโรงพยาบาล

## Release Gate

ยังคงตั้ง:

```text
DEMO_MODE=true
```

จนกว่าจะผ่าน:

- LINE Token Verification
- Member Linking
- RLS Test ระหว่างนักเรียน A และ B
- Medical Role Test
- Private File Test
- GitHub Actions CI
- Backup และ Rollback Test
