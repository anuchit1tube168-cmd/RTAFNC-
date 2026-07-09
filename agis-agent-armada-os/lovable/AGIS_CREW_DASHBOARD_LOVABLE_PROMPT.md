# AGIS_CREW_DASHBOARD_LOVABLE_PROMPT

## Goal
Build a professional AGIS Crew Dashboard web app based on the approved Design v1 direction: a premium SaaS dashboard combined with an adventure crew command-center system.

## App Name
AGIS Crew Dashboard

## Product Context
AGIS is an AI Agent Armada OS. The dashboard lets the user command an AI crew, route missions, monitor progress, view receipts, and manage skills.

## Visual Direction
Use a dark navy and gold premium command-center theme with parchment accents and subtle nautical/adventure details. It should feel professional enough for real work, not a toy, but still visually memorable through agent character cards.

## Required Pages / Sections

### 1. Sidebar
Navigation items:
- Dashboard
- Crew Deck
- Missions
- Reactions
- Skills
- Receipts
- Settings

### 2. Top KPI Bar
Cards:
- Active Crew
- Missions Routed
- Receipts
- Alerts

### 3. Crew Deck
Show 10 agent cards:
- Fable — Master Skill Architect
- AGIS — Captain / Orchestrator
- Navigator — Routing Agent
- Archaeologist — Knowledge Agent
- Shipwright — Builder / Dev Agent
- Doctor — QA Debug Agent
- Swordsman — Risk / Compliance Guard
- Cook — Content / Graphic / Docs Agent
- Sniper — Marketing / Growth Agent
- Clone — Scale / Backup Agent

Each card must include:
- character placeholder image
- role
- status mood
- workload bar
- online dot
- selected state

### 4. Agent Detail Panel
When clicking an agent card, show:
- large portrait
- name
- role
- status
- level / XP
- core skills
- current mission
- workload
- view full profile button

### 5. Mission Command Panel
Include:
- command textarea: “Describe the task or objective…”
- quick task tags: Code Build, Data Analysis, Research, Report, QA Test
- routing mode dropdown: Auto Recommended / Manual / Fable Escalation
- Route Mission button

### 6. Reaction Feed
Show live-style agent messages:
- Navigator: Charting optimal route
- Shipwright: Preparing framework and tools
- Doctor: Running diagnostics
- Swordsman: Checking risk
- Cook: Preparing docs and visuals
- Clone: Standing by for execution

### 7. Process Pipeline
Horizontal flow:
Requirement Extraction → Agent Routing → Build / Process → QA Debug → Evidence / Receipt

### 8. Active Missions Table
Columns:
- ID
- Mission
- Type
- Owner / Lead
- Agents
- Progress
- Status
- ETA

### 9. State DB Widget
Show:
- Total states
- Active states
- Memory usage
- DB health
- Explore State DB button

### 10. Skill Map Widget
Use radar chart or skill matrix placeholder:
- Strategy
- Execution
- Analysis
- Support
- Defense
- Research

## Interaction Requirements
- Selecting crew card updates Agent Detail
- Entering command and pressing Route Mission creates a simulated mission card if API is not configured
- If PROCESSOR_URL is configured, call backend actions later
- Use local mock data first
- Make code clean and easy to connect to Apps Script later

## Future API Contract
Use environment/config variable:
`PROCESSOR_URL`

Actions to support later:
- dashboard.state
- job.create
- job.route
- mission.update
- receipt.create
- reaction.feed
- skill.map

## Animation Phase 1
Use CSS or Framer Motion:
- idle pulse
- working shimmer
- warning glow
- done check
- level-up sparkle

## Animation Phase 2 Placeholder
Add a “Crew Deck Live Mode” placeholder section or toggle for future PixiJS/Phaser animated deck.

## Design Constraints
- Professional and readable
- No copyrighted character likenesses
- Use original agent portraits/placeholders
- Mobile readable but desktop-first
- Keep text concise
- Do not overload the screen

## Success Criteria
- Looks like a premium real dashboard
- Agent roles are immediately understandable
- Mission command is obvious
- Evidence/Receipt loop is visible
- UI can later connect to Google Sheet / Apps Script processor
