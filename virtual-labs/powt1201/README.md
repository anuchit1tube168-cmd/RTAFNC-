# พอวท 1201 — การฝึกทหาร 1 Virtual Learning Lab

Interactive 3D Educational Simulation สำหรับนักเรียนพยาบาลทหารอากาศ ชั้นปีที่ 1 ปีการศึกษา 2569

## Source lock
- Course: `พอวท 1201 การฝึกทหาร 1 / AFMS 1201 Military Training 1`
- First lesson: `CLO1 บุคคลท่ามือเปล่า`
- Source assessment: 20 drills, raw max 60, weighted CLO1 max 40
- Conversion: `ROUND(raw × 40 / 60, 2)`
- Source course pass rule remains ≥60% and grade ≥C. The lab does **not** change the approved course rule.

## Core learning loop
`Enter → Briefing → Assess → Decide → Practice → State change → Feedback → Assessment → Reflection → Debriefing`

Every meaningful interaction is logged as `Action → State Change → Result → Feedback → Score / Log`.

## Architecture
- React + TypeScript
- Three.js + React Three Fiber + Drei
- Vite
- Cloudflare Worker API
- Cloudflare KV (`LAB`) for Demo/UAT sessions
- Static assets on Cloudflare Workers

D1 is not required for the first UAT release because the account currently has no free D1 database slot. The existing `rtafnc-campus-uat` contains `vlab_*` tables, but this project does not write to them until storage ownership and RBAC are explicitly approved.

## Privacy / RBAC posture
- Demo mode does not use real student identities.
- Student dashboard reads only the active session.
- Instructor dashboard is aggregate Demo/UAT telemetry only.
- No student-to-student data visibility.
- No secret is embedded in the frontend.

## Score separation
Two score surfaces are intentionally separate:
1. **CLO1 simulation evidence**: 3/2/1 level per drill → raw /60 → weighted /40.
2. **Lab Analytics /100**: learning analytics only; not an official course grade.

The simulation is a practice tool and does not replace instructor field assessment.

## Run
```bash
npm install
npm run dev
```

## Build / deploy
```bash
npm run build
npx wrangler deploy
```

## Required release checks
- `/healthz` returns `ok: true`
- Thai text renders correctly
- 3D scene loads and camera rotates/zooms
- Start/Pause/Reset work
- all 20 drill actions trigger state changes
- quiz scores correctly
- worksheet/reflection save
- student dashboard reads the current session
- instructor dashboard shows aggregate demo data only
- mobile layout remains usable
- browser refresh keeps the demo session ID
- no real student data or production write path is enabled
