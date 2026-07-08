# AI_TOOL_RESILIENCE_PLAN

## Purpose
ทำให้ AGIS ไม่ผูกกับเครื่องมือเดียว และเก็บความรู้เป็นไฟล์ที่ย้ายไปใช้ต่อได้

## Core Rule
ทุกความรู้สำคัญต้องออกจากแชทมาเป็นไฟล์ถาวร

## Durable Formats
- SKILL.md
- LLM_WIKI.md
- CHECKLIST.md
- TEST_PLAN.md
- SOP.md
- Receipt

## Storage Layers
1. GitHub = source of truth สำหรับ skill/code/workflow
2. Google Drive = working knowledge และเอกสารองค์กร
3. Google Sheet = job state / skill map / receipt index
4. Local export = backup สำคัญเป็น zip/pdf/md

## Fallback Levels
| Level | Primary | Fallback |
|---|---|---|
| L1 | High reasoning AI | Other reasoning AI |
| L2 | Agent workflow | Manual checklist |
| L3 | Lovable UI | Static HTML prototype |
| L4 | Apps Script | Manual Google Sheet operation |
| L5 | GitHub automation | Direct repo file edit |

## Required Practice
- ทุก project ต้องมี README / SKILL.md / TEST_PLAN ก่อนโต
- ทุก skill ต้องมีเจ้าของ agent และ backup agent
- ทุกงานสำเร็จต้องมี receipt
- ทุก blocker ต้องกลายเป็น skill improvement

## Goal
แม้เครื่องมือใดเปลี่ยน เงื่อนไขเปลี่ยน หรือราคาสูงขึ้น ระบบยังทำงานต่อได้ด้วย skill package และ SOP ที่เก็บไว้แล้ว
