# RTAFNC Skill Control Center

โฟลเดอร์นี้เป็นศูนย์ควบคุมสกิลแบบแยกหน้าที่ แต่ทำงานร่วมกันผ่าน Control Plane เดียว

## ลำดับการทำงานหลัก

1. `00-control-plane` รับคำขอและกำหนดเส้นทาง
2. `01-liff-shell` เปิดหน้าใน LINE และตรวจสภาพแวดล้อม
3. `02-line-identity` ตรวจข้อมูลยืนยันจาก LINE ฝั่ง Server
4. `03-member-linking` ผูกบัญชี LINE กับทะเบียนนักเรียน
5. `04-supabase-session-rls` จัด Session และสิทธิ์ระดับแถว
6. `05-good-deeds` จัดการความดี 8 หัวข้อ
7. `06-hospital` จัดการข้อมูลไปโรงพยาบาลแยกสิทธิ์
8. `07-private-storage` จัดเก็บรูปและ PDF แบบ Private
9. `08-notification-hub` ส่ง LINE, Telegram และ In-app
10. `09-admin-review` ตรวจ อนุมัติ ส่งกลับ และ Audit
11. `10-report-export` สร้าง Google Sheet และ PDF
12. `11-deployment` Deploy ไป Private Server และตั้ง LIFF Endpoint
13. `12-security-qa` ทดสอบสิทธิ์ ความปลอดภัย และ Regression
14. `13-incident-response` รับมือเหตุผิดปกติ
15. `14-student-registry` จัดการทะเบียนและนำเข้าข้อมูลนักเรียน
16. `15-news-activities` จัดการข่าว กิจกรรม และการลงทะเบียน
17. `16-backup-recovery` สำรองและกู้คืนระบบ
18. `17-observability` ติดตามสุขภาพระบบและแจ้งเตือนความผิดปกติ

## เอกสารรวมศูนย์

- `CONTROL_MATRIX.md` แสดงระดับการปฏิบัติ Dependency และ Release Gate
- แต่ละโฟลเดอร์มี `SKILL.md` ของตนเอง

## กฎรวมศูนย์

- แต่ละสกิลแก้เฉพาะขอบเขตของตน
- ห้ามข้าม RLS หรืออ่านข้อมูลสุขภาพโดยไม่มี Role
- ค่าการเชื่อมต่อที่มีความสำคัญอยู่ฝั่ง Server เท่านั้น
- ทุกการเปลี่ยนสถานะสำคัญสร้าง Audit Log
- Production ต้องผ่าน Security QA ก่อนเปลี่ยน `demoMode` เป็น `false`
