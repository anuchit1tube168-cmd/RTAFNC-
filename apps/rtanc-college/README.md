# เว็บไซต์วิทยาลัยพยาบาลทหารอากาศ v4.1

ชุดนี้ออกแบบให้ใช้งานร่วมกัน 3 ระบบ:

1. GitHub Pages สำหรับเปิดใช้งานเว็บไซต์จริง
2. Canva Website สำหรับทำ mockup และแก้ดีไซน์
3. Google Apps Script + Google Sheet สำหรับรับข้อมูลจากฟอร์ม

## URL แนะนำ

- หน้าเว็บจริง: `https://anuchit1tube168-cmd.github.io/RTAFNC-/apps/rtanc-college/`
- โฟลเดอร์หลัก: `apps/rtanc-college/`

## โครงสร้าง

```text
apps/rtanc-college/
  index.html
  README.md
  SKILL.md
  google-apps-script/Code.gs
```

## วิธีใช้งาน

1. เปิดหน้าเว็บจาก GitHub Pages
2. กดปุ่มผู้ดูแล หรือกด Alt + A
3. เพิ่มข่าว รับสมัคร หรืออ่านข้อความ
4. ตั้งค่า Google Apps Script Web App URL ในหน้า Admin > Settings
5. Export JSON/CSV เพื่อสำรองข้อมูล

## Canva

นำ URL หน้าเว็บไป Import เข้า Canva เป็น Website Design ชื่อ `วิทยาลัยพยาบาลทหารอากาศ Website v4.1`

## ความปลอดภัย

- ห้ามใส่ API key ในหน้าเว็บ
- ข้อมูลนักเรียนจริงต้องมีระบบ Login และกำหนดสิทธิ์
- ก่อนใช้งานข้อมูลจริงควรเชื่อม Google Apps Script/Sheet หรือ Backend ที่มีสิทธิ์เข้าถึงตามบทบาท
