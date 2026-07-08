# GOOGLE_SHEET_TEMPLATE_V2_LEVEL_CLONE

V2 เพิ่มระบบ Level Up, Skill Mastery และ Clone Agent

## Tabs เดิมจาก v1
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

## เพิ่ม Tab 11: Clones
Headers:
```csv
cloneId,parentAgent,cloneName,jobId,missionId,hat,skillMdPath,objective,inputSource,outputExpected,autonomyLimit,evidenceRequired,expireCondition,status,createdAt,mergedAt,receiptId
```

## เพิ่ม Tab 12: SkillMastery
Headers:
```csv
masteryId,agentId,skillName,skillPath,rank,sourceJobId,sourceMissionId,evidenceUrl,canClone,levelImpact,xpGain,status,createdAt
```

## เพิ่ม Tab 13: AgentSkillMap
Headers:
```csv
agentId,skillName,skillRank,skillPath,lastUsedJobId,lastUsedAt,successCount,cloneReady
```

## XP Rules
```csv
Mission E,10
Mission D,25
Mission C,50
Mission B,100
Mission A,200
Mission S,400
Mission SS,800
Job Complete Bonus,25 percent
Evidence Perfect Bonus,10 percent
Senior Skill Learned,300
Senior Skill Used Successfully,500
Skill MD Created/Improved,150
Clone Created and Passed QA,200
```

## Level Bands
```csv
Level 1,Rookie,0,199
Level 2,Trainee,200,499
Level 3,Operator,500,999
Level 4,Specialist,1000,1999
Level 5,Senior,2000,3999
Level 6,Master,4000,7999
Level 7,Legendary,8000,
```
