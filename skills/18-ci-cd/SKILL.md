# Skill: CI/CD and Release Automation

## หน้าที่
ตรวจสอบคุณภาพโค้ด สร้าง Container ทดสอบเส้นทางหลัก และเตรียม Release ก่อนนำขึ้น Private Server

## Pipeline
1. Checkout โค้ดจาก Branch
2. ตรวจ JavaScript และ Python syntax
3. ตรวจไฟล์สำคัญของ LIFF, Admin, Supabase และ Skills
4. ตรวจหารูปแบบ Secret ที่ไม่ควรถูก Commit
5. Build Docker image
6. เปิด Container ชั่วคราว
7. Smoke test Portal, LIFF, Admin และ Health Check
8. รายงานผลผ่าน GitHub Actions

## Release Rules
- Pull Request ต้องผ่าน CI ก่อน Merge
- Production Deploy ใช้ Commit SHA ที่ผ่าน CI เท่านั้น
- ค่าการเชื่อมต่อจริงถูกฉีดตอน Runtime
- ห้าม Build Secret เข้า Docker image
- ต้องมี Rollback ไปยัง image tag ก่อนหน้า

## Environments
- Preview: Demo Mode และข้อมูล Browser
- Staging: Supabase ทดสอบและ LIFF ทดสอบ
- Production: Supabase จริง, LIFF จริง และ HTTPS Domain จริง

## Done Criteria
- JavaScript syntax ผ่าน
- Docker build ผ่าน
- Health Check ตอบ 200
- หน้า Portal, LIFF และ Admin เปิดได้
- Secret scan ไม่พบค่าต้องสงสัย
