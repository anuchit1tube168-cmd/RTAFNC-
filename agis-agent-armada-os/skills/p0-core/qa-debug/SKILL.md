---
name: qa-debug
description: >-
  Systematic debugging: read first, reproduce, isolate the root cause, fix
  one part at a time, then regression-test. Use whenever anything breaks —
  error messages, bug, พัง, ใช้ไม่ได้, ค่าไม่ตรง, script ล่ม, LIFF เปิดไม่ขึ้น —
  or whenever a fix is proposed without a confirmed root cause. Always
  trigger before rewriting any code that "doesn't work".
---

# QA Debug (อ่านก่อน-หาเหตุ-ซ่อมทีละส่วน)

## เป้าหมาย
ไม่แก้อาการ แก้ที่เหตุ — และพิสูจน์ว่าแก้แล้วด้วย test ไม่ใช่ความรู้สึก

## Debug Loop
1. **READ** — อ่าน error/log/พฤติกรรมจริงทั้งหมดก่อน ห้ามเดาแล้วแก้ทันที
2. **REPRODUCE** — ทำให้ bug เกิดซ้ำได้ด้วยขั้นตอนชัดเจน (reproduce ไม่ได้ = ยังไม่เริ่มแก้)
3. **ISOLATE** — บีบขอบเขต: ตัด input เหลือน้อยสุดที่ยังพัง / binary search ตำแหน่ง
4. **ROOT CAUSE** — ตอบให้ได้ว่า "ทำไม" ไม่ใช่แค่ "ตรงไหน" (ถาม why ต่อจนถึงเหตุแท้)
5. **FIX ONE PART** — แก้จุดเดียว commit เดียว ห้ามรื้อหลายจุดพร้อมกัน
6. **REGRESSION** — รัน test เดิมทั้งชุด: bug หาย + ของเดิมไม่พังเพิ่ม
7. **RECORD** — บันทึก root-cause note ลง references/known-bugs.md กันเกิดซ้ำ

## กฎเหล็ก
- ห้ามแก้เกิน 1 สมมติฐานต่อรอบ
- แก้ 2 รอบแล้วไม่หาย → หยุด ยกระดับเข้า failure-debugging (P2) หรือ gap-audit
- ทุก fix ต้องมี test ที่ fail ก่อนแก้ และ pass หลังแก้

## Fallback
เครื่องมือ debug ไม่มี → ใส่ log มือทีละจุด + ตาราง "ทำอะไร→คาดอะไร→เกิดอะไร"

## Receipt
before/after evidence + test output + root-cause note
