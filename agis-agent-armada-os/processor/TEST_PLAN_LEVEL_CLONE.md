# TEST_PLAN_LEVEL_CLONE — Processor v2

## Test 1: Setup v2
```json
{"action":"setup","payload":{}}
```
Expected:
- ok true
- Tabs เพิ่ม: Clones, SkillMastery, AgentSkillMap

## Test 2: Award XP
```json
{
  "action":"level.award",
  "payload":{
    "agentId":"AGT-004",
    "xpGain":200,
    "reason":"Mission A completed",
    "receiptId":"REC-test"
  }
}
```
Expected:
- Agent XP เพิ่ม
- Level/Season คำนวณใหม่
- Levels row created

## Test 3: Skill Mastery
```json
{
  "action":"skill.mastery",
  "payload":{
    "agentId":"AGT-003",
    "skillName":"SOP Extractor",
    "skillPath":"skills/sop-extractor/SKILL.md",
    "rank":"Senior",
    "sourceJobId":"JOB-test",
    "sourceMissionId":"MIS-test",
    "evidenceUrl":"https://example.com/evidence",
    "canClone":true
  }
}
```
Expected:
- SkillMastery row created
- AgentSkillMap row created
- Agent gets +300 XP

## Test 4: Clone Create
```json
{
  "action":"clone.create",
  "payload":{
    "parentAgent":"Archive Eye",
    "cloneName":"Archive Eye PDF Clone 01",
    "jobId":"JOB-test",
    "missionId":"MIS-test",
    "hat":"Research Hat",
    "skillMdPath":"skills/sop-extractor/SKILL.md",
    "objective":"Extract rules from PDF",
    "inputSource":"Drive file",
    "outputExpected":"Rule table",
    "autonomyLimit":"read only",
    "expireCondition":"mission Done"
  }
}
```
Expected:
- Clones row created
- status Doing

## Test 5: Clone Merge
```json
{
  "action":"clone.merge",
  "payload":{
    "cloneId":"CLN-...",
    "receiptId":"REC-test",
    "xpGain":200
  }
}
```
Expected:
- Clone status Done
- mergedAt set
- Parent agent gets XP

## Test 6: Dashboard v2
```json
{"action":"dashboard.state","payload":{}}
```
Expected KPI adds:
- clonesActive
- clonesDone
- seniorSkills
- masterSkills
- legendarySkills
- avgAgentLevel
- topAgentByXp
