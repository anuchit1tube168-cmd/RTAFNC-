# Lovable Prompt — Fleet Scale / Expert Recruit UI

ใช้ prompt นี้ต่อใน Lovable Command Center หลังเชื่อม Processor v2 แล้ว

## Prompt

อัปเกรด AGIS Agent Armada UI ให้มีหน้า Fleet Scale Center สำหรับจัดการ Blocker, Recruit Specialist, Warlord Expert, Emperor Board และ Revise Skill

เพิ่ม sections:

1. Blocker Center
- ฟอร์ม blocker.report
- fields: jobId, missionId, blockerType, summary, currentAgent, attemptedFix, whyFailed
- list blockers: Open, Evaluated, RecruitRequested, Resolved
- badge recommendedScaleLevel

2. Scale Evaluation
- ปุ่ม scale.evaluate จาก blockerId
- แสดง expertNeeded, approvalRequired
- แสดง step recommendation:
  Clone → Hat Switch → Existing Skill MD → Specialist → Warlord → Emperor → Revise Skill

3. Recruit Request
- ฟอร์ม recruit.request
- fields: jobId, missionId, blockerId, scaleLevel, expertRole, specialty, inputNeeded, outputContract, authorityLimit, approvalRequired
- ถ้า scaleLevel เป็น Warlord หรือ Emperor ให้แสดง Pending Boss Approval

4. Expert Registry
- ฟอร์ม expert.register
- fields: name, tier, specialty, useWhen, authorityLimit, skillMdPath, backupAgent
- แสดง specialist/warlord/emperor registry

5. Skill Revision Board
- ฟอร์ม skill.revise
- fields: skillName, skillPath, reason, changeSummary, evidenceUrl, versionBefore, versionAfter, reviewedBy, approvedBy
- แสดง revisions: Draft, Review, Approved, Applied

6. Professional Stepper
แสดงขั้นตอนการแก้ blocker:
Report Blocker → Evaluate Scale → Recruit/Clone/Revise → Expert Output → Doctor QA → Captain/Jin Approval → Update Skill MD → Receipt

Rules:
- blocker.report ต้องมี attemptedFix และ whyFailed
- recruit Warlord/Emperor ต้อง approvalRequired = true
- skill.revise ต้องมี evidenceUrl
- expert ใหม่ไม่มีสิทธิ์เกิน authorityLimit
- เมื่อ blocker resolved ให้แนะนำ update LLM_WIKI / SKILL.md

Design:
RPG dashboard dark naval brown/gold, professional operations center, clear status badges.
