# เกณฑ์ตรวจต่อ type
- file: เปิด render ได้ + เนื้อหาตรง spec (ไม่ใช่ไฟล์ว่าง)
- commit-sha: SHA อยู่บน branch ที่ตกลง + diff ตรงเรื่อง
- sheet-row: ค่า cell ตรงที่คาด + timestamp ใหม่กว่าเวลาเริ่มงาน
- live-url: HTTP 200 + ฟังก์ชันหลัก 1 อย่างทำงาน (ไม่ใช่แค่หน้าเปิดได้)
- screenshot: เห็น state ที่อ้าง + มีองค์ประกอบระบุเวลา/บริบท
- test-output: ผลตรง expected ทุกจุดที่กำหนดใน TEST_PLAN
