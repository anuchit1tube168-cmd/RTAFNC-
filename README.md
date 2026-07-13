# Fable Wave 1 Production Skills

This package contains the first Fable skills selected for promotion to production AGIS:

1. `p0-core/fable-mode` — master judgment, planning, verification, and execution orchestrator
2. `p0-core/qa-debug`
3. `p0-core/evidence-gate`
4. `p1-advanced/webapp-deployment`
5. `p1-advanced/dashboard-design`
6. `p1-advanced/risk-compliance`

Production import rule:

`Imported Reference -> Real-World Test -> Evidence -> Receipt -> Production Skill`

Recommended canonical path in repository:

`agis-agent-armada-os/skills/<level>/<skill>/`

Claude Code project runtime entry:

`.claude/skills/fable-mode/SKILL.md`

Invoke manually with:

`/fable-mode [balanced|deep|build|audit|research] <task>`

Natural-language triggers include `fable mode`, `architect then build`, `plan before acting`, `ตรวจสอบก่อนทำ`, and `คิดก่อนแก้`.
