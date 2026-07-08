# Master Skill Training System — SKILL.md

## Purpose
Create a structured training system that upgrades Boss and AGIS Agent Armada OS from prompt-based work into professional skill-based execution.

## Trigger
Use this skill when:
- Boss sends a skill roadmap, training plan, Fable output, or skill table
- AGIS needs to convert learning into reusable Skill MD
- A project reveals missing capabilities
- A blocker should become a future skill

## Inputs
- Skill roadmap or table
- Current project context
- Current agent loadout
- Known blockers
- Evidence requirements
- Priority level P0/P1/P2

## Process
1. Read the roadmap or training input
2. Extract skill names, purpose, owner agent, and priority
3. Convert each skill into a Skill Package structure
4. Define real-world test tasks
5. Define evidence and receipt requirements
6. Assign owner agent and backup agent
7. Add to AgentSkillMap / Skill Registry
8. Test on a real job
9. Mark level-up only after evidence and receipt

## Output Contract
- MASTER_SKILL_ROADMAP.md
- P0 core skill pack
- Agent injection plan
- Checklist and test plan
- Receipt

## Guardrails
- Do not treat training advice as complete unless it becomes a file
- Do not mark skill as installed without owner agent and evidence rule
- Do not expand to P1/P2 until P0 works in real jobs
- No evidence = no level up

## Done Criteria
Skill training is complete when:
- Each P0 skill has a defined purpose, owner, test, evidence, and level-up target
- Agents know how to use it
- A receipt is created after first real use
