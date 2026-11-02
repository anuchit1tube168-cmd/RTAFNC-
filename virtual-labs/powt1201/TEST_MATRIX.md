# TEST MATRIX — พอวท 1201 Virtual Learning Lab v0.2.0

Date: 2026-11-02
Environment: `rtafnc-mt1-virtual-lab-v2-staging`
Production write: **OFF**

| Gate | Status | Evidence / note |
|---|---|---|
| Source course/CLO | PASS | Course Master: พอวท 1201, CLO1 บุคคลท่ามือเปล่า |
| Drill catalog | PASS | 20 drills match the controlled 2569 CLO1 assessment |
| Score conversion | PASS (code review) | raw /60 → CLO1 /40, rounded to 2 decimals |
| Separate lab analytics | PASS (code review) | analytics /100 is explicitly not official course score |
| Cloudflare deploy | PASS | staging Worker uploaded successfully |
| Worker subdomain enabled | PASS | workers.dev enabled; preview URLs disabled |
| KV binding | PASS | `LAB` binding present; keys namespaced `mt1v2:*` |
| Observability | PASS | logs enabled, persisted, query strings redacted |
| Production writes | PASS | no production DB write; Demo/UAT KV only |
| `/healthz` handler | PASS (code/deploy inspection) | endpoint returns version/env/storage and `productionWrite:false` |
| `/healthz` external request | NOT VERIFIED | current ChatGPT web runtime cannot access this workers.dev URL |
| Landing page external render | NOT VERIFIED | requires external browser smoke test |
| Thai rendering | NOT VERIFIED E2E | UTF-8 + Thai source is present, visual browser check still required |
| 3D scene | PASS (code inspection) / NOT VERIFIED E2E | Three.js scene, camera rotate/zoom, interactive object implemented |
| Start/Pause/Reset | PASS (code inspection) / NOT VERIFIED E2E | event/state handlers implemented |
| 20 actions → state change | PASS (code inspection) / NOT VERIFIED E2E | all drill buttons map to pose/action logic |
| Quiz | PASS (code inspection) / NOT VERIFIED E2E | 10 questions, server-side answer scoring |
| Worksheet save | PASS (code inspection) / NOT VERIFIED E2E | KV persistence with input length limit |
| Reflection save | PASS (code inspection) / NOT VERIFIED E2E | KV persistence with input length limit |
| Student dashboard | PASS (code inspection) / NOT VERIFIED E2E | active-session-only data |
| Instructor dashboard | PASS (code inspection) / NOT VERIFIED E2E | aggregate demo telemetry only; no real student data |
| Debriefing timeline | PASS (code inspection) / NOT VERIFIED E2E | ordered event timeline endpoint implemented |
| Mobile responsive | PASS (CSS inspection) / NOT VERIFIED DEVICE | responsive panels/actions defined |
| Accessibility | PARTIAL | focus visible + reduce-motion supported; screen-reader/keyboard audit pending |
| Slow network | NOT VERIFIED | browser/network-throttling test pending |
| Refresh/session continuity | PASS (code inspection) / NOT VERIFIED E2E | demo session ID stored in localStorage |

## Release decision

Status: **STAGING READY FOR BROWSER UAT — NOT FINAL RELEASE**.

Do not promote or merge as final until the external browser smoke gates are executed and recorded. Do not enable real-student writes until RBAC/auth and approved storage ownership are defined.
