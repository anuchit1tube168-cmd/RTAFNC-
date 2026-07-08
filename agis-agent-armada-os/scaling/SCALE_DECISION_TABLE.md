# SCALE_DECISION_TABLE — ตารางตัดสินใจ Scale

## Purpose
ให้ Captain / Navi / Jin Guard ตัดสินใจแบบไม่มั่วว่าเมื่อไรต้อง Clone, Recruit, เรียก Expert หรือ Revise Skill

| Situation | First Action | If Still Blocked | Scale Level | Approval |
|---|---|---|---|---|
| งานซ้ำหลายไฟล์ | Clone Agent | Recruit Specialist | Level 1-2 | Captain |
| Skill เดิมใช้ได้แต่คนไม่พอ | Skill Clone | Specialist | Level 1-2 | Captain |
| QA fail 1 รอบ | Doctor fix request | Revise Skill | Level 0 | Captain |
| QA fail ซ้ำ 2 รอบ | MiroFish cause analysis | Recruit Specialist + Revise Skill | Level 2 | Captain + Jin |
| Evidence ไม่พอ | Archive search again | Research Specialist | Level 2 | Captain |
| Tool/Permission ไม่พอ | Forge checks access | Boss approval | Level 2 | Boss if real access |
| Public deploy risk | Jin Guard review | Boss approval | Level 2-3 | Boss |
| Legal/Medical/Finance risk | Stop and escalate | Warlord Expert | Level 3 | Boss |
| Architecture not enough | Cloud/Data expert | Emperor Board | Level 3-4 | Boss |
| Organization-wide system | Strategy Board | Emperor Board | Level 4 | Boss |

## Decision Rule
เลือก scale ต่ำสุดที่แก้ blocker ได้ก่อน ไม่เรียก expert ใหญ่เกินจำเป็น

## Required Evidence Before Scale
- blocker summary
- attempted fix
- why failed
- missing expertise
- expected output from expert
- skill md to revise after completion
