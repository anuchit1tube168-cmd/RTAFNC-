# SKILL: วิทยาลัยพยาบาลทหารอากาศ Website v4.1

## เป้าหมาย
สร้างเว็บไซต์สถานศึกษาและระบบหลังบ้านสำหรับ **วิทยาลัยพยาบาลทหารอากาศ** ให้พร้อมใช้งานกับ GitHub Pages, Canva Website และ Google Apps Script + Google Sheet

## Brand
- ชื่อไทย: วิทยาลัยพยาบาลทหารอากาศ
- ชื่ออังกฤษ: Royal Thai Air Force Nursing College
- หน่วยงาน: กรมแพทย์ทหารอากาศ
- สีหลัก: Navy `#071B46`, Blue `#1265E8`, Gold `#F4B41B`, White
- Style: Military medical SaaS, modern, clean, responsive

## Pages
1. หน้าแรก
2. เกี่ยวกับวิทยาลัย
3. ข่าวประชาสัมพันธ์
4. กลุ่มงาน/ฝ่าย
5. บริการออนไลน์
6. นักเรียน/ผู้ปกครอง
7. ติดต่อเรา
8. Admin Dashboard

## Functions
- Responsive web app
- News management
- Admissions / interested applicants
- Contact form inbox
- LocalStorage draft database
- Export JSON backup
- Export CSV
- Print page
- Google Apps Script endpoint setting

## Canva Workflow
1. Deploy to GitHub Pages
2. Copy URL
3. Import URL into Canva Website
4. Use Canva for visual mockup and presentation only
5. Use GitHub Pages + Apps Script for real data capture

## GitHub Workflow
- App path: `apps/rtanc-college/index.html`
- Backend: `apps/rtanc-college/google-apps-script/Code.gs`
- Root launcher should link to `./apps/rtanc-college/`

## Safety
- Do not put secret tokens in frontend
- Do not store real sensitive student/health data in LocalStorage
- Add authentication and role permission before production with real personal data
