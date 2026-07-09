# FABLE_AGIS_GAP_AUDIT — Current AGIS vs Fable Skill Pack

## Purpose
ตรวจว่า AGIS ปัจจุบันมี skill อะไรแล้ว และ Fable pack เพิ่ม/อัปเกรดอะไรให้ระบบ เพื่อเลือกสกิลที่ควร promote เข้า production ก่อน

## Source Evidence

- Uploaded zip: `fable-agis-skills.zip`
- SHA-256: `d41a8300f95aa16605042f3bfae3775ff99ae85a3f2dd10af82c282ef895be86`
- Zip size: 181,116 bytes
- Zip entries: 276
- Skill folders: 30
- Each skill contains core files: `SKILL.md`, `LLM_WIKI.md`, `CHECKLIST.md`, `TEST_PLAN.md`, `EXAMPLES.md`, `AGENT_INJECTION.md`, plus `references/`

## Current AGIS Production Skill State

Production/installed skills already in State DB:

- YouTube EP8 Claude Code Skill OS
- Knowledge to Skill Ingestion
- P0 Core Skill Pack 10 skills
- Brand Graphic Designer

Production P0 is compact: many skills are collected in `P0_CORE_SKILL_PACK.md` instead of separate full folders.

## Fable Pack State

Fable pack provides full folder structure for 30 skills:

- P0 Core = 10
- P1 Advanced = 10
- P2 Master = 10

This is a complete training curriculum and should be used as the upgraded source for full Skill MD packages.

## Gap Summary

| Area | Current AGIS | Fable Pack | Gap Type | Decision |
|---|---|---|---|---|
| P0 Core | Installed as compact pack | Full folder per skill | Structure gap | Promote gradually |
| Evidence / Receipt | Installed and tested | Stronger receipt-first wording | Quality upgrade | Merge into production |
| Apps Script Processor | Prepared, not deployed | Full skill + quota/error focus | Execution gap | Test immediately |
| GitHub Repo Operating | Installed | Full source-of-truth discipline | Quality upgrade | Merge after test |
| Lovable UI Builder | Installed, Lovable write blocked | Full fallback logic | Tool-resilience gap | Use static HTML fallback |
| QA Debug | Installed | Stronger reproduce/isolate/regression logic | Quality upgrade | Promote immediately |
| Dashboard Design | Not production except UI spec | Full P1 dashboard skill | Missing production skill | Test with AGIS dashboard |
| Risk / Compliance | Guard exists but no full skill folder | Full P1 skill | Missing production skill | Promote before public deploy |
| Data Cleaning / Excel | Needed for วพอ. files | Full P1 skill | Missing production skill | Test with personnel/report files |
| Thai Official Report | Needed forราชการ | Full P1 skill | Missing production skill | Promote soon |
| YouTube to Skill | Existing EP8 skill | Full generic skill | Upgrade/generalize | Merge later |
| Agent Team Orchestration | Concept exists | Full P2 skill | Master gap | Keep imported until P0 stable |
| Multi-Model Routing | Concept exists | Full P2 skill | Master gap | Use when cost/risk increases |
| Project Recovery | Concept exists | Full P2 skill | Master gap | Use for broken projects |
| Skill Revision | Concept exists | Full P2 skill | Governance gap | Needed for monthly review |
| Organization Automation | Not full | Full P2 capstone | Future gap | After Processor live |
| Personal OS | Not full | Full P2 capstone | Future gap | After AGIS dashboard stable |

## Critical Blockers Found

### 1. Processor is still not live
Current status: code prepared and deployment runbook exists, but no Apps Script Web App URL has been received.

Impact:
- UI cannot write live State DB
- `job.create`, `job.route`, `receipt.create` cannot be tested through API
- Command Center remains mock/static until Processor is deployed

### 2. Lovable write access is blocked
Current status: Lovable edit attempt failed due to missing `projects:write` scope.

Impact:
- Lovable UI build cannot be pushed directly by agent
- Static HTML fallback must remain active

### 3. Production skill structure is still mixed
Some production skills are full folders, but P0 core still lives mostly as one compact pack.

Impact:
- Agents can use the roadmap, but cannot yet load a single dedicated folder per P0 skill
- Better long-term path is to promote Fable P0 skills into production folders one by one

## Promotion Priority

### Immediate Promote Candidates
1. `qa-debug`
2. `evidence-gate`
3. `webapp-deployment`
4. `dashboard-design`
5. `risk-compliance`

Reason: these directly protect the current AGIS dashboard + deployment work.

### Next Promote Candidates
6. `data-cleaning-excel`
7. `thai-official-report`
8. `sop-to-workflow`
9. `apps-script-processor`
10. `github-repo-operating`

Reason: these match Boss real work: วพอ. เอกสาร, รายงาน, Excel, SOP, Drive/GitHub.

### Hold as Imported Reference
- P2 master skills should stay imported until P0/P1 have at least 3 receipts each.

## Recommended 3 Real-World Tests

### Test A — WebApp Deployment + QA Debug
Target: AGIS Crew Dashboard static prototype / GitHub Pages

Expected evidence:
- deployed URL
- QA checklist
- failure log if any
- receipt

### Test B — Thai Official Report + SOP to Workflow
Target: one วพอ. SOP / official memo / PDF

Expected evidence:
- rule table
- workflow
- Thai official report draft
- receipt

### Test C — Data Cleaning / Excel + Dashboard Design
Target: one real spreadsheet dataset from วพอ.

Expected evidence:
- cleaned file
- issue log
- dashboard brief/mock
- receipt

## Decision
Fable skill pack is valuable and should become the master upgrade source, but AGIS should not overwrite all skills at once.

Use this rule:

```text
Imported → Tested on real job → Evidence → Receipt → Promote to Production
```

## Next Action
Create promotion jobs for 5 immediate candidates and run Test A first because AGIS dashboard is already active.
