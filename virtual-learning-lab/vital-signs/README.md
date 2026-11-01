# Vital Signs Virtual Learning Lab

Interactive 3D Educational Simulation สำหรับนักเรียนพยาบาลทหารอากาศ — บทเรียนแรก **การวัดและประเมินสัญญาณชีพ**

Live Worker: `https://rtafnc-vital-signs-lab.anuchit1tube168.workers.dev`

## Core Learning Loop

`Enter → Briefing → Assessment → Decision → Intervention → Response → Evaluation → Debriefing`

ทุก interaction หลักใช้กติกา:

`Action → State Change → Result → Feedback → Score / Event Log`

## Learning Outcomes

- **Knowledge** — เข้าใจวัตถุประสงค์และการแปลผล Vital Signs ในบริบทจำลอง
- **Skills** — เตรียมผู้ป่วย/อุปกรณ์และใช้เครื่องมือวัดได้ตามลำดับ
- **Clinical Reasoning** — ตรวจพบค่าที่ควรติดตามและเลือก reassess/report อย่างเหมาะสม
- **Safety** — Hand hygiene และ Patient ID ก่อนหัตถการ
- **Communication** — สื่อสารและรายงานผลตามบทบาท
- **Professionalism** — บันทึกข้อมูลครบ ไม่สร้างค่าที่ไม่ได้ประเมิน

## Interactive 3D Environment

React Three Fiber scene มีพื้น ผนัง เตียง ผู้ป่วย โต๊ะ แสงและเงา พร้อมวัตถุ:

- Alcohol Hand Rub
- Patient ID
- Thermometer
- Blood Pressure Cuff
- Pulse Oximeter
- Stethoscope
- Digital Worksheet

ผู้เรียนหมุนกล้อง 360°, Zoom, Pan, เลือกและใช้วัตถุได้จริง

## Included Learning Systems

- Interactive Tutorial
- Start / Pause / Resume / Reset
- Branching Decision Point ที่ให้ผลต่างกัน
- Immediate Feedback
- Critical Error tracking
- 7-domain scoring: Knowledge, Skill, Clinical Reasoning, Safety, Communication, Time Management, Professionalism
- Digital Worksheet + Local Auto Save
- 5-question Quiz
- Student Dashboard
- Teacher Dashboard
- Debriefing Timeline vs Recommended Path
- Responsive desktop/tablet/mobile
- Reduced-motion support

## Cloudflare Runtime

Stack:
- React + TypeScript
- Three.js + React Three Fiber + Drei
- Zustand
- Vite + Cloudflare Vite Plugin
- Cloudflare Workers Static Assets
- Cloudflare D1

Endpoints:
- `GET /healthz`
- `POST /api/session`
- `POST /api/events`
- `GET /api/sessions`
- `GET /api/teacher/summary`

Cloudflare production binding:
- Worker: `rtafnc-vital-signs-lab`
- D1 binding: `DB`
- Database: `rtafnc-campus-uat`
- Virtual Lab tables are isolated under the `vlab_*` namespace.

The account D1 quota is currently full, so this Lab reuses the already-existing Virtual Lab schema in `rtafnc-campus-uat`; no unrelated database was deleted.

## Data model

`schema.sql` mirrors the active `vlab_*` namespace:
- vlab_users
- vlab_courses
- vlab_lessons
- vlab_scenarios
- vlab_sessions
- vlab_actions
- vlab_skill_scores
- vlab_quiz_results
- vlab_worksheets
- vlab_reflections
- vlab_feedback
- vlab_audit_logs

## Demo vs Production Security

Demo mode remains available so the Lab can be tried without login.

Important: the Student / Instructor / Admin switch in the current UI is for UX testing only. It is **not production authorization**. Before storing identifiable learner data, production server-side authentication, RBAC and permission tests are still required.

Do not put real learner or health data into Demo Mode.

## Validation evidence

Validated during implementation:
- TypeScript check and production build
- Cloudflare Workers production build
- Static asset deployment
- D1 binding present after deploy
- D1 read probe (`SELECT 1`) successful
- Active `vlab_*` schema inspected against Worker write fields

Remaining gates before calling the full platform Production Ready:
1. External-browser `/healthz` response verification
2. Real desktop interaction test
3. Real mobile Safari/Chrome interaction test
4. Slow-network / refresh / offline-resume test
5. Server-side authentication + RBAC
6. Permission test for Student / Instructor / Admin
7. Clinical content validation by course SME/instructor
8. E2E session write/read test through the public Worker endpoint

**No Evidence = Not Done.**
