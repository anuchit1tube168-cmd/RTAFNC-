# Test Plan
## Tasks (bug จริงที่เคยเจอ)
1. รายงาน OBE แจ้ง CLO fail ทั้งที่คะแนนผ่าน → ต้อง isolate ถึง data corruption ตอน merge
2. Apps Script timeout กลางงานประเมิน → root cause: loop ทีละ cell → fix เป็น batch
3. LIFF เปิดนอก LINE แล้วขาว → root cause: ไม่เช็ค liff.init fail → เพิ่ม fallback หน้าเตือน
## Graders
- state_check: bug หาย + regression suite ผ่าน
- llm_rubric: root-cause note ตอบ "ทำไม" ไม่ใช่แค่ "ตรงไหน"
## เกณฑ์ผ่าน: 3/3 + known-bugs.md ครบ 3 แถว
