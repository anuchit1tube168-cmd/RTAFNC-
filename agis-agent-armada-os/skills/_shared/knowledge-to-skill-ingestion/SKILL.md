# Knowledge to Skill Ingestion — SKILL.md

## Purpose
ใช้เมื่อ Boss ส่งความรู้ใหม่ เช่น YouTube, โพสต์, PDF, แชทเก่า, Prompt Pack หรือบทความ เพื่ออัปเดต AGIS Agent Armada OS ให้เก่งขึ้นแบบเป็นระบบ

## Trigger
- Boss ส่ง URL YouTube / Live / Reel / Post
- Boss บอกว่า "ถอดข้อมูล", "อัปสกิล", "เอามาเข้าระบบ", "ทำให้เก่งขึ้น"
- พบ pattern ที่ใช้ซ้ำได้ในงานจริง

## Process
1. Intake Source
   - รับ URL / ข้อความ / ไฟล์
   - บันทึก source note
   - ระบุว่ามี transcript จริงหรือใช้ข้อมูลจากแชท/สรุป

2. Extract Core Pattern
   - ถอดแก่น 5-10 ข้อ
   - แยก workflow / checklist / prompt / automation / guardrail

3. Convert to Skill Package
   - สร้าง SKILL.md
   - สร้าง LLM_WIKI.md
   - สร้าง AGENT_INJECTION.md ถ้า skill กระทบหลาย agent
   - สร้าง CHECKLIST / TEST_PLAN ถ้าต้องทดสอบ

4. Inject to Crew
   - Update AGENT_SKILL_LOADOUT.md
   - ระบุ agent ที่ใช้ skill นี้
   - ระบุ level impact และ clone readiness

5. Apply to Current Project
   - route ไป Job/Mission ที่เกี่ยวข้อง
   - update Google Drive / GitHub / Lovable / Apps Script ตามบริบท

6. Receipt
   - สร้าง receipt พร้อม evidence
   - ถ้าใช้จริงสำเร็จ บันทึก Skill Mastery

## Output Contract
- Source Note
- Core Pattern
- Skill Package
- Agent Injection
- Receipt
- Next Job Application

## Guardrails
- ห้ามอ้าง transcript เต็มถ้ายังไม่ได้ดึง transcript จริง
- ห้ามเดาว่าแหล่งข้อมูลพูดอะไรถ้าไม่มีข้อมูล
- ใช้บริบทจากแชทเดิมได้ แต่ต้องบอกว่าเป็นจาก prior chat extraction
- ทุก skill ต้องมี use case จริง ไม่เก็บเป็นแฟ้มเฉย ๆ
