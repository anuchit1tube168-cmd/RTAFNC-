# REC-PIRATE-SHIP-DASHBOARD-PROCESS-V2

Date: 2026-07-09  
Mission: Apply captain main-course process to redesign AGIS dashboard as pirate ship RPG operations UI  
Owner: AGIS + Fable + Shipwright + Doctor  
Repo: `anuchit1tube168-cmd/RTAFNC-`  
Project Root: `agis-agent-armada-os/`

## Process Used

### 1. Requirement Extraction
Boss required:
- Design must be closer to the generated concept
- Ship must look like a large pirate ship
- Dashboard must remain practical and operational
- Characters can be smaller like pixel/RPG game characters
- System must finish first, visual layer second
- Work must be clearly divided

### 2. Work Breakdown

#### A. Visual Layout
- Replace flat deck with large pirate ship scene
- Add ocean, moon, sails, mast, hull, rail, command bridge
- Add dashboard overlay on top of the ship scene

#### B. Character System
- Keep small RPG-style characters on deck
- Each character has x/y and target tx/ty
- Characters walk between zones
- Characters have speech bubble and reaction state

#### C. Dashboard Operations
- Left menu
- KPI cards
- Mission control
- Agent detail panel
- Reaction feed
- Active missions table
- Receipt gate panel

#### D. Process Pipeline
- Requirement
- Routing
- Build
- QA
- Receipt

#### E. QA / Receipt
- Updated source pushed to GitHub
- New receipt created

## Output Updated

- `agis-agent-armada-os/ui/crew/crew-dashboard.html`

## Key Systems Included

- Pirate ship command deck
- Dashboard overlay
- Small RPG-style walking characters
- Autopilot thinking loop
- Movement engine
- Reaction engine
- Mission routing engine
- Process pipeline
- Receipt gate

## Commit

`810b0e8c3c6aa9605399444a0c5f456627f1820c`

## Status

PASS — process applied and dashboard updated.

## Next Step

Connect this UI to real Google Sheet state:
- `AgentSkillMap`
- `JobState`
- `ReceiptIndex`

Then reactions and movement should respond to real mission state rather than simulation only.
