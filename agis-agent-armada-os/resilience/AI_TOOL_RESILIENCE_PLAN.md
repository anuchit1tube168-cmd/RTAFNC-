# AI Tool Resilience Plan

Path: `agis-agent-armada-os/resilience/AI_TOOL_RESILIENCE_PLAN.md`  
Owner: AGIS + Doctor  
Version: v1.0

## Purpose

ทำให้ AGIS ไม่ผูกกับเครื่องมือเดียว และเก็บความรู้เป็นไฟล์ที่ย้ายไปใช้ต่อได้

## Core Rule

ห้ามให้ระบบพึ่งเครื่องมือเดียวจนหยุดทำงานไม่ได้ ต้องมี fallback เสมอ

## Durable Formats

- SKILL.md
- LLM_WIKI.md
- CHECKLIST.md
- TEST_PLAN.md
- EXAMPLES.md
- AGENT_INJECTION.md
- SOP.md
- Receipt
- Local export zip/pdf/md

## Storage Layers

1. GitHub = source of truth สำหรับ skill/code/workflow
2. Google Drive = working knowledge และเอกสารองค์กร
3. Google Sheet = job state / skill map / receipt index
4. Local export = backup สำคัญเป็น zip/pdf/md

## Resilience Chain

```text
High reasoning AI → Other reasoning AI
Agent workflow → Manual checklist
Lovable UI → Static HTML prototype
Apps Script → Manual Google Sheet operation
GitHub automation → Direct repo file edit
Google Drive working docs → Local export zip/pdf/md
```

## Fallback Matrix

| Primary | Fallback 1 | Fallback 2 | Receipt |
|---|---|---|---|
| High reasoning AI | Other reasoning AI | Manual checklist | reasoning route note |
| Agent workflow | Manual checklist | Single owner execution | job card |
| Lovable UI | Static HTML prototype | Canva/Figma mock | screenshot + HTML |
| Apps Script | Manual Google Sheet operation | CSV import/export | sheet log |
| GitHub automation | Direct repo file edit | local zip backup | commit hash |
| Google Drive docs | Local export zip/pdf/md | GitHub markdown copy | file hash/path |

## When To Trigger

- เครื่องมือล่ม
- AI ตอบสับสน
- deploy ไม่ผ่าน
- ไฟล์หายหรือเปิดไม่ได้
- งานแก้ไม่ได้หลัง 2 รอบ
- Project เสี่ยงสูงหรือมีมูลค่าสูง

## Minimum Backup Package

- `/skills` exported as zip
- `/projects` important docs exported as pdf/md
- Google Sheet state DB exported as xlsx/csv
- Receipt index exported as csv
- GitHub release tag

## 2-Round Rule

ถ้าลองแก้ 2 รอบแล้วยังไม่ผ่าน:

1. หยุดแก้แบบเดาสุ่ม
2. เปิด `skills/_shared/system-skill-gap-audit/SKILL.md`
3. ระบุ blocker จริง
4. เลือก fallback
5. เก็บ postmortem เป็น receipt

## Required Practice

- ทุก project ต้องมี README / SKILL.md / TEST_PLAN ก่อนโต
- ทุก skill ต้องมีเจ้าของ agent และ backup agent
- ทุกงานสำเร็จต้องมี receipt
- ทุก blocker ต้องกลายเป็น skill improvement
