# AGENT_SKILL_LOADOUT — Crew Skill Installed List

## Purpose
ทะเบียน Skill MD ที่ติดตั้งให้ลูกเรือ AGIS Agent Armada OS เพื่อให้ agent ทุกตัวรู้ว่าใช้ skill อะไรได้บ้าง

## Installed Shared Skills

### 1. YouTube EP8 Claude Code Skill OS
Path:
`skills/youtube-ep8-claude-code-skill-os/SKILL.md`

LLM Wiki:
`skills/youtube-ep8-claude-code-skill-os/LLM_WIKI.md`

Agent Injection:
`skills/youtube-ep8-claude-code-skill-os/AGENT_INJECTION.md`

Core Pattern:
`Context → Prompt → Automation → Debug → Delivery`

Use When:
- Boss ส่งคลิป YouTube
- Boss ส่งโพสต์/บทความ/Prompt Pack
- ต้องถอดความรู้เป็น Skill MD
- ต้องเพิ่มความสามารถให้ agent team
- ต้องอัปเดต LLM_WIKI / routing / checklist

## Crew Loadout

### Captain AGIS
Installed Skills:
- youtube-ep8-claude-code-skill-os
- loop-engineering
- context-hat-switching

Main Upgrade:
เปลี่ยนความรู้ใหม่เป็น Job Card และตัดสินใจว่า skill ใดควรเข้า production brain

### Navi Map
Installed Skills:
- youtube-ep8-claude-code-skill-os
- context-hat-switching
- fleet-scaling

Main Upgrade:
route knowledge input ไปยัง skill/agent/mission ที่เหมาะ

### Archive Eye
Installed Skills:
- youtube-ep8-claude-code-skill-os
- google-drive-bigdata
- evidence-gate

Main Upgrade:
ถอดคลิป/ไฟล์/Drive เป็น rule, checklist, evidence และ Skill MD

### Forge Dev
Installed Skills:
- youtube-ep8-claude-code-skill-os
- webapp-github-lovable
- p0-processor

Main Upgrade:
แปลง skill เป็น code, Apps Script, Lovable prompt, GitHub workflow

### Bug Doctor
Installed Skills:
- youtube-ep8-claude-code-skill-os
- evidence-gate
- p0-test-plan

Main Upgrade:
ตรวจว่า skill ใหม่ใช้ได้จริง มี test plan และ acceptance criteria

### Blade SEO
Installed Skills:
- youtube-ep8-claude-code-skill-os
- marketing-seo-sales

Main Upgrade:
จัดโครงสร้าง skill ให้ค้นง่าย ใช้ซ้ำง่าย และต่อยอดเป็น SEO/content ได้

### Copy Chef
Installed Skills:
- youtube-ep8-claude-code-skill-os
- report-sop-thai

Main Upgrade:
เขียน skill/wiki/คู่มือให้อ่านง่าย ไทย/อังกฤษ พร้อมใช้จริง

### Hook Sniper
Installed Skills:
- youtube-ep8-claude-code-skill-os
- marketing-seo-sales
- shopee-affiliate

Main Upgrade:
แปลง skill เป็น hook, content series, Shopee/SEO angle

### Brook Log
Installed Skills:
- youtube-ep8-claude-code-skill-os
- receipt-standard

Main Upgrade:
สรุปการเรียนรู้เป็น receipt และ release note ไทย/อังกฤษ

### Jin Guard
Installed Skills:
- youtube-ep8-claude-code-skill-os
- fleet-scaling
- governance-gate

Main Upgrade:
ตรวจ risk, source claim, copyright, public deploy และ approval ก่อนใช้จริง

## Rule
Skill จะถือว่าติดตั้งจริงเมื่อมี:
- SKILL.md
- LLM_WIKI.md
- AGENT_INJECTION.md หรือ loadout record
- Receipt หรือ Job/Mission ที่นำไปใช้จริง

## Next Required Action
บันทึก Skill Mastery ใน State DB เมื่อใช้ skill นี้กับงานจริงสำเร็จ เช่น การอัปเดต AGIS P0 หรือถอดคลิปถัดไป
