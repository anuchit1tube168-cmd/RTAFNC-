# Project Style Map — Motion Design Adoption

## Decision matrix

| ระบบ | Pattern หลัก | Motion ระดับ | เหมาะกับแนว | สิ่งที่ห้ามทำ |
|---|---|---:|---|---|
| AGIS Agent Command Center | Command Center | สูงแบบควบคุม | AI Automation / Synapse / Datacore | animation ตลอดจอจนอ่านข้อมูลไม่ได้ |
| RTAFNC Student LIFF | Trusted Institutional Portal | ต่ำ–กลาง | Clean institutional + mobile cards | background video, glass หนัก, ปุ่มเล็ก |
| Staff Console | Command Center + Institutional | กลาง | Datacore / Guardnet | ใช้สีแทนสถานะอย่างเดียว |
| OBE/CLO Analyzer | Data Intelligence | ต่ำ–กลาง | Transform Data / Datacore | เปลี่ยนสูตร, rebuild template, fake KPI |
| Teaching Supervision | Institutional Workflow | ต่ำ | Taskora / HR SaaS | motion ในตาราง rubric มากเกินไป |
| Good Deed / Leave | Mobile Workflow | ต่ำ–กลาง | Taskora / ClearInvoice | รวมข้อมูลสุขภาพกับหน้าสาธารณะ |
| Hospital module | Secure Institutional | ต่ำ | Guardnet / Bionova | แสดงข้อมูลจริงใน demo/public repo |
| Shopee Affiliate | Commerce Intelligence | กลาง | E-commerce / Finlytic | เดาค่าคอมเป็นตัวเลข |
| Catering / Kitchen | Logistics Operations | ต่ำ | Targo Logistics | ทำตัวเลขประกอบเป็น safety guarantee |
| Coding / AR Game | Educational Adventure | กลาง–สูง | CodeNest / Urban Jungle | ลอกตัวละครหรือฉากลิขสิทธิ์ |
| Condo sales | Campaign Landing | กลาง | Sky Estate / Veloce | อ้างราคาขายจริงโดยไม่มีหลักฐาน |
| Project & Skills Portal | Agency + Command Center | กลาง | Modern Agency / AI Designer | ปล่อยข้อมูลภายในใน public page |

## Rollout order

### P0 — ใช้ก่อน
1. AGIS Agent Command Center
2. RTAFNC Student LIFF / Staff Console
3. OBE/CLO Evaluation Analyzer
4. Teaching Supervision

เหตุผล: เป็นระบบแกนกลางและระบบองค์กรที่มีผู้ใช้จริง ต้องได้มาตรฐานเดียวกันก่อน

### P1 — ใช้ต่อ
1. Good Deed / Leave / Hospital
2. Shopee Affiliate War Room
3. Catering / Kitchen Logistics

### P2 — Campaign / Experimental
1. Coding / AR Game
2. Condo sales page
3. Public Project & Skills Portal

## Reusable page composition

### Dashboard page
1. Top navigation
2. Context/mission strip
3. KPI cards
4. Main work queue
5. Supporting chart/table
6. Activity/evidence timeline
7. Mobile actions

### Form page
1. Title + save state
2. Step/progress indicator
3. Input sections
4. Evidence uploader
5. Review summary
6. Submit/approval receipt

### Public landing page
1. Lightweight hero
2. Proof points
3. Feature/use-case sections
4. Evidence/gallery
5. CTA
6. Trust/privacy/footer

## Motion recipes

### Recipe A — Institutional reveal
- opacity 0→1
- y 12→0
- 180–300 ms
- once per section

### Recipe B — Command scan
- subtle gradient/grid drift
- 12–24 second cycle
- decorative layer only
- pause or simplify on mobile/reduced motion

### Recipe C — KPI update
- number transition only when data changes
- status icon/text update
- no continuous counter animation

### Recipe D — Workflow progression
- animate step connector and current step
- preserve readable static state
- success animation <= 600 ms

## Selection rule for AI agents

Router must choose only one dominant visual pattern per page:
- Operations → Command Center
- Government/education work → Institutional
- Analysis/reporting → Data Intelligence
- Public sales/content → Campaign Landing
- Game/learning → Educational Adventure

Mixing more than two dominant patterns requires reviewer approval.

## Deployment guardrail

Before applying a prompt to an existing repository:
1. Create a feature branch.
2. Record existing routes and screenshots.
3. Run baseline tests.
4. Apply design in small sections.
5. Test mobile/desktop and reduced motion.
6. Create receipt.
7. Merge only after functional parity.
