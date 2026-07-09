# AGIS_CREW_DASHBOARD_UI_SPEC — Design v1

## Purpose
กำหนดหน้าระบบ AGIS Crew Dashboard ให้เป็นหน้าเว็บแอปใช้งานจริง โดยอ้างอิงแนวทางจากภาพต้นแบบที่ Boss ส่งมา: crew cards + dashboard command center + pirate/adventure agent roles

## Design Decision
ล็อกแนวทางเป็น:

`Professional SaaS Dashboard + Adventure Crew Command Center`

ไม่ใช่แค่ภาพสวย แต่ต้องเป็น UI ที่ผูกกับ State DB / Missions / Receipts / Skills ได้จริง

## Target Screen
Desktop-first responsive web app

- Layout: 16:9 dashboard
- Theme: dark navy, gold, deep teal, parchment accent
- Mood: premium, intelligent, command center, fantasy crew, trustworthy
- Style: card-based SaaS dashboard with character agent system

## Core Layout

```text
AGIS Crew Dashboard
├─ Left Sidebar
│  ├─ Dashboard
│  ├─ Crew Deck
│  ├─ Missions
│  ├─ Reactions
│  ├─ Skills
│  ├─ Receipts
│  └─ Settings
│
├─ Top KPI Bar
│  ├─ Active Crew
│  ├─ Missions Routed
│  ├─ Receipts
│  └─ Alerts
│
├─ Main Crew Deck
│  └─ 10 Agent Cards
│
├─ Right Agent Detail
│  └─ selected agent profile, skills, XP, status
│
├─ Mission Command
│  └─ Boss command input + route button
│
├─ Reaction Feed
│  └─ live agent status/replies
│
├─ Process Pipeline
│  └─ Requirement → Routing → Build → QA → Evidence
│
├─ Active Missions Table
│  └─ job/missions/progress/status/ETA
│
└─ Bottom Widgets
   ├─ State DB
   └─ Skill Map
```

## Agent Character Mapping

| UI Character | Backend Agent | Main Function | Status States |
|---|---|---|---|
| Fable | Fable Master | Master Skill Architect / Escalation Brain | idle, consulting, auditing, solving |
| AGIS | Captain AGIS | Captain / Orchestrator / Decision Gate | focused, routing, approving, alert |
| Navigator | Navi Map | Routing / Mission Split | charting, routing, rerouting, done |
| Archaeologist | Archive Eye | Knowledge / Research / Drive Index | reading, extracting, indexing, source-checking |
| Shipwright | Forge Dev | Builder / GitHub / Apps Script / Lovable | building, deploying, fixing, blocked |
| Doctor | Bug Doctor | QA / Debug / Test | diagnosing, testing, failed, pass |
| Swordsman | Jin Guard | Risk / Compliance / Guardrail | guarding, warning, blocking, approved |
| Cook | Copy Chef | Docs / Reports / Graphic / Content | writing, designing, cooking, done |
| Sniper | Hook Sniper | Marketing / Hook / Growth | targeting, campaign, analyzing, ready |
| Clone | Clone Protocol | Scale / Backup / Extra Agent | standby, cloning, active, merge-back |

## Important Role Rule
- Fable is not a normal worker. Fable is called for hard projects, skill gap audit, recovery, and master-level reasoning.
- Clone is not a permanent crew member. Clone appears when workload is high or a specialized copy is needed.

## Process Pipeline
1. Requirement Extraction
2. Agent Routing
3. Build / Process
4. QA Debug
5. Evidence / Receipt

## UI Data Sources

### State DB Tabs
- Jobs
- Missions
- Agents
- Skills
- AgentSkillMap
- Receipts
- Config

### API Actions Needed
- `dashboard.state`
- `job.create`
- `job.route`
- `mission.update`
- `receipt.create`
- `agent.status`
- `skill.map`
- `reaction.feed`

## Character Movement Phase

### Phase 1 — Static Cards + CSS Reaction
Use character cards with status chips:
- idle
- thinking
- working
- warning
- done
- level up

### Phase 2 — Interactive Crew Deck
Use animated movement on the deck:
- Boss command → Navigator moves to AGIS
- AGIS routes mission → Shipwright starts build
- Bug detected → Doctor moves to QA station
- Risk detected → Swordsman blocks workflow
- Evidence ready → Cook/Brook creates receipt
- High workload → Clone appears

### Phase 3 — Game-like Deck Engine
Use PixiJS or Phaser for movement:
- map coordinates
- station zones
- walking paths
- speech bubbles
- state-driven animation

## UX Rules
- One primary action: Route Mission
- Boss command input must be visible at all times
- Agent status must be clear without reading long text
- Receipts must always be accessible
- Risk/alert must be visible before deploy
- No mission can be Done without evidence

## Visual Components

### Agent Card
Required fields:
- portrait
- name
- role
- mood/status
- workload bar
- online dot
- selected state

### Agent Detail
Required fields:
- large portrait
- role
- level / XP
- current mission
- core skills
- workload
- view full profile

### Mission Command
Required fields:
- command textarea
- mode selector
- route mission button
- quick tags: Code Build, Data Analysis, Research, Report, QA Test

### Reaction Feed
Required fields:
- timestamp
- agent name
- reaction text
- status icon

### Active Missions
Required fields:
- mission ID
- title
- type
- owner
- assigned agents
- progress
- status
- ETA

## Definition of Done
This UI spec is ready when:
- agent mapping is locked
- data sources are identified
- dashboard layout is defined
- movement phases are defined
- Lovable prompt exists
- State DB records the UI spec receipt

## Next Action
Build the Lovable Command Center prompt and connect it after Processor Web App URL is available.
