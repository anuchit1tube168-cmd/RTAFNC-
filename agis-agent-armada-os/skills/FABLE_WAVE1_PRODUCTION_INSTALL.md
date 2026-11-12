# FABLE_WAVE1_PRODUCTION_INSTALL

## Purpose
ติดตั้ง Fable Wave 1 skills เข้า production folders ของ AGIS แบบควบคุมความเสี่ยง โดยเริ่มจากไฟล์ `SKILL.md` ของ 5 สกิลหลักก่อน แล้วค่อยเติม support files หลังผ่าน test/receipt

## Installed Production Skill Entry Points

| Skill | Production Path | Owner | Status |
|---|---|---|---|
| QA Debug | `agis-agent-armada-os/skills/p0-core/qa-debug/SKILL.md` | Doctor | Promotion PR |
| Evidence Gate | `agis-agent-armada-os/skills/p0-core/evidence-gate/SKILL.md` | Doctor / Brook Log | Promotion PR |
| WebApp Deployment | `agis-agent-armada-os/skills/p1-advanced/webapp-deployment/SKILL.md` | Shipwright | Promotion PR |
| Dashboard Design | `agis-agent-armada-os/skills/p1-advanced/dashboard-design/SKILL.md` | Cook / Shipwright | Promotion PR |
| Risk / Compliance | `agis-agent-armada-os/skills/p1-advanced/risk-compliance/SKILL.md` | Swordsman | Promotion PR |

## Source Package
Drive package: `fable-wave1-production-skills.zip`

Contains 5 skills / 36 files / SHA-256:
`290c69e2e81d6c3c8a4cc9b23e967e0816d7e75608479a5d87510dd63a306364`

## Promotion Rule

```text
Imported Reference → Real-World Test → Evidence → Receipt → Production Skill
```

## First Test Gate
`MIS-FABLE-PROMOTE-003 — WebApp Deployment real test`

Target: AGIS Crew Dashboard static prototype / GitHub Pages

Evidence required:
- URL opens
- deploy record / commit SHA
- smoke test result
- rollback note
- receipt

## Note
Only `SKILL.md` entry points are installed in this PR. Support files remain in Google Drive until successful receipts exist.
