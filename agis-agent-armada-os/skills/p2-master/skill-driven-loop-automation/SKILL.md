# Skill: Skill-Driven Loop Automation

Version: v1.0  
Owner: AGIS + Fable + Doctor  
Priority: P0 Upgrade Candidate / P2 Master Skill

## Mission

สร้างระบบ loop automation ที่ใช้ skill เป็นแกนหลัก โดยมี manual test, human approval, run log, receipt และ ecosystem monitor ก่อนเข้าสู่ automation จริง

## Core Formula

```text
Skill First
→ Manual Test x3
→ Guardrail
→ Run Log
→ Receipt
→ Schedule / Routine
→ Ecosystem Monitor
```

## When To Use

ใช้เมื่อ Boss ต้องการ:

- เปลี่ยนงานซ้ำให้เป็น automation
- ให้ AI รันงานเป็นรอบ ๆ
- สร้าง workflow อัตโนมัติแบบมี guardrail
- ทำ Claude/ChatGPT/GitHub/Drive loop
- ทำระบบ self-improvement ของ AGIS

## Required Output

ทุกครั้งที่สร้าง loop ต้องส่งออก:

1. Loop Card
2. Owner + Backup
3. Source/Input
4. Output
5. Risk Bucket
6. Manual Test Plan
7. Human Approval Gate
8. Run Log Template
9. Receipt Template
10. Stop Condition
11. Schedule Recommendation

## Guardrail Buckets

| Bucket | Meaning | Action |
|---|---|---|
| Auto-approve | low-risk, formatting, summaries, tagging | run automatically |
| Need sign-off | code, official docs, public posts, production data | stop and wait |
| More context needed | missing source or ambiguous goal | ask / stop |

## Production Rule

```text
No manual pass x3 = no scheduled loop
No run log = failed loop
No receipt = failed loop
No owner = failed loop
No stop condition = failed loop
```

## AGIS Agent Roles

| Agent | Responsibility |
|---|---|
| AGIS | route loop, own ecosystem monitor |
| Fable | convert loop into skill and revision plan |
| Navigator | requirement extraction and stop condition |
| Shipwright | code/build/deploy loops |
| Archaeologist | Drive/Sheet/data ingestion loops |
| Doctor | QA, risk, approval, receipt gate |
| Swordsman | SOP/policy loops |
| Cook | report/summary loops |
| Sniper | external alpha, marketing, affiliate loops |
| Clone | temporary loop execution helper |
