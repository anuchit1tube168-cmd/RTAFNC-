# Vital Signs Virtual Learning Lab

Interactive 3D Educational Simulation สำหรับนักเรียนพยาบาลทหารอากาศ — บทเรียนแรก **การวัดและประเมินสัญญาณชีพ**

> Status: Phase 1–5 implementation candidate. ห้ามถือว่า Production Ready จนกว่า CI build, browser QA, mobile QA และ Cloudflare `/healthz` deployment จะผ่านจริง

## Learning Outcomes

### Knowledge
- อธิบายวัตถุประสงค์และการแปลผล Vital Signs ในบริบทผู้ป่วยจำลอง
- เชื่อมโยง Temperature, BP, Pulse, SpO₂ และ RR กับอาการของผู้ป่วย

### Skills
- เตรียมผู้ป่วยและอุปกรณ์
- ใช้ Thermometer, BP cuff, Pulse oximeter และ Stethoscope ตามลำดับที่เหมาะสม
- บันทึกผลการประเมิน

### Clinical / Professional Reasoning
- ตรวจพบค่าที่ควรติดตาม
- เลือก Reassess + Report แทนการละเลยหรือเริ่มการรักษาเกินขอบเขต

### Safety
- Hand hygiene ก่อนสัมผัสผู้ป่วย
- ยืนยันตัวผู้ป่วยก่อนหัตถการ
- บันทึก Critical Error เมื่อข้าม Safety Gate

### Communication
- สื่อสารกับผู้ป่วยจำลองและรายงานผลตามบทบาท

### Professionalism
- บันทึกข้อมูลครบถ้วนและไม่สร้างค่าที่ไม่ได้ประเมิน

## Core Learning Loop

`Enter → Briefing → Assessment → Decision → Intervention → Response → Evaluation → Debriefing`

ทุก interaction หลักใช้กติกา:

`Action → State Change → Result → Feedback → Score / Event Log`

## 3D Environment

React Three Fiber scene มีพื้น ผนัง เตียง ผู้ป่วย โต๊ะ และวัตถุ Interactive:
- Alcohol Hand Rub
- Patient ID
- Thermometer
- Blood Pressure Cuff
- Pulse Oximeter
- Stethoscope
- Digital Worksheet

ผู้เรียนหมุนกล้อง 360°, Zoom, Pan, เลือก และใช้วัตถุได้

## Assessment Domains

- Knowledge
- Skill
- Clinical Reasoning
- Safety
- Communication
- Time Management
- Professionalism

Critical errors ถูกเก็บใน session state และนำไป Debriefing

## Included UX

- Interactive Tutorial
- Start / Pause / Resume / Reset
- Decision-based branching
- Immediate feedback
- Digital Worksheet + autosave
- 5-question Quiz
- Student Dashboard
- Teacher Dashboard (Demo current-session data)
- Debriefing Timeline vs Recommended Path
- Responsive desktop/tablet/mobile
- Reduced-motion support

## Persistence

### Demo Mode
Zustand persist → browser localStorage key `rtafnc-vital-signs-lab-v1`

### Cloudflare API
- `GET /healthz`
- `POST /api/session`
- `POST /api/events`
- `GET /api/sessions`

If D1 is not bound, the Worker returns Demo Local mode without pretending server persistence succeeded.

### D1
`schema.sql` contains tables for users, courses, lessons, scenarios, sessions, actions, skill_scores, quiz_results, worksheets, reflections, feedback and audit_logs.

## Cloudflare

Uses the Cloudflare Vite plugin + Workers Static Assets. `wrangler.jsonc` configures SPA fallback and runs the Worker first for `/api/*` and `/healthz`.

Deployment command after QA:

```bash
npm install
npm run build
npx wrangler d1 create rtafnc-vital-signs-lab-db
# add the returned D1 database_id binding to wrangler.jsonc
npx wrangler d1 execute rtafnc-vital-signs-lab-db --file=./schema.sql --remote
npm run deploy
```

## Security / RBAC status

- Demo UI exposes role switch only for UX testing; it is **not** production authorization.
- Production RBAC must be enforced server-side before real learner data is stored.
- No secrets are embedded in the frontend.
- Real learner/health data must not be used in Demo Mode.

## Required gates before “Done”

1. `npm run check`
2. `npm run build`
3. Desktop functional test
4. Mobile functional test
5. Start/Pause/Reset test
6. Interactive object/action test
7. Branching decision test
8. Worksheet autosave + refresh test
9. Quiz scoring test
10. Browser refresh / slow-network test
11. Cloudflare deploy
12. `/healthz` returns `ok:true`
13. D1 save/read test
14. RBAC/permission test with production auth

No Evidence = Not Done.
