# AGIS Crew Dashboard Static Prototype

## Purpose
Fallback implementation for AGIS Crew Dashboard Design v1 when Lovable write access is not available.

## Status
Static prototype created with local mock data.

## File
- `index.html`

## Features
- Premium dark navy/gold dashboard style
- Sidebar navigation
- Top KPI cards
- 10 AGIS crew cards
- Click crew card to update Agent Detail
- Mission Command input
- Route Mission creates local mock mission
- Reaction Feed
- Process Pipeline
- Active Missions table
- State DB + Skill Map placeholder
- Crew Deck Live Mode placeholder

## Agent Mapping
- Fable = Master Skill Architect / Escalation Brain
- AGIS = Captain / Orchestrator
- Navigator = Routing Agent
- Archaeologist = Knowledge Agent
- Shipwright = Builder / Dev Agent
- Doctor = QA Debug Agent
- Swordsman = Risk / Compliance Guard
- Cook = Docs / Graphic / Content Agent
- Sniper = Marketing / Growth Agent
- Clone = Scale / Backup Agent

## Next Steps
1. Preview static HTML.
2. Move into Lovable when `projects:write` access is available.
3. Connect `PROCESSOR_URL` after Apps Script Processor deployment.
4. Replace emoji portraits with final original character assets.
5. Add PixiJS/Phaser interactive crew deck in Phase 2.

## Notes
Lovable attempt failed due to missing `projects:write` scope, so the system followed fallback rule:

`Lovable UI → Static HTML prototype`
