# SEASON_ISLAND_SCENE_ENGINE — Job/Season/Island Scene System

## Purpose
สร้างระบบเปลี่ยนฉากตามประเภท Job, ภาระงาน, difficulty, season และ mission progress โดยยังคงเป็นจักรวาล original ของ AGIS

## Core Idea
ทุก Job = เกาะหนึ่งเกาะ / Island Arc
ทุก Mission = ด่านย่อยบนเกาะ
ทุก Season = ระดับการเติบโตของกองเรือ
ทุก Blocker = พายุ / ศัตรู / เขตอันตราย
ทุก Receipt = สมบัติที่เก็บได้

## Scene Switching Logic

### By Job Type
| Job Type | Scene Theme | Use When |
|---|---|---|
| Build/WebApp | Shipyard Island | สร้างเว็บ ระบบ prototype deploy |
| Research/SOP | Ancient Library Island | อ่าน Drive, SOP, PDF, knowledge |
| Data/Sheet | Data Reef Island | วิเคราะห์ sheet, big data, dashboard |
| Video/Content | Studio Deck Island | ตัดคลิป script subtitle storyboard |
| Marketing/SEO/Shopee | Market Port Island | ขายของ SEO affiliate hook |
| QA/Audit | Storm Checkpoint | ตรวจ bug, evidence, risk |
| Governance/Risk | Council Harbor | approval, legal, policy, privacy |
| Scale/Expert | Alliance Gate | recruit specialist, expert, council |

### By Difficulty
| Difficulty | Scene Weather |
|---|---|
| E/D | Calm Sea |
| C/B | Windy Route |
| A | Storm Route |
| S | Red Storm Zone |
| SS | Final Ocean Crisis |

### By Status
| Status | Visual State |
|---|---|
| Intake | crew gathers on deck |
| Routing | map table active |
| Working | agent animations running |
| Review | QA lantern / checkpoint |
| WaitingApproval | captain gate locked |
| Done | treasure chest open |

## Season Progression
| Season | Meaning | Visual Direction |
|---|---|---|
| Season 1 Rookie Sea | เริ่มระบบ P0 | small ship, simple deck |
| Season 2 Grand Route | เริ่มมี Job Board | bigger map room |
| Season 3 Sky Current | Level/Clone active | floating islands / clone portals |
| Season 4 Water Forge | Builder/Deploy mature | shipyard / machine deck |
| Season 5 New Horizon | Google Drive Big Data | ancient archive island |
| Season 6 Warrior Mastery | Senior Skill MD | training island / mastery aura |
| Season 7 Final Ocean | Enterprise scale | emperor council / command fleet |

## Character Movement
- Captain moves to command wheel when job starts
- Navigator walks to map table for routing
- Knowledge agent moves to archive shelf
- Builder moves to forge/workbench
- QA agent moves to checkpoint
- Governance agent stands at approval gate
- Story agent walks to logbook

## Dialogue System
ทุก scene ควรมี bilingual dialogue:
- TH: สั้น ชัด ใช้งานจริง
- EN: สั้น ใช้เป็น system log หรือ export

Example:
Captain: "เป้าหมายงานนี้คืออะไร?" / "What is the One Goal?"
Navigator: "กำลังเลือกเส้นทางและแจกภารกิจ" / "Routing missions now."
Doctor: "ยังปิดงานไม่ได้ เพราะไม่มี evidence" / "Cannot close without evidence."

## Production Asset Rule
ใช้ 3D pixel original characters เท่านั้น ห้ามทำเหมือนตัวละครที่มีลิขสิทธิ์แบบเป๊ะ
