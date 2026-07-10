# Test Plan
## Tasks
1. Deploy RTAFNC Evaluation Analyzer ขึ้น GitHub Pages + smoke test มือถือ
2. Deploy dashboard Lovable เวอร์ชันใหม่ + บันทึก deploy record
3. ซ้อม rollback: revert ไป SHA ก่อนหน้า จับเวลา <= 5 นาที
## Graders
- state_check: URL 200 + ฟังก์ชันหลักทำงาน
- code: JobLog มี deploy record ครบ SHA+เวลา+URL
## เกณฑ์ผ่าน: 3/3 + rollback <= 5 นาที
