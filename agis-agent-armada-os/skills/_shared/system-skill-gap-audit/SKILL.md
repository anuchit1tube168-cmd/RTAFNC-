# System Skill Gap Audit Skill

Skill ID: `system-skill-gap-audit`  
Owner: Fable + AGIS  
Priority: P0 Shared  
Trigger: งานแก้ไม่ได้หลังลอง 2 รอบ / Boss สับสน / ระบบพึ่งเครื่องมือเดียว / Project เสี่ยงสูง

## Mission

ตรวจว่าระบบขาด skill อะไร แล้วสร้างหรืออัปเดต Skill MD ให้ตรงกับ blocker จริง

## Trigger Conditions

- งานแก้ไม่ได้หลังลอง 2 รอบ
- Boss Agis รู้สึกว่าสับสนหรือไม่แน่ใจว่าจะฝึกอะไรต่อ
- ระบบเริ่มพึ่งเครื่องมือใดเครื่องมือหนึ่งมากเกินไป
- Project มีมูลค่าสูงหรือเสี่ยงสูง

## Inputs

- Project goal
- Current files / repo / Drive links
- Known blockers
- Attempted fixes
- Current agent loadout
- Current skills
- Constraints: budget, time, tools, privacy, official risk

## Audit Flow

```text
Collect current context
→ List recurring blockers
→ Map blockers to missing skills
→ Prioritize skills P0/P1/P2
→ Assign owner agent + backup agent
→ Define test job
→ Define evidence/receipt
→ Create SKILL.md / LLM_WIKI / CHECKLIST / TEST_PLAN
→ Inject into AgentSkillMap
→ Review after first real use
```

## Required Output

- Skill Gap Report
- Missing Skill List
- Priority P0/P1/P2
- Owner Agent + Backup Agent
- Test Job
- Evidence Required
- New or Revised Skill MD
- Agent injection plan
- Receipt

## Decision Rule

ถ้าระบบเริ่มมั่ว ให้หยุดสร้าง output ใหม่ แล้ว audit skill gap ก่อน

## Guardrails

- Do not keep advice as chat-only
- Do not depend on one tool only
- Do not mark skill complete without a test job
- Do not store secrets in prompts or docs
- Do not claim completion without receipt

## Receipt Requirement

ทุกครั้งที่ skill นี้ถูกเรียกใช้ ต้องสร้าง receipt ที่บอกว่า:

```text
Receipt ID:
Mission ID:
Blocked By:
Missing Skill:
Owner Agent:
Backup Agent:
Action Taken:
Next Test:
Evidence:
```
