# 06_JOB_STATE_SCHEMA — Google Sheet / Supabase Schema

## Purpose
กำหนดฐานข้อมูลสถานะงานสำหรับ AGIS Agent Armada OS เริ่มด้วย Google Sheet แล้วขยายเป็น Supabase ได้

## Jobs
| Field | Type | Note |
|---|---|---|
| jobId | string | unique id |
| bossCommand | text | คำสั่งดิบ |
| onePiece | text | เป้าหมายงาน |
| jobType | enum | Build/Research/Report/Audit/Deploy/Design/Video/Marketing/Data/Automation |
| difficulty | enum | E/D/C/B/A/S/SS |
| priority | enum | Low/Medium/High/Critical |
| loopMode | enum | SWOT/OODA/PDCA/Hybrid |
| hatSet | text | context mode |
| ownerAgent | text | agent หลัก |
| status | enum | Intake/Routing/Working/Review/WaitingApproval/Done |
| evidenceRequired | boolean | true/false |
| approvalRequired | boolean | true/false |
| createdAt | datetime | timestamp |
| updatedAt | datetime | timestamp |

## Missions
| Field | Type | Note |
|---|---|---|
| missionId | string | unique id |
| jobId | string | parent job |
| title | text | mission title |
| ownerAgent | text | owner |
| supportAgents | text | comma list |
| status | enum | Todo/Doing/Review/Done |
| evidenceUrl | text | link/path |
| xpReward | number | bounty |
| dueDate | date | optional |

## Agents
agentId, name, role, currentHat, level, xp, season, status, authority, activeMission

## Receipts
receiptId, jobId, missionId, evidence, testResult, decision, risk, approvalStatus, summaryTH, summaryEN, createdAt

## Decisions
decisionId, jobId, loopType, observe, orient, decide, act, plan, doStep, checkStep, swot, risk, chosenAction, approvalStatus

## Logs
logId, jobId, agentId, eventType, messageTH, messageEN, timestamp

## Levels
agentId, xpBefore, xpGain, xpAfter, levelBefore, levelAfter, seasonBefore, seasonAfter, reason, receiptId
