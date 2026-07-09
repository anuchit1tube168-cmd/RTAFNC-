# Fable AGIS Skills Import Manifest

Source: `fable-agis-skills.zip`

Imported package contains **30 skill folders** across P0/P1/P2. This manifest registers the Fable skill pack into AGIS without overwriting existing production skills.

## Skill Inventory

| # | Level | Skill Folder | Skill Name | Files | Core Goal |
|---:|---|---|---|---:|---|
| 1 | P0 Core | `p0-core/agent-routing` | Agent Routing (จ่ายงานเข้ากองเรือ) | 7 | งานทุกชิ้นถึงมือ agent ที่ "ถือ skill ตรง + ว่าง + เสี่ยงต่ำสุด" ภายในการตัดสินใจเดียว |
| 2 | P0 Core | `p0-core/apps-script-processor` | Apps Script Processor (เครื่องยนต์ประมวลผลฝั่ง Google) | 7 | เขียน GAS ที่รันจบภายใน quota จริง ไม่พังกลางทาง และตรวจสอบผลได้ |
| 3 | P0 Core | `p0-core/drive-knowledge-index` | Google Drive Knowledge Index (คลังความรู้ค้นเจอใน 5 วินาที) | 7 | Drive คือ "คลังความรู้" ของระบบ AGIS — ทุกไฟล์ต้องมีที่อยู่ตายตัว ชื่อตามแบบแผน และมี index sheet ชี้ตำแหน่ง |
| 4 | P0 Core | `p0-core/evidence-gate` | Evidence Gate / Receipt (ด่านหลักฐาน) | 7 | ไม่มีงานใด "เสร็จ" ถ้าไม่มี receipt ที่ตรวจสอบได้ คำพูด ("ทำเสร็จแล้ว") ไม่ใช่หลักฐาน — สถานะปลายทางที่เปลี่ยนจริงคือหลักฐาน |
| 5 | P0 Core | `p0-core/github-repo-operating` | GitHub Repo Operating (โครงกระดูกของระบบ) | 7 | ทุก skill/โค้ด/workflow มีบ้านเดียวบน GitHub — ย้อนดูได้ กู้ได้ อ้าง SHA ได้ |
| 6 | P0 Core | `p0-core/lovable-ui-builder` | Lovable UI Builder (หน้าบ้านใช้งานจริง) | 7 | สร้าง UI ที่ผู้ใช้กดได้จริง และเชื่อม state/API ได้ ไม่ใช่ภาพ mockup เฉย ๆ |
| 7 | P0 Core | `p0-core/qa-debug` | QA Debug (หมอสนามระบบ) | 7 | ทุก bug ต้อง reproducible, isolate ได้, แก้ทีละส่วน และมี regression test ก่อนส่ง |
| 8 | P0 Core | `p0-core/requirement-extraction` | Requirement Extraction (ถอดความต้องการเป็นสเปก) | 7 | เปลี่ยนคำสั่ง/ไฟล์/แชทยาว ๆ ให้เป็น spec ที่ทำงานต่อได้ทันที โดยไม่เดาเกินข้อมูล |
| 9 | P0 Core | `p0-core/sheet-state-db` | Google Sheet State DB (สมุดบัญชีกองเรือ) | 7 | ใช้ Google Sheet เป็น state layer ที่มนุษย์อ่านได้, agent เขียนได้, และ audit ย้อนหลังได้ |
| 10 | P0 Core | `p0-core/sop-to-workflow` | SOP to Workflow (จากระเบียบเป็นทางเดินงาน) | 7 | แปลง SOP/ระเบียบ/หนังสือราชการให้เป็น workflow ที่คนและ agent ทำตามได้จริง |
| 11 | P1 Advanced | `p1-advanced/clone-agent-protocol` | Clone Agent Protocol (แตกเงาเมื่อทีมไม่พอ) | 7 | โคลน agent แบบควบคุมได้ — มีขอบเขต, task, merge-back และไม่ทำงานซ้ำซ้อนกับต้นฉบับ |
| 12 | P1 Advanced | `p1-advanced/dashboard-design` | Dashboard Design (เล่าเรื่องด้วยข้อมูล) | 7 | Dashboard ต้องตอบคำถามผู้ใช้ได้ใน 5 วินาที ไม่ใช่แค่สวย |
| 13 | P1 Advanced | `p1-advanced/data-cleaning-excel` | Data Cleaning / Excel (ล้างข้อมูลก่อนคิด) | 7 | ข้อมูลต้องสะอาดก่อนวิเคราะห์ — ห้ามสรุปจากข้อมูลที่ยังไม่ได้ตรวจชื่อซ้ำ รูปแบบผิด หรือ missing |
| 14 | P1 Advanced | `p1-advanced/prompt-pack-builder` | Prompt Pack Builder (ชุดคำสั่งใช้ซ้ำได้) | 7 | Prompt ที่ดีต้องเป็น pack ที่ใช้ซ้ำ ทดสอบได้ มี version และรู้ว่าใช้เมื่อไหร่ |
| 15 | P1 Advanced | `p1-advanced/risk-compliance` | Risk / Compliance (ด่านความเสี่ยง) | 7 | ตรวจความเสี่ยงก่อนงานถึงโลกจริง โดยเฉพาะข้อมูลส่วนบุคคล, เอกสารราชการ, เงิน, deploy, และ public sharing |
| 16 | P1 Advanced | `p1-advanced/seo-marketing-hook` | SEO / Marketing Hook (ยิงให้โดน) | 7 | ทำให้คอนเทนต์ถูกค้นเจอและหยุดนิ้วได้ โดยไม่บิดความจริงหรือขายเกินจริง |
| 17 | P1 Advanced | `p1-advanced/shopee-affiliate-analysis` | Shopee Affiliate Analysis (วิเคราะห์สินค้าเงินเข้า) | 7 | เลือกสินค้า affiliate จากข้อมูลจริง ไม่เดาค่าคอม และให้คะแนนตามความน่าทำจริง |
| 18 | P1 Advanced | `p1-advanced/thai-official-report` | Thai Official Report (รายงานราชการไทย) | 7 | เขียนรายงาน/หนังสือราชการไทยให้ถูกโครง, สุภาพ, ตรวจสอบได้ และเหมาะกับสายบังคับบัญชา |
| 19 | P1 Advanced | `p1-advanced/webapp-deployment` | WebApp Deployment (ส่งเว็บขึ้นสนามจริง) | 7 | เว็บที่ deploy แล้วต้องเปิดได้จริง, rollback ได้, มี health check และไม่เสียข้อมูลผู้ใช้ |
| 20 | P1 Advanced | `p1-advanced/youtube-to-skill` | YouTube to Skill MD (ถอดคลิปเป็นวิชา) | 7 | แปลงคลิป/ไลฟ์/บทเรียนให้เป็น Skill MD ที่ใช้ฝึก agent ได้จริง ไม่ใช่แค่สรุปคลิป |
| 21 | P2 Master | `p2-master/ai-agent-team-orchestration` | AI Agent Team Orchestration (คุมวง agent หลายตัว) | 7 | ทำให้หลาย agent ทำงานเป็นทีม ไม่ชนกัน ไม่หลุดบริบท และส่งต่อกันพร้อม evidence |
| 22 | P2 Master | `p2-master/big-data-knowledge-brain` | Big Data Knowledge Brain (สมองคลังความรู้ใหญ่) | 7 | รวมความรู้จำนวนมากให้ค้นได้ อ้างได้ และสังเคราะห์ insight ได้โดยไม่หลอน |
| 23 | P2 Master | `p2-master/expert-recruit-scale` | Expert Recruit / Scale (เรียกผู้เชี่ยวชาญเข้ากองเรือ) | 7 | เมื่อทีมเดิมไม่พอ ต้องรู้ว่าจะหา expert/agent แบบไหน, test อย่างไร, onboard/offboard อย่างไร |
| 24 | P2 Master | `p2-master/failure-debugging` | Failure Debugging (ชันสูตรความล้มเหลว) | 7 | ความล้มเหลวทุกครั้งต้องกลายเป็น root cause + preventive action + skill/SOP revision |
| 25 | P2 Master | `p2-master/multi-model-routing` | Multi-Model Routing (เลือก AI ให้ถูกสนาม) | 7 | เลือก model/tool จากคุณภาพ-ต้นทุน-ความเร็ว-ความเสี่ยง ไม่ใช่เลือกจากความชอบ |
| 26 | P2 Master | `p2-master/organization-automation` | Organization Automation (อัตโนมัติระดับองค์กร) | 7 | เปลี่ยนกระบวนการองค์กรให้คน+AI ทำร่วมกัน ลดงานซ้ำ ≥50% โดยไม่ทำให้ governance พัง |
| 27 | P2 Master | `p2-master/personal-operating-system` | Personal Operating System (ระบบชีวิตผู้บังคับกองเรือ) | 7 | ออกแบบระบบชีวิต/งานของ Boss ให้ยั่งยืน วัดผลได้ และไม่ burn out |
| 28 | P2 Master | `p2-master/project-recovery` | Project Recovery (กู้โปรเจกต์พัง) | 7 | โปรเจกต์ที่พังต้องถูก freeze, diagnose, recover เป็นเฟส และสื่อสาร stakeholder ให้กลับมาคุมได้ |
| 29 | P2 Master | `p2-master/skill-revision` | Skill Revision (ปรับวิชาเมื่อโลกเปลี่ยน) | 7 | Skill MD ต้องมี version, change log, feedback loop และ update เมื่อใช้จริงแล้วพบช่องโหว่ |
| 30 | P2 Master | `p2-master/system-architect` | System Architect (สถาปนิกระบบใหญ่) | 7 | ออกแบบระบบให้แยกส่วน, เชื่อมกันได้, ดูแลได้, กู้ได้ และไม่ล็อกติด tool เดียว |

## Import Decision

- Store this Fable pack under `agis-agent-armada-os/imported/fable-agis-skills/`.
- Register all 30 skills into State DB as imported Fable skills.
- Keep existing AGIS production skills; use this pack as upgrade/reference source.
- Promote any imported skill to production only after real-job test + receipt.

## Next Actions

1. Run gap audit between current AGIS skills and Fable pack.
2. Update AgentSkillMap with owner agents.
3. Select 3 high-value skills for immediate real-world testing.
4. Convert proven imported skills into production skill folders.
