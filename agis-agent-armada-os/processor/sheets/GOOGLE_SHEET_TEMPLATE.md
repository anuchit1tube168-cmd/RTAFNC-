# GOOGLE_SHEET_TEMPLATE — Processor v1

สร้าง Google Sheet แล้วเพิ่ม tab ตามนี้

## 1. Jobs
Headers:
```csv
jobId,bossCommand,onePiece,jobType,difficulty,priority,loopMode,hatSet,ownerAgent,status,evidenceRequired,approvalRequired,createdAt,updatedAt
```

## 2. Missions
Headers:
```csv
missionId,jobId,title,ownerAgent,supportAgents,status,evidenceUrl,xpReward,dueDate,createdAt,updatedAt
```

## 3. Agents
Headers:
```csv
agentId,name,role,currentHat,level,xp,season,status,authority,activeMission
```

## 4. Skills
Headers:
```csv
skillId,name,path,category,ownerAgent,useWhen,status,updatedAt
```

## 5. Evidence
Headers:
```csv
evidenceId,jobId,missionId,type,url,note,verifiedBy,verifiedAt,status
```

## 6. Receipts
Headers:
```csv
receiptId,jobId,missionId,evidence,testResult,decision,risk,approvalStatus,summaryTH,summaryEN,createdAt
```

## 7. Decisions
Headers:
```csv
decisionId,jobId,loopType,observe,orient,decide,act,plan,doStep,checkStep,swot,risk,chosenAction,approvalStatus,createdAt
```

## 8. Logs
Headers:
```csv
logId,jobId,agentId,eventType,messageTH,messageEN,timestamp
```

## 9. Levels
Headers:
```csv
levelId,agentId,xpBefore,xpGain,xpAfter,levelBefore,levelAfter,seasonBefore,seasonAfter,reason,receiptId,createdAt
```

## 10. Config
Headers:
```csv
key,value,note
```

## Recommended Config Rows
```csv
systemName,AGIS Agent Armada OS,
defaultLoop,Hybrid,
evidenceRequired,true,
approvalForPublicDeploy,true,
approvalForExternalSend,true,
approvalForCost,true,
```
