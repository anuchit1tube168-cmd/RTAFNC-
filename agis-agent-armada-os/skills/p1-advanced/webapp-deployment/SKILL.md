---
name: webapp-deployment
description: >-
  Deploys web apps from GitHub to production (GitHub Pages, Netlify, or
  Lovable hosting) with rollback capability. Use whenever the user mentions
  deploy, publish, ขึ้นเว็บ, เอาขึ้นจริง, GitHub Pages, URL จริง, or when a
  built app needs to reach real users. Always trigger when code on main is
  ready for release.
---

# WebApp Deployment (ส่งของขึ้นสนามจริง)

## เป้าหมาย
จาก main branch → URL จริงที่ผู้ใช้เปิดได้ พร้อมทางถอยกลับ (rollback) ภายใน 5 นาทีเสมอ

## Workflow
1. **INSPECT** — ยืนยัน main ผ่าน checklist ของ github-repo-operating + ไม่มี secret ใน build
2. เลือกปลายทาง: static (Analyzer/SheetJS) → GitHub Pages | app มี backend → Lovable/Netlify
3. **BUILD** — deploy จาก main เท่านั้น (ไม่ deploy จาก branch งาน)
4. บันทึก "deploy record": SHA ที่ deploy + เวลา + URL ลง JobLog ก่อนประกาศ
5. **VERIFY (smoke test)** — เปิด URL จริง: หน้าโหลด + ฟังก์ชันหลัก 1 อย่างทำงาน + ทดสอบบนมือถือ
6. เว็บใช้ Apps Script backend → ทดสอบ endpoint ด้วย request จริง 1 ครั้ง
7. พังหลัง deploy → **rollback ไป SHA ก่อนหน้าใน 5 นาที** แล้วค่อย debug นอกสนาม

## กฎเหล็ก
- ห้าม deploy วันศุกร์เย็น/ก่อนงานสำคัญของวิทยาลัย ถ้าไม่มีเวลาเฝ้า
- ทุก deploy ต้องรู้ SHA ที่จะ rollback ไปก่อนกดปุ่ม
- URL production ห้ามชี้ branch ทดลอง

## Fallback
CI/hosting ล่ม → แจกไฟล์ HTML ให้ผู้ใช้เปิด local หรือย้ายขึ้น host สำรอง (Netlify drop)

## Receipt
live URL + deploy record (SHA+เวลา) + screenshot smoke test
