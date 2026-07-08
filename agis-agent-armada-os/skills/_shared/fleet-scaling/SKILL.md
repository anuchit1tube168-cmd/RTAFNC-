# Fleet Scaling — SKILL.md

## Purpose
ใช้เมื่อ AGIS Agent Armada ทำงานต่อไม่ได้หรือกองเรือโตจนต้องเพิ่มลูกเรือ ผู้เชี่ยวชาญ หรือแก้ Skill MD

## Inputs
- jobId
- missionId
- blocker summary
- attempted fixes
- current agent
- missing skill/tool/data
- risk level

## Process
1. Identify blocker type
2. Check existing Skill MD / LLM_WIKI
3. Try hat switch or clone if enough
4. If not enough, create Recruit Card
5. Select scale level: Specialist / Warlord / Emperor
6. Define authority limit and output contract
7. Get Captain/Jin/Boss approval if needed
8. Expert works with evidence
9. Doctor validates
10. Merge lesson learned into SKILL.md / LLM_WIKI

## Output
- blocker report
- recruit card
- expert assignment
- revised skill md if needed
- receipt
- updated routing rule

## Guardrails
- Do not recruit expert to bypass evidence
- Do not allow expert to exceed approval gate
- Do not keep expert active after blocker resolved unless promoted into permanent crew
- Every expert contribution must return knowledge to the system
