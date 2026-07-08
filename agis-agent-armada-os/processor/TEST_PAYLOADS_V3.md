# TEST_PAYLOADS_V3 — Copy/Paste JSON for Apps Script Web App

ใช้กับ Web App URL ของ Apps Script
ถ้าตั้ง AUTH_TOKEN ให้เพิ่ม field `token` ระดับเดียวกับ action/payload

## 1. setup
```json
{
  "action": "setup",
  "payload": {}
}
```

## 2. job.create
```json
{
  "action": "job.create",
  "payload": {
    "bossCommand": "สร้างระบบบันทึกความดีจาก SOP และทำ dashboard ตรวจ evidence",
    "onePiece": "Good Deed WebApp พร้อม Job Board, Evidence Gate, Receipt",
    "jobType": "Build",
    "priority": "High"
  }
}
```

## 3. job.route
```json
{
  "action": "job.route",
  "payload": {
    "jobId": "JOB-REPLACE"
  }
}
```

## 4. mission.update should fail without evidence
```json
{
  "action": "mission.update",
  "payload": {
    "missionId": "MIS-REPLACE",
    "status": "Done"
  }
}
```

## 5. receipt.create
```json
{
  "action": "receipt.create",
  "payload": {
    "jobId": "JOB-REPLACE",
    "missionId": "MIS-REPLACE",
    "evidence": "https://example.com/evidence",
    "testResult": "Pass",
    "summaryTH": "ทดสอบผ่านและมีหลักฐาน",
    "summaryEN": "Test passed with evidence"
  }
}
```

## 6. mission.update Done with evidence
```json
{
  "action": "mission.update",
  "payload": {
    "missionId": "MIS-REPLACE",
    "status": "Done",
    "evidenceUrl": "https://example.com/evidence",
    "receiptId": "REC-REPLACE"
  }
}
```

## 7. skill.mastery
```json
{
  "action": "skill.mastery",
  "payload": {
    "agentId": "AGT-003",
    "skillName": "SOP Extractor",
    "skillPath": "skills/sop-extractor/SKILL.md",
    "rank": "Senior",
    "sourceJobId": "JOB-REPLACE",
    "sourceMissionId": "MIS-REPLACE",
    "evidenceUrl": "https://example.com/evidence",
    "canClone": true
  }
}
```

## 8. clone.create
```json
{
  "action": "clone.create",
  "payload": {
    "parentAgent": "Archive Eye",
    "cloneName": "Archive Eye SOP Clone 01",
    "jobId": "JOB-REPLACE",
    "missionId": "MIS-REPLACE",
    "hat": "Research Hat",
    "skillMdPath": "skills/sop-extractor/SKILL.md",
    "objective": "ถอดกติกา SOP เป็น rule table",
    "inputSource": "Google Drive file URL",
    "outputExpected": "Rule table + validation rule",
    "autonomyLimit": "read and extract only",
    "expireCondition": "mission Done"
  }
}
```

## 9. clone.merge
```json
{
  "action": "clone.merge",
  "payload": {
    "cloneId": "CLN-REPLACE",
    "receiptId": "REC-REPLACE",
    "xpGain": 200
  }
}
```

## 10. blocker.report
```json
{
  "action": "blocker.report",
  "payload": {
    "jobId": "JOB-REPLACE",
    "missionId": "MIS-REPLACE",
    "blockerType": "Skill Gap",
    "summary": "ทีมไม่มี security checklist สำหรับ public deploy",
    "currentAgent": "Forge Dev",
    "attemptedFix": "ใช้ QA checklist ปกติ",
    "whyFailed": "ไม่มี checklist ด้าน security และ permission"
  }
}
```

## 11. scale.evaluate
```json
{
  "action": "scale.evaluate",
  "payload": {
    "blockerId": "BLK-REPLACE"
  }
}
```

## 12. recruit.request
```json
{
  "action": "recruit.request",
  "payload": {
    "jobId": "JOB-REPLACE",
    "missionId": "MIS-REPLACE",
    "blockerId": "BLK-REPLACE",
    "scaleLevel": "Warlord",
    "expertRole": "Cybersecurity Guard",
    "specialty": "Security review and risk control",
    "outputContract": "Security checklist and fix plan",
    "approvalRequired": true
  }
}
```

## 13. expert.register
```json
{
  "action": "expert.register",
  "payload": {
    "name": "Cybersecurity Guard",
    "tier": "Warlord",
    "specialty": "Security",
    "useWhen": "Public deploy or sensitive data risk",
    "authorityLimit": "review and recommend only",
    "skillMdPath": "scaling/experts/cybersecurity-guard/SKILL.md",
    "backupAgent": "Jin Guard"
  }
}
```

## 14. skill.revise
```json
{
  "action": "skill.revise",
  "payload": {
    "skillName": "GitHub Deploy Loop",
    "skillPath": "skills/github-deploy-loop/SKILL.md",
    "reason": "QA failed twice on deploy permission",
    "changeSummary": "เพิ่ม permission/security checklist ก่อน public deploy",
    "evidenceUrl": "https://example.com/evidence",
    "versionBefore": "v1.0",
    "versionAfter": "v1.1",
    "reviewedBy": "Bug Doctor",
    "approvedBy": "Captain AGIS"
  }
}
```

## 15. dashboard.state
```json
{
  "action": "dashboard.state",
  "payload": {}
}
```
