# Rollback Playbook
1. หยุดรับ traffic ทางประกาศ (แจ้งกลุ่มผู้ใช้ถ้าจำเป็น)
2. GitHub Pages: revert merge commit → push → รอ build (~1-2 นาที)
3. Lovable: restore version ก่อนหน้าจาก history
4. ยืนยัน URL กลับมาใช้ได้ → บันทึกเหตุการณ์ลง known-bugs.md ของ qa-debug
