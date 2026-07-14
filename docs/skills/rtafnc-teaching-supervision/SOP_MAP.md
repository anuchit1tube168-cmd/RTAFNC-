# SOP-to-System Mapping

| SOP Section | System Module | Control | Test evidence |
|---|---|---|---|
| 4 บทบาทและสิทธิ์ | Auth/RBAC | Least Privilege | role matrix tests |
| 5 ภาพรวมระบบ | Dashboard | source date + real metrics | dashboard calculation tests |
| 6 ขั้นตอน 1–4 | Form header | person/evaluator validation | self-evaluation and duplicate tests |
| 6 ขั้นตอน 5 | PA4 scoring | score 1–5, complete 12 items | boundary and missing-score tests |
| 6 ขั้นตอน 6 | Attachments | 2 images, type/size | upload validation tests |
| 6 ขั้นตอน 7 | Draft/Submit | status transition | draft persistence and submit lock tests |
| 6 ขั้นตอน 8 | Completion | 0/3–3/3 | level status tests |
| 6 ขั้นตอน 9 | Summary | submitted only | average and filter tests |
| 6 ขั้นตอน 10 | Reports | A4, signatures, evidence | print preview tests |
| 10 Security | Users/Data | RBAC, privacy, backup | access and restore tests |
| 11 Audit | Audit Log | append-only events | before/after and actor tests |
| 12 Incidents | Support | error handling | failure/recovery drill |
| 13 KPI | Dashboard/Reports | agreed formula | formula reconciliation |

เมื่อระบบเปลี่ยนพฤติกรรมที่มีผลต่อขั้นตอน ผู้รับผิดชอบ สิทธิ์ คะแนน หลักฐาน หรือรายงาน ต้องอัปเดต SOP และ mapping นี้ใน release เดียวกัน
