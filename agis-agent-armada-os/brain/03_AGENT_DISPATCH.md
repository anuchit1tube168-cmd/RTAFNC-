# 03_AGENT_DISPATCH — Agent Dispatch Engine

## Purpose
กำหนดวิธีแจกงานให้ Agent Team และเปลี่ยนหมวกตามบริบทงาน

## Default Crew
| Agent | Core Role | Main Output |
|---|---|---|
| Captain AGIS | Orchestrator | Job Card, decision, approval |
| Navi Map | Router | Requirement map, mission split |
| Archive Eye | Knowledge | SOP/rule/data extraction |
| Forge Dev | Builder | Prototype, repo, deploy plan |
| Bug Doctor | Validator | QA, test, fix request |
| Blade SEO | Precision Guard | SEO/logic/structure review |
| Copy Chef | Content | Report, script, copy, prompt |
| Hook Sniper | Growth | Hook, campaign, Shopee/social angle |
| Brook Log | Story/Log | TH/EN summary, release note |
| Jin Guard | Governance | Risk, policy, approval gate |

## Hat Switching
Agent ทุกตัวมี role หลัก แต่เปลี่ยนหมวกตามบริบทได้:
- Video Hat
- SEO Hat
- Sales Hat
- Research Hat
- Builder Hat
- QA Hat
- Report Hat
- Governance Hat

## Dispatch Algorithm
1. Read Job Type
2. Select Hat Set
3. Pick Owner Agent
4. Pick Support Agents
5. Assign difficulty and XP
6. Assign evidence requirement
7. Set review agent
8. Set approval gate
9. Write mission list

## Example: Video Editing Job
Owner: Captain / Navi
Support: Archive, Copy, Sniper, Forge, Doctor, Jin, Brook
Evidence: source list, edit plan, caption, QA checklist, export note

## Example: SEO Marketing Job
Owner: Hook Sniper / Blade SEO
Support: Archive, Copy, Forge, Doctor, Jin
Evidence: keyword table, hook list, SEO checklist, landing/copy draft, QA note

## Example: WebApp Job
Owner: Forge Dev
Support: Captain, Navi, Archive, Doctor, Copy, Jin
Evidence: spec, prototype, GitHub issue, test result, preview URL

## Dispatch Output
- ownerAgent
- supportAgents
- missionList
- reviewAgent
- approvalGate
- evidenceList
