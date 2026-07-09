# FABLE_PROMOTION_PLAN — Imported Skills to Production

## Purpose
กำหนดวิธีเลื่อน Fable imported skills เข้า production AGIS โดยไม่ทำให้ระบบพัง และยังรักษากฎ Evidence/Receipt

## Promotion Rule

```text
Imported Reference → Real-World Test → Evidence → Receipt → Production Skill
```

A skill cannot be marked as production unless it has:

1. A real-world test job
2. Output that Boss can use
3. QA result
4. Evidence link
5. Receipt ID

## Wave 1 — Protect Current AGIS Dashboard

| Order | Imported Skill | Production Target | Owner | Test Job | Promotion Condition |
|---:|---|---|---|---|---|
| 1 | QA Debug | `skills/p1-advanced/qa-debug/` or upgrade current P0 QA | Doctor | Debug AGIS dashboard deploy/result | PASS + receipt |
| 2 | Evidence Gate | `skills/p0-core/evidence-gate/` | Doctor + Brook Log | Reject Done without evidence | PASS + receipt |
| 3 | WebApp Deployment | `skills/p1-advanced/webapp-deployment/` | Shipwright | GitHub Pages / static prototype deploy | URL opens + rollback note |
| 4 | Dashboard Design | `skills/p1-advanced/dashboard-design/` | Cook + Shipwright | AGIS Crew Dashboard v1 | UI spec + mock + QA |
| 5 | Risk / Compliance | `skills/p1-advanced/risk-compliance/` | Swordsman | Public deploy risk review | Risk register + decision |

## Wave 2 — Boss Daily Work / วพอ.

| Order | Imported Skill | Production Target | Owner | Test Job |
|---:|---|---|---|---|
| 6 | Data Cleaning / Excel | `skills/p1-advanced/data-cleaning-excel/` | Cook | Clean วพอ. spreadsheet |
| 7 | Thai Official Report | `skills/p1-advanced/thai-official-report/` | Cook | Draft official report/memo |
| 8 | SOP to Workflow | `skills/p0-core/sop-to-workflow/` | Fable + Archaeologist | Convert one SOP/PDF to workflow |
| 9 | Apps Script Processor | `skills/p0-core/apps-script-processor/` | Shipwright | Deploy/test Processor URL |
| 10 | GitHub Repo Operating | `skills/p0-core/github-repo-operating/` | Shipwright | Commit/issue/receipt trace |

## Wave 3 — Master Control

Hold P2 skills until Wave 1 and Wave 2 produce enough receipts.

Minimum gate:

- Wave 1: 5 receipts
- Wave 2: 5 receipts
- Processor live
- Dashboard viewable by URL
- State DB updated

Then open:

- Agent Team Orchestration
- Project Recovery
- Failure Debugging
- Multi-Model Routing
- Skill Revision
- System Architect

## State DB Updates Required

Create new job:

`JOB-FABLE-PROMOTE-001 — Promote Fable Skills Wave 1`

Create missions:

- `MIS-FABLE-PROMOTE-001` QA Debug real test
- `MIS-FABLE-PROMOTE-002` Evidence Gate real test
- `MIS-FABLE-PROMOTE-003` WebApp Deployment real test
- `MIS-FABLE-PROMOTE-004` Dashboard Design real test
- `MIS-FABLE-PROMOTE-005` Risk / Compliance real test

## Next Action
Start with `MIS-FABLE-PROMOTE-003` because dashboard deployment is already in progress.
