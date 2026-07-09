# AGIS Loop Skill Matrix

This matrix maps the 8 Claude-style loops into the existing AGIS 30-skill library.

| Loop | Primary Skills | Owner | Backup | Risk | First Test Job |
|---|---|---|---|---|---|
| data-ingestion-loop | google-drive-knowledge-index, google-sheet-state-db, requirement-extraction, evidence-gate-receipt, big-data-knowledge-brain | Archaeologist | Doctor | Medium | สรุปข้อมูล Drive/งาน 24 ชม. |
| external-alpha-farming-loop | youtube-to-skill-md, prompt-pack-builder, seo-marketing-hook, shopee-affiliate-analysis, evidence-gate-receipt | Sniper | Fable | Medium | ถอดคลิป/บทความเป็น skill ใหม่ |
| internal-alpha-farming-loop | big-data-knowledge-brain, project-recovery, system-skill-gap-audit, sop-to-workflow, requirement-extraction | Archaeologist | Swordsman | Medium | หา blocker ซ้ำใน WebApp วพอ. |
| optimization-loop | dashboard-design, qa-debug, failure-debugging, webapp-deployment, apps-script-processor | Doctor | Shipwright | Medium | ลด error/เวลาโหลด dashboard |
| code-build-loop | requirement-extraction, system-architect, github-repo-operating, apps-script-processor, qa-debug, evidence-gate-receipt | Shipwright | Doctor | High | สร้าง/แก้ crew-dashboard.html |
| improve-system-loop | skill-revision, system-skill-gap-audit, failure-debugging, expert-recruit-scale, ai-agent-team-orchestration | Fable | AGIS | High | อัปเดต skill จาก receipt ล่าสุด |
| ecosystem-monitoring-loop | ai-agent-team-orchestration, google-sheet-state-db, evidence-gate-receipt, multi-model-routing, risk-compliance | AGIS | Doctor | High | ตรวจ loops ทั้งหมดที่ลงท้าย -loop |
| north-star-loop | personal-operating-system, dashboard-design, big-data-knowledge-brain, system-architect, seo-marketing-hook | AGIS | Fable | Medium | สรุปเป้าหมาย 6 เดือนของ Boss |

## Upgrade Priority

### P0

1. skill-driven-loop-automation
2. write-run-log
3. human-approval-gate
4. loop-receipt-gate
5. ecosystem-monitoring-loop

### P1

6. data-ingestion-loop
7. code-build-loop
8. improve-system-loop

### P2

9. external-alpha-farming-loop
10. north-star-loop

## AGIS Rule Additions

```text
ห้ามตั้ง automation จนกว่า skill จะ manual pass 3 รอบ
ทุก loop ต้องมี run log
ทุก loop ต้องมี receipt
ทุก loop ต้องมี owner + backup
ทุก loop ต้องมี stop condition
ทุก high-risk loop ต้องมี human approval gate
ทุก loop ต้องลงท้ายด้วย -loop
```
