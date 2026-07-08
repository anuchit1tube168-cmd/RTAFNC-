# DEPLOY_CHECKLIST — AGIS Agent Armada Processor v3

## Pre-Deploy
- [ ] Google Sheet created
- [ ] Spreadsheet ID copied
- [ ] Apps Script project created from Sheet
- [ ] `Code_v2_LevelClone.gs` pasted
- [ ] `ScaleAddon_v3.gs` pasted
- [ ] `Code_v3_RouterPatch.gs` pasted
- [ ] Script property `SPREADSHEET_ID` set
- [ ] Optional script property `AUTH_TOKEN` set

## Deploy
- [ ] Deploy → New deployment
- [ ] Type = Web app
- [ ] Execute as = Me
- [ ] Access = Anyone with link / organization only
- [ ] Web App URL copied

## Smoke Test
- [ ] Browser GET returns system = Processor v3
- [ ] POST setup returns ok true
- [ ] Sheet tabs created
- [ ] Agents seeded 10 rows

## Functional Test
- [ ] job.create passes
- [ ] job.route creates missions
- [ ] mission.update Done without evidence fails
- [ ] receipt.create passes with evidence
- [ ] level.award updates XP
- [ ] skill.mastery records SkillMastery
- [ ] clone.create creates clone
- [ ] clone.merge awards XP
- [ ] blocker.report creates blocker
- [ ] scale.evaluate recommends scale
- [ ] recruit.request creates request
- [ ] expert.register adds expert
- [ ] skill.revise records revision
- [ ] dashboard.state returns KPI v3

## Security / Governance
- [ ] AUTH_TOKEN enabled before connecting public UI
- [ ] Warlord/Emperor recruit requires Boss approval
- [ ] Expert authorityLimit is not blank
- [ ] Public deploy actions require approval
- [ ] Evidence required before Done

## Receipt
- [ ] Web App URL saved
- [ ] Test payload responses saved
- [ ] Screenshot of tabs saved
- [ ] GitHub paths recorded
- [ ] Next action assigned: Lovable integration
