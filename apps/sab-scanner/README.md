# SAB Scanner integration for RTAFNC

สถานะปัจจุบัน: หน้านี้เป็น launcher ไปยังระบบต้นฉบับที่เผยแพร่บน GitHub Pages

## URL บน GitHub Pages ของ RTAFNC

`https://anuchit1tube168-cmd.github.io/RTAFNC-/apps/sab-scanner/`

## สถาปัตยกรรมของระบบต้นฉบับ

- Frontend: GitHub Pages
- Scanner: กล้องเว็บผ่าน HTTPS
- Backend: Google Apps Script Web App (`/exec`)
- Database: Google Sheets
- Authentication: token และสิทธิ์ผู้ใช้งานตรวจโดย backend

## สิ่งที่ต้องมีเพื่อทำระบบของ วพอ. แยกเอง

1. Google Sheet สำหรับข้อมูลนักเรียน ห้องเรียน และเวลาเข้าแถว
2. Google Apps Script API ของหน่วยงาน
3. URL Web App ลงท้าย `/exec`
4. Frontend ที่ตั้งค่าให้เรียก API ของหน่วยงาน
5. บัญชีผู้ดูแลและการกำหนดสิทธิ์
6. การทดสอบกล้องบน HTTPS และมือถือจริง

หมายเหตุ: โครงการต้นฉบับไม่พบไฟล์ LICENSE ใน repository จึงยังไม่คัดลอกซอร์สโค้ดเข้ามาโดยตรง หน้านี้ให้เครดิตและเชื่อมไปยังระบบต้นฉบับเท่านั้น
