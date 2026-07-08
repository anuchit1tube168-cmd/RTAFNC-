# MASTER_SKILL_ROUTER.md

## Mission
Route RTAFNC work requests to the right reusable skill and enforce the Fable Workflow.

## Global Rule
All major work starts with:
INSPECT -> CLARIFY -> DESIGN -> BUILD -> VERIFY -> DELIVER

## Skill Router

| Work type | Main skill | Supporting skill | Required output |
|---|---|---|---|
| OBE / curriculum / SAR | Fable Workflow | RTAFNC OBE Skill V4 | PLO, Sub-PLO, CLO, Assessment, Evidence, CQI |
| Thai Word reports | thai-docx | Fable Workflow | DOCX/PDF with Thai layout checked |
| Assessment / Excel | Assessment System Skill | Fable Workflow | XLSX, HTML, PDF, Dashboard |
| Student WebApp | WebApp Skill Router | Fable Workflow | README and deployment guide |
| Video to skill | Video to Skill Loop | Professional Skill MD | Skill MD, checklist, prompt |
| Multi-file system analysis | graphify | Fable Workflow | GRAPH_REPORT, HTML, JSON |
| Research | Research Workflow | Citation Standard | cited report |

## Default Prompt
Use Fable Workflow before starting. Inspect real files first, design before building, verify results, then deliver with SKILL/WIKI/checklist.

## Verification Rule
If real verification cannot be performed, state the exact verification level.
