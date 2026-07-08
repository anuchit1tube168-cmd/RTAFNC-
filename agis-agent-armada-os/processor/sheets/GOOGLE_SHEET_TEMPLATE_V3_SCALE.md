# GOOGLE_SHEET_TEMPLATE_V3_SCALE

V3 เพิ่มระบบ Blocker / Recruit / Expert / Skill Revision

## Existing Tabs
ใช้ tabs จาก v1/v2 ต่อไป:
- Jobs
- Missions
- Agents
- Skills
- Evidence
- Receipts
- Decisions
- Logs
- Levels
- Config
- Clones
- SkillMastery
- AgentSkillMap

## New Tab 14: Blockers
Headers:
```csv
blockerId,jobId,missionId,blockerType,summary,currentAgent,attemptedFix,whyFailed,recommendedScaleLevel,expertNeeded,approvalRequired,status,createdAt,resolvedAt
```

## New Tab 15: RecruitRequests
Headers:
```csv
recruitId,jobId,missionId,blockerId,requestedBy,scaleLevel,expertRole,specialty,inputNeeded,outputContract,authorityLimit,approvalRequired,approvedBy,status,createdAt,completedAt
```

## New Tab 16: ExpertRegistry
Headers:
```csv
expertId,name,tier,specialty,useWhen,authorityLimit,skillMdPath,backupAgent,status,createdAt,deactivatedAt
```

## New Tab 17: SkillRevisions
Headers:
```csv
revisionId,skillName,skillPath,reason,changeSummary,evidenceUrl,versionBefore,versionAfter,reviewedBy,approvedBy,status,createdAt
```

## Status Values
Blockers:
- Open
- Evaluated
- RecruitRequested
- Resolved
- Cancelled

RecruitRequests:
- Requested
- Approved
- Active
- Completed
- Rejected

ExpertRegistry:
- Active
- Standby
- Deactivated

SkillRevisions:
- Draft
- Review
- Approved
- Applied
