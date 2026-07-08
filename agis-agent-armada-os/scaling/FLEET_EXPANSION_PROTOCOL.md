# FLEET_EXPANSION_PROTOCOL — Recruit More Crew / Expert Scale

## Purpose
ให้กองเรือ AGIS Agent Armada ขยายตัวได้ตามความเป็นจริง เมื่องานใหญ่ขึ้น งานติดขัด หรือความเชี่ยวชาญในทีมไม่พอ

## Core Rule
ถ้าลูกเรือเดิมทำต่อไม่ได้ ให้เลือกทางแก้ตามลำดับ:
1. Clone agent เดิม
2. เปลี่ยน Hat / Context Mode
3. ดึง Skill MD ที่มีอยู่มาใช้
4. Recruit Specialist ใหม่
5. เรียก Warlord-level Expert
6. เรียก Emperor-level Strategy Board
7. Revise / Upgrade Skill MD

## Scale Triggers
ต้องพิจารณาขยายทีมเมื่อเจออย่างน้อย 1 ข้อ:
- งานค้าง Review นานเกินรอบที่กำหนด
- Mission ระดับ S/SS มี blocker
- Agent หลักไม่มี skill ที่ตรงพอ
- Evidence ไม่พอและค้นเองไม่เจอ
- มีหลายไฟล์/หลายระบบจน clone ปกติไม่พอ
- QA fail ซ้ำ 2 รอบ
- ต้องใช้ expert เฉพาะทาง เช่น legal, finance, medical, cybersecurity, data engineering, design, video production
- งานมีผลต่อ public deploy, cost, policy, privacy หรือ reputation

## Scale Levels

### Level 0: Core Crew
ใช้ agent หลัก 10 คน

### Level 1: Clone Crew
สร้าง clone ของ agent เดิมเพื่อทำงานซ้ำ/ขนาน

### Level 2: Specialist Crew
เพิ่ม agent เฉพาะทาง เช่น Data Engineer, Legal Checker, Cyber Guard, Video Editor, SEO Analyst

### Level 3: Warlord Expert
เรียกผู้เชี่ยวชาญระดับสูงเฉพาะด้านสำหรับ blocker ที่ core crew แก้ไม่ได้

### Level 4: Emperor Board
ตั้งคณะยุทธศาสตร์เมื่อเป็นงานใหญ่ระดับระบบองค์กรหรือมีความเสี่ยงสูง

## Recruitment Rules
ลูกเรือใหม่ต้องมี:
- role name
- specialty
- useWhen
- authorityLimit
- inputNeeded
- outputContract
- evidenceRule
- skillMdPath
- backupAgent
- deactivationRule

## Safety
ผู้เชี่ยวชาญใหม่ไม่มีสิทธิ์ทำ action เสี่ยงเอง ต้องผ่าน Jin Guard และ Captain Approval

## Exit Rule
เมื่อ blocker หาย ให้สรุป lesson learned และ update SKILL.md / LLM_WIKI เพื่อให้ครั้งต่อไปไม่ต้องเรียก expert เดิมซ้ำถ้าไม่จำเป็น
