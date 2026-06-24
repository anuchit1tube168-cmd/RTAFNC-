# workflow-map.md — AI Playground OS Flow

แผนภาพการทำงานรวมของโปรเจกต์ Clip → Research → GitHub Agent → Prototype

---

## Main Flow

```mermaid
flowchart TD
A[Clip / Idea / Live / Screenshot] --> B[Clip Intake Room]
B --> C[Clip Brief]
C --> D[Deep Research Room]
D --> E[Research Note]
E --> F[Skill Factory]
F --> G[SKILL.md / SOP / Prompt]
G --> H[GitHub Factory]
H --> I[GitHub Issue]
I --> J[Codex / Claude / GPT]
J --> K[Prototype Studio]
K --> L[index.html / Web App]
L --> M[Human Review]
M --> N[Deploy]
N --> O[Command Center]
O --> B
```

---

## RTAFNC Safe Flow

```mermaid
flowchart TD
A[RTAFNC Work Request] --> B[Classify Data]
B --> C{Sensitive?}
C -- No --> D[Static Prototype with Mock Data]
C -- Yes --> E[Private Backend / Apps Script / Drive Permission]
D --> F[Human Review]
E --> F
F --> G[Approve]
G --> H[Deploy]
H --> I[Monitor]
```

---

## Data Boundary

| Layer | ใช้ทำอะไร | ข้อมูลที่อนุญาต |
|---|---|---|
| GitHub Pages | prototype / demo / dashboard mock | mock data, public docs |
| GitHub Issues | task / acceptance criteria | requirement, non-sensitive summary |
| Google Apps Script | backend / workflow | controlled data with permission |
| Google Drive | files / evidence | private folder permission |
| LINE LIFF | user interaction | auth-bound user data |
| Command Center | status / KPI | aggregated / anonymized data |

---

## Standard Sprint Loop

```text
1. Intake: รับคลิป/ไอเดีย
2. Brief: ถอดเป็น Clip Brief
3. Research: ตรวจแหล่งข้อมูล
4. Plan: เขียน flow + folder + issue
5. Build: ให้ AI coding agent ทำเฉพาะ issue
6. Review: ตรวจมือถือ/console/security
7. Deploy: เปิดหน้า GitHub Pages หรือ backend
8. Improve: เก็บ feedback กลับเข้า board
```

---

## What Not To Do

- ห้ามเอา token/API key ใส่ใน `index.html`
- ห้ามใช้ GitHub Pages เก็บข้อมูลจริง
- ห้ามสร้าง issue ใหญ่แบบ “ทำทั้งหมดให้เสร็จ”
- ห้ามปล่อย AI แก้ทั้ง repo โดยไม่จำกัดไฟล์
- ห้ามให้ระบบอนุมัติข้อมูล sensitive อัตโนมัติโดยไม่มีคนตรวจ

---

## Next Workflow Upgrade

1. เพิ่ม localStorage ให้หน้า prototype จำข้อมูลได้ในเครื่อง
2. เพิ่ม export/import JSON
3. เพิ่ม print/export markdown
4. เพิ่ม GitHub issue copy format หลายแบบ
5. แยก `app.js` และ `styles.css` เมื่อ prototype ใหญ่ขึ้น
6. ต่อ Apps Script เฉพาะเมื่อ workflow นิ่งแล้ว
