# AGIS Skill MD Master Roadmap

Version: v1.0  
Date: 2026-07-09  
Owner: Boss Agis

## Operating Doctrine

```text
อ่านก่อน → คิดก่อน → แก้ทีละส่วน → ตรวจสอบเสมอ → เก็บ Receipt → อัปเดต Skill
```

## Core Meaning

- **Fable** = อาจารย์ฝึก / Skill Architect / Master Trainer
- **AGIS** = สมองกลาง / กองเรือ / Router / State DB Controller
- **Skill MD** = วิชาที่ติดตั้งถาวรให้ Agent
- **Google Drive** = working knowledge และเอกสารองค์กร
- **GitHub** = source of truth สำหรับ skill/code/workflow
- **Google Sheet** = job state / skill map / receipt index
- **Receipt** = หลักฐานว่าใช้ได้จริง

## P0 Core Skills

| # | Skill | Agent | Purpose | Test Job | Level Up |
|---:|---|---|---|---|---|
| 1 | requirement-extraction | Navigator + AGIS | ถอดโจทย์/ข้อจำกัด/หลักฐานก่อนทำงาน | ระบบประเมิน วพอ. | Requirement Auditor |
| 2 | sop-to-workflow | Swordsman + Cook + Doctor | แปลง SOP/ระเบียบเป็น workflow | งานประกอบเลี้ยง/งานลา | Policy-to-System Architect |
| 3 | google-drive-knowledge-index | Archaeologist + AGIS | จัด Drive เป็นคลังความรู้ค้นคืนได้ | คลังเอกสาร วพอ. | Knowledge Graph Engineer |
| 4 | google-sheet-state-db | Archaeologist + AGIS | Sheet เป็น State DB / Skill Map / Receipt Index | AgentSkillMap | Ops DB Designer |
| 5 | apps-script-processor | Shipwright + Doctor | GAS backend เชื่อม Sheet/Drive/LINE/WebApp | Good Deed / ระบบลา | Automation Backend Engineer |
| 6 | github-repo-operating | Shipwright + AGIS | GitHub source of truth + release/rollback | RTAFNC WebApp | DevOps Repo Commander |
| 7 | lovable-ui-builder | Shipwright + Navigator | สร้าง UI prototype/dashboard | Dashboard วพอ. | Product UI Builder |
| 8 | evidence-gate-receipt | Doctor + AGIS | บังคับเก็บหลักฐานก่อนนับว่าผ่าน | ทุก deploy/report | Quality Gate Keeper |
| 9 | qa-debug | Doctor + Shipwright | debug ทีละจุด มี reproduce/patch/retest | GAS error / เว็บเปิดไม่ได้ | Failure Debug Lead |
| 10 | agent-routing | AGIS + Fable | route งานเข้า agent/skill/backup | Mission Board | Fleet Orchestrator |

## P1 Advanced Skills

| # | Skill | Agent | Purpose | Level Up |
|---:|---|---|---|---|
| 11 | webapp-deployment | Shipwright + Doctor | deploy GitHub Pages/Cloudflare/GAS พร้อม fallback | Release Engineer |
| 12 | dashboard-design | Archaeologist + Shipwright | dashboard ที่ช่วยตัดสินใจจริง | Decision Intelligence Designer |
| 13 | thai-official-report | Cook + Swordsman | รายงาน/หนังสือราชการมืออาชีพ | Official Knowledge Officer |
| 14 | data-cleaning-excel | Archaeologist + Doctor | clean Excel โดยไม่ทำสูตรพัง | Data Reliability Engineer |
| 15 | youtube-to-skill-md | Fable + Cook | ถอดคลิปเป็น skill ที่ฝึกได้ | Training Doctrine Extractor |
| 16 | prompt-pack-builder | Fable + Navigator | prompt pack reusable/versioned | Instruction Systems Designer |
| 17 | shopee-affiliate-analysis | Sniper + Archaeologist | วิเคราะห์ affiliate ไม่เดาค่าคอม | Commerce Intelligence Agent |
| 18 | seo-marketing-hook | Sniper + Swordsman | hook/title/caption/CTA วัดผลได้ | Growth Copy Strategist |
| 19 | risk-compliance | Doctor + Swordsman | จับ risk ก่อนปล่อยงาน | Compliance Gate Architect |
| 20 | clone-agent-protocol | AGIS + Fable | clone agent เมื่อโหลดงานสูง | Agent Factory Manager |

## P2 Saber / Master Skills

| # | Skill | Agent | Purpose | Level Up |
|---:|---|---|---|---|
| 21 | system-architect | Fable + AGIS + Shipwright | ออกแบบระบบ end-to-end | Enterprise AI Systems Architect |
| 22 | ai-agent-team-orchestration | AGIS + Fable | คุมกองเรือ agent แบบ mission/XP | AI Operations Commander |
| 23 | multi-model-routing | Fable + AGIS | เลือก AI/manual/fallback ให้คุ้ม | Model Resource Strategist |
| 24 | project-recovery | Doctor + AGIS | กู้โปรเจกต์ค้าง/สับสน | Rescue Mission Lead |
| 25 | failure-debugging | Doctor + Fable | วิเคราะห์ failure หลังลอง 2 รอบ | Reliability Commander |
| 26 | skill-revision | Fable + AGIS | อัปเดต Skill MD หลังใช้งานจริง | Living Doctrine Maintainer |
| 27 | expert-recruit-scale | Fable + AGIS | สร้าง agent ใหม่ตาม gap | Guild Master |
| 28 | big-data-knowledge-brain | Archaeologist + AGIS | knowledge brain จาก Drive/Sheet/GitHub | Org Knowledge Architect |
| 29 | organization-automation | Shipwright + AGIS | automation ระดับองค์กร | Automation Program Manager |
| 30 | personal-operating-system | AGIS + Fable | ระบบฝึกตัวเอง งาน เงิน วิจัย AI | Master Operator |

## Minimum Pass Gate

Skill จะถือว่าผ่านได้ ต้องมีครบ:

- มีงานจริง 1 งานที่ใช้ skill นี้
- มี output ที่เปิดดูได้หรือใช้งานได้
- มี checklist pass/fail
- มี evidence/receipt
- มีบทเรียนที่เอาไปอัปเดต SKILL.md
- มี owner agent + backup agent

## 2-Round Failure Rule

เปิด `skills/_shared/system-skill-gap-audit/SKILL.md` เมื่อ:

1. งานแก้ไม่ได้หลังลอง 2 รอบ
2. Boss Agis สับสนหรือไม่แน่ใจว่าจะฝึกอะไรต่อ
3. ระบบเริ่มพึ่งเครื่องมือใดเครื่องมือหนึ่งมากเกินไป
4. Project มีมูลค่าสูงหรือเสี่ยงสูง

## Audit Flow

```text
Collect current context
→ List recurring blockers
→ Map blockers to missing skills
→ Prioritize skills P0/P1/P2
→ Assign owner agent + backup agent
→ Define test job
→ Define evidence/receipt
→ Create SKILL.md / LLM_WIKI / CHECKLIST / TEST_PLAN
→ Inject into AgentSkillMap
→ Review after first real use
```
