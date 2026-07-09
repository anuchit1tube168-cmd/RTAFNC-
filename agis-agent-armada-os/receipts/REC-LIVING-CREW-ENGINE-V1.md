# REC-LIVING-CREW-ENGINE-V1

Date: 2026-07-09  
Mission: Upgrade AGIS Crew Dashboard into living walking agent system  
Owner: AGIS + Shipwright + Fable + Doctor  
Repo: `anuchit1tube168-cmd/RTAFNC-`  
Project Root: `agis-agent-armada-os/`

## Output Updated

- `agis-agent-armada-os/ui/crew/crew-dashboard.html`

## Engineering Systems Added

### 1. Living Ship Deck
- ship scene
- deck zones
- command bridge
- map room
- QA ward
- forge dock
- signal tower

### 2. Character Movement Engine
- each agent has `x`, `y`
- each agent has target `tx`, `ty`
- each agent walks toward target
- agents stay inside deck bounds
- z-index changes by vertical position for depth

### 3. Autonomous Brain Loop
- `brainLoop()` makes agents think/react by themselves
- autopilot can be toggled
- agents randomly inspect deck, check skill map, wait for Boss, and check receipt gate

### 4. Reaction Engine
- speech bubble above each character
- live reaction feed
- event driven reactions
- selected agent focus

### 5. Process Pipeline
- Requirement
- Routing
- Build
- QA Debug
- Receipt

### 6. Mission Routing
- rule-based skill/agent routing
- owner + backup assignment
- active mission table update

## Character Set

- AGIS
- Fable
- Navigator
- Shipwright
- Archaeologist
- Doctor
- Swordsman
- Cook
- Sniper
- Clone

## Test Result

PASS — HTML upgraded and pushed to GitHub.

## Commit

`5da248492b9cccf106ea1d50c1503e23ec6f1de5`

## Next Engineering Step

1. Connect movement/reaction events to real JobState
2. Save reactions to ReceiptIndex
3. Add sprite/image asset pipeline for higher quality character portraits
4. Add mission event bus: `new_mission`, `assigned`, `blocked`, `qa_pass`, `receipt_created`
