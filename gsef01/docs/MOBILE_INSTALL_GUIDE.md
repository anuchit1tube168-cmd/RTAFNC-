# วิธีติดตั้งจากมือถือ Android แบบไม่หลงทาง

## ทางที่แนะนำที่สุด

ถ้ามีคอมพิวเตอร์ ให้ติดตั้งจากคอมพิวเตอร์ก่อน เพราะ Google Apps Script บนมือถือแก้โค้ดยาว ๆ ยากมาก

## ถ้ามีแต่มือถือ

1. เปิด Chrome ไม่ใช่ browser ใน LINE
2. เข้า https://script.google.com
3. กด New project
4. เปลี่ยนชื่อโปรเจกต์เป็น `RTAFNC GSEF01 Scholarship System`
5. เปิดไฟล์จาก ZIP ทีละไฟล์ แล้วคัดลอกโค้ดไปวาง
6. สร้างไฟล์ให้ครบ:
   - Code.gs
   - index.html
   - Styles.html
   - Client.html
   - appsscript.json
7. เลือกฟังก์ชัน `setup`
8. กด Run และอนุญาตสิทธิ์ Google Drive/Sheets
9. Deploy เป็น Web App
10. คัดลอก Web App URL ไปเปิดทดสอบ

## ถ้าดาวน์โหลด ZIP ค้าง 0.00 B

ให้เปิด Chrome > Downloads > ยกเลิกรายการเก่าทั้งหมด แล้วดาวน์โหลดใหม่ผ่าน Chrome โดยตรง ไม่ผ่าน LINE
