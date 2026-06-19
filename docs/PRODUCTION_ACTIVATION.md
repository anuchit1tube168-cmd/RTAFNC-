# Production Activation Checklist

ระบบยังคงอยู่ Demo Mode จนกว่าจะผ่านรายการต่อไปนี้ครบ

## 1. Supabase

- สร้าง Project จริง
- รัน Migration 0001, 0002 และ 0003 ตามลำดับ
- ตรวจ RLS ทุกตารางข้อมูลส่วนบุคคล
- ตรวจว่า Private Buckets ไม่เปิด Public
- Deploy Edge Function `line-auth`
- ตั้ง Function Secrets ฝั่ง Supabase

## 2. LINE

- สร้าง LINE Login Channel
- สร้าง LIFF App
- ตั้ง Endpoint เป็น HTTPS URL `/liff/`
- ตั้ง Channel ID ใน Function Secrets
- ทดสอบเปิดจาก Rich Menu
- ทดสอบ Login และกลับหน้าเดิม

## 3. Member Linking

- นำเข้าทะเบียนนักเรียน
- สร้าง Activation Code แบบใช้ครั้งเดียว
- ทดสอบหนึ่ง LINE ต่อหนึ่งนักเรียน
- ทดสอบถอนการเชื่อมและผูกใหม่โดยเจ้าหน้าที่
- ปิดสิทธิ์สมาชิก inactive หรือ suspended

## 4. Good Deeds

- ส่งครบทั้ง 8 หัวข้อ
- ตรวจช่วงชั่วโมง 0.5–24
- อัปโหลดรูปและ PDF
- เจ้าหน้าที่อนุมัติ ส่งกลับ และไม่อนุมัติ
- ชั่วโมงรวมใช้ approved hours เท่านั้น
- แจ้งผลกลับนักเรียน

## 5. Hospital

- แยกตารางและ Bucket จากความดี
- นักเรียนเห็นเฉพาะข้อมูลตนเอง
- ผู้ตรวจความดีเปิดข้อมูลสุขภาพไม่ได้
- Medical Role เปิดข้อมูลตาม Scope ได้
- Staff access สร้าง Audit Log
- ข้อความแจ้งเตือนไม่เปิดเผยข้อมูลอ่อนไหว

## 6. Deployment

- ใช้ HTTPS Domain จริง
- ตั้ง Reverse Proxy และ TLS
- ตั้ง `.env` บน Private Server
- รัน `docker compose up --build -d`
- ตรวจ `/healthz`, `/liff/` และ `/admin/`
- เตรียม Rollback Image

## 7. Release Gate

- GitHub Actions ผ่าน
- Security QA ไม่มี Critical หรือ High Issue
- ทดสอบ Android และ iOS
- ทดสอบเครือข่ายช้าและ Offline
- สำรองฐานข้อมูลก่อนเปิดจริง
- เปลี่ยน `DEMO_MODE=false` หลังผ่านครบเท่านั้น
