# Skill: Database Bootstrap

## หน้าที่
สร้างและตรวจ Supabase Staging Database ตามลำดับที่ถูกต้องก่อนเชื่อม LINE LIFF และข้อมูลจริง

## Inputs
- Supabase Staging Project
- Migration files 0001–0003
- Optional staging seed
- Verification queries

## ขั้นตอน
1. ตรวจว่า Project เป็น Staging
2. รัน 0001_core_schema.sql
3. รัน 0002_line_member_auth.sql
4. รัน 0003_staff_roles_and_policies.sql
5. รัน seed.sql เฉพาะ Staging
6. รัน verify.sql
7. ตรวจตาราง RLS Policies และ Storage Buckets
8. บันทึกผลการตรวจ
9. ส่ง Project URL และ Publishable Key ไปยัง Deployment Skill

## Guardrails
- ห้ามใช้ข้อมูลนักเรียนจริงใน Seed
- ห้ามรัน seed.sql ใน Production
- ห้ามสร้างตารางซ้ำจาก Lovable
- ห้ามปิด RLS เพื่อแก้ปัญหาชั่วคราว
- ห้ามใส่ service-role key ใน Frontend

## Done Criteria
- ตารางหลักครบ
- หมวดความดี 8 หัวข้อครบ
- RLS เปิดทุกตารางข้อมูลส่วนบุคคล
- Private Buckets ปิด Public
- Demo Student และ Demo Transactions แสดงใน Staging
- verify.sql ผ่านตาม Expected Results
