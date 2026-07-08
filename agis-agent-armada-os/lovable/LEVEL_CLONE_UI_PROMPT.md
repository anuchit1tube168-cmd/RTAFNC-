# Lovable Prompt — Level Up + Clone UI

ใช้ prompt นี้ต่อใน Lovable Command Center หลังเชื่อม Processor URL แล้ว

## Prompt

อัปเกรด AGIS Agent Armada UI ให้รองรับ Processor v2: Level Up, Skill Mastery, Clone Agent

เพิ่มหน้า/section:

1. Agent Level Panel
- แสดง agent name, level, xp, season, currentHat, status
- progress bar ไป level ถัดไป
- badge Rookie/Trainee/Operator/Specialist/Senior/Master/Legendary

2. Skill Mastery Center
- ฟอร์มบันทึก skill.mastery
- fields: agentId, skillName, skillPath, rank, sourceJobId, sourceMissionId, evidenceUrl, canClone
- แสดงรายการ Senior/Master/Legendary skills
- badge Clone Ready ถ้า canClone = true

3. Clone Factory
- ฟอร์ม clone.create
- fields: parentAgent, cloneName, jobId, missionId, hat, skillMdPath, objective, inputSource, outputExpected, autonomyLimit, expireCondition
- list active clones
- ปุ่ม Merge Clone → action clone.merge ต้องใส่ receiptId

4. XP Award Console
- action level.award
- fields: agentId, xpGain, reason, receiptId
- เตือนว่า completion XP ควรมี receipt

5. Dashboard KPI v2
เพิ่มการ์ด:
- clonesActive
- clonesDone
- seniorSkills
- masterSkills
- legendarySkills
- avgAgentLevel
- topAgentByXp

API calls:
- level.award
- skill.mastery
- clone.create
- clone.merge
- dashboard.state

Rules:
- Clone ต้องมี jobId และ missionId
- Clone Merge ต้องมี receiptId
- Skill Mastery ต้องมี evidenceUrl
- ไม่มี evidence = ไม่ควรให้ XP completion
- UI ใช้ dark naval brown/gold RPG dashboard เหมือนเดิม

เพิ่มคำอธิบายสั้นบนหน้า:
"Agent โตจากงานจริง Mission จริง Skill MD ที่ใช้จริง และ Clone ที่ผ่าน QA ไม่ใช่โตจากการคุย"
