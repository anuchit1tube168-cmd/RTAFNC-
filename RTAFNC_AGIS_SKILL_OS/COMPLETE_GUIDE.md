# RTAFNC AGIS Skill OS Complete Guide

## Purpose
This guide makes the Skill OS complete enough for daily use in RTAFNC projects.

## Daily Use Flow
1. Open `dashboard.html` or `index.md`.
2. Choose the work domain.
3. Read the matching skill file.
4. Run the work with the Fable Workflow.
5. Save reusable knowledge back as a Skill MD.
6. Store internal evidence in approved internal storage, not in the public repository.

## Work Domains
| Domain | Start file | Result |
|---|---|---|
| OBE / curriculum / SAR | `01_OBE/RTAFNC_OBE_SKILL_V4.md` | PLO, Sub-PLO, CLO, Assessment, Evidence, CQI |
| OBE evidence | `01_OBE/OBE_EVIDENCE_REGISTER_TEMPLATE.csv` | Evidence register |
| Assessment | `02_ASSESSMENT/ASSESSMENT_SYSTEM_SKILL.md` | Excel, dashboard, report |
| Thai documents | `03_DOCX_REPORT/THAI_DOCX_USAGE.md` | Word/PDF with Thai layout checked |
| WebApp | `04_WEBAPP/WEBAPP_SKILL_ROUTER.md` | README, deploy plan, test checklist |
| Video to skill | `05_VIDEO_TO_SKILL/YOUTUBE_TO_SKILL_PROMPT.md` | Skill MD and checklist |
| Graph analysis | `06_GRAPHIFY/GRAPHIFY_USAGE.md` | Graph report and architecture map |

## Definition of Complete
A task is complete only when it has:
- real source inspection
- clear design choice
- reusable output
- verification notes
- next action
- public/private classification

## Repository Rule
Public repository files should be templates, workflows, and examples only. Real evidence files should be linked in the evidence register without exposing private content.

## Recommended Next Upgrade
Build an internal dashboard that reads `skill-os-manifest.json` and shows status for each skill: active, needs update, evidence linked, and owner assigned.
