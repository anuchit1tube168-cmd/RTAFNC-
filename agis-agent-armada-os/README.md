# AGIS Agent Armada OS

ระบบทีม AI Agent แบบเกมทำงานจริง: Boss Command → Job Card / One Piece → MiroFish Routing → Agent Missions → Evidence → Receipt → Level Up

> ใช้ One Piece เป็น mental model เพื่อช่วยจำบทบาทเท่านั้น ระบบจริงใช้ชื่อ/ตัวละคร original และไม่ใช้ asset/โลโก้/ภาพลิขสิทธิ์

## Core Rule

ไม่มี Evidence = ยังไม่เจอ One Piece  
มี Evidence แต่ยังไม่ผ่าน QA = Review  
ผ่าน QA + Receipt = Done + XP + Level Up

## Folder Structure

```text
agis-agent-armada-os/
├─ README.md
├─ LLM_WIKI.md
├─ JOB_CARD_TEMPLATE.md
├─ AGENT_TEAM_FLOW.md
├─ MATCH_ROUTING.md
├─ project/
├─ skills/_shared/
└─ agents/
   ├─ 01_captain_orchestrator/
   ├─ 02_navigator_router/
   ├─ 03_archaeologist_knowledge/
   ├─ 04_shipwright_builder/
   ├─ 05_doctor_validator/
   ├─ 06_swordsman_guard/
   ├─ 07_cook_content/
   ├─ 08_sniper_growth/
   ├─ 09_storyteller_log/
   └─ 10_governance_helmsman/
```

## Use Every Time Boss Gives Work

1. Create Job Card
2. Define One Piece / Gold
3. Run SWOT for big-picture risk
4. Run OODA for fast decision
5. Run MiroFish for routing
6. Split into micro-phases
7. Assign agents
8. Work + validate
9. Store receipt
10. Summarize TH/EN
