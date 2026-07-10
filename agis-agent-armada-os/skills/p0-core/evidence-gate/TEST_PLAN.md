# Test Plan
## Tasks (ผสม pass/blocked ให้ gate จับ)
1. งาน deploy จริง URL ใช้ได้ → ต้อง PASS
2. agent อ้าง deploy แล้วแต่ URL 404 → ต้อง BLOCKED ระบุ "ขาด live-url ที่ใช้งานได้"
3. screenshot ของรอบก่อน (state เก่า) → ต้อง BLOCKED "หลักฐานไม่สด"
4. หนังสือราชการออกจริง มีแค่ .docx ไม่มี sheet-row → ต้องขอ receipt ที่ 2
## Graders
- code: gate คืน BLOCKED เมื่อควร BLOCK ครบ 3/3, PASS เมื่อควรผ่าน 1/1
## Metrics: pass^3 (รัน 3 รอบต้องตัดสินเหมือนเดิมทุกรอบ)
