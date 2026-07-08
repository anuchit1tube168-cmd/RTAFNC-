# System Skill Gap Audit — SKILL.md

## Purpose
ใช้เมื่อต้องการให้ผู้เชี่ยวชาญหรือโมเดล reasoning สูงช่วยตรวจช่องว่างของ AGIS และเสนอ Skill MD ที่ควรสร้างในอนาคต

## Trigger
- งานแก้ไม่ได้หลังลอง 2 รอบ
- Boss รู้สึกว่าสับสนหรือไม่แน่ใจว่าจะฝึกอะไรต่อ
- ระบบเริ่มพึ่งเครื่องมือใดเครื่องมือหนึ่งมากเกินไป
- Project มีมูลค่าสูงหรือเสี่ยงสูง

## Inputs
- project goal
- current files/repo/drive links
- known blockers
- attempted fixes
- current agent loadout
- current skills
- constraints: budget, time, tools, privacy

## Process
1. Collect current context
2. List recurring blockers
3. Map blockers to missing skills
4. Prioritize skills P0/P1/P2
5. Assign owner agent and backup agent
6. Define test job for each skill
7. Define evidence and receipt requirement
8. Create SKILL.md / LLM_WIKI / CHECKLIST / TEST_PLAN
9. Inject skill into AgentSkillMap
10. Review after first real use

## Output
- gap audit table
- skill roadmap
- new skill package draft
- agent injection plan
- receipt

## Guardrails
- Do not keep advice as chat-only
- Do not depend on one tool only
- Do not mark skill complete without a test job
- Do not store secrets in prompts or docs
