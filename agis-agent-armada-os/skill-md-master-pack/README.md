# AGIS Skill MD Master Pack

Version: v1.0  
Date: 2026-07-09  
Owner: Boss Agis

## Mission

ติดตั้งระบบ Skill MD สำหรับฝึก Boss Agis และ AI Agent Team ให้ทำงานแบบ Master Operator

Doctrine:

```text
อ่านก่อน → คิดก่อน → แก้ทีละส่วน → ตรวจสอบเสมอ → เก็บ Receipt → อัปเดต Skill
```

## Core Architecture

- **Fable** = อาจารย์ฝึก / Skill Architect / Master Trainer
- **AGIS** = สมองกลาง / กองเรือ / Router / State DB Controller
- **GitHub** = source of truth สำหรับ skill/code/workflow
- **Google Drive** = working knowledge และเอกสารองค์กร
- **Google Sheet** = job state / skill map / receipt index
- **Receipt** = หลักฐานว่าใช้ได้จริง
- **Local Export** = backup สำคัญเป็น zip/pdf/md

## Folder Standard

```text
skill-name/
├─ SKILL.md
├─ LLM_WIKI.md
├─ CHECKLIST.md
├─ TEST_PLAN.md
├─ EXAMPLES.md
└─ AGENT_INJECTION.md
```

## Files Installed In This Project

- `AGIS_SKILL_MD_MASTER_ROADMAP.md`
- `resilience/AI_TOOL_RESILIENCE_PLAN.md`
- `state-db/AGIS_STATE_DB_SCHEMA.md`
- `receipts/REC-SKILL-MASTER-PACK-V1.md`
- `skills/_shared/system-skill-gap-audit/SKILL.md`

## Priority

1. ติดตั้ง P0 Core Skills ก่อน
2. ใช้ Google Sheet เป็น AgentSkillMap / JobState / ReceiptIndex / SkillRegistry
3. ทุกงานต้องมี Receipt ก่อนนับว่าผ่าน
4. ถ้าแก้ไม่ได้หลังลอง 2 รอบ ให้เปิด `system-skill-gap-audit`

## Next Test

Run Test 1:

```text
Boss Command → Requirement Extraction → Agent Routing → Job Card → Evidence Rule → Receipt
```
