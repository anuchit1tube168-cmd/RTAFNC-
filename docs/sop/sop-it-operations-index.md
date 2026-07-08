# SOP IT Operations Index

เอกสารนี้เป็นสารบัญใช้งานจริงสำหรับ Skill `sop-it-operations` ใน repo `RTAFNC-`

## Main skill

- Skill path: `skills/sop-it-operations/SKILL.md`
- README path: `skills/sop-it-operations/README.md`

## ใช้เมื่อไหร่

ใช้ skill นี้เมื่อจะทำงานต่อไปนี้:

- สร้าง SOP ฝ่ายไอที
- ปรับคู่มือ IT Support ให้เป็น SOP ใช้งานจริง
- ตรวจ SOP ว่าขาด owner, evidence, rollback, SLA หรือ KPI ตรงไหน
- ทำ runbook สำหรับ System Admin
- ทำขั้นตอน incident / alert / monitoring
- ทำขั้นตอน backup / restore / patch / maintenance
- ทำมาตรฐาน ticket, priority P1-P4, SLA และ KPI

## SOP catalog

### System Admin

| Code | ชื่อ SOP | ใช้กับ |
|---|---|---|
| SOP-SA-001 | การจัดการผู้ใช้ สิทธิ์ และบัญชีผู้ดูแลระบบ | Account, RBAC, MFA, AD, access review |
| SOP-SA-002 | การดูแล Server / VM / Storage / Backup | Health check, capacity, backup, restore test |
| SOP-SA-003 | การเฝ้าระวัง ตรวจสอบเหตุขัดข้อง และการแก้ไขเบื้องต้น | Alert, incident, event log, syslog, RCA |
| SOP-SA-004 | การเปลี่ยนแปลงระบบ Patch และบำรุงรักษา | Change request, patch, firmware, rollback |
| SOP-SA-005 | ความปลอดภัย บันทึกเหตุการณ์ สำรอง/กู้คืน และ KPI | Audit log, EDR, vulnerability, KPI report |

### IT Support Ticketing

| Code | ชื่อ SOP | ใช้กับ |
|---|---|---|
| SOP-IT-001 | การรับแจ้งและเปิด Ticket | Portal, Phone, Email, LINE, ticket form |
| SOP-IT-002 | การคัดแยกความเร่งด่วนและมอบหมายงาน | P1-P4, SLA, assignment, escalation |
| SOP-IT-003 | การวิเคราะห์ปัญหาและการแก้ไขเบื้องต้น | Remote support, workaround, first diagnosis |
| SOP-IT-004 | การเข้าหน้างาน เปลี่ยนอุปกรณ์ และส่งต่อ Vendor | Onsite, spare device, asset tag, vendor report |
| SOP-IT-005 | การปิดงาน ติดตามผล KPI และการปรับปรุงต่อเนื่อง | Close ticket, CSAT, backlog, KB, KPI |

## Standard flow

### System Admin flow

```text
Alert -> Check system -> Prioritize -> Assign -> Check access -> Analyze cause -> Fix -> Backup/Snapshot -> Test -> Confirm service -> Record CMDB/KB -> Review KPI
```

### IT Support flow

```text
Receive -> Open ticket -> Verify info -> Prioritize P1-P4 -> Assign -> Analyze -> Remote support -> Onsite/replace -> Test -> User confirm -> Close/KB -> Review KPI
```

## Minimum evidence

ทุก SOP ต้องระบุหลักฐานอย่างน้อยหนึ่งอย่างต่อขั้นตอนสำคัญ เช่น:

- Ticket record
- Approval email / approval log
- Screenshot
- Monitoring alert log
- Event log / syslog
- Backup report
- Restore test report
- Change request
- Rollback plan
- CMDB update
- KPI report

## Definition of Done

SOP ถือว่าใช้ได้จริงเมื่อ:

1. ทุกขั้นตอนมีผู้รับผิดชอบ
2. ทุกขั้นตอนสำคัญมีหลักฐานตรวจสอบย้อนหลัง
3. งานเสี่ยงมี approval, backup, rollback หรือ escalation
4. มี SLA/KPI และแหล่งข้อมูลวัดผล
5. คนใหม่อ่านแล้วทำงานตามได้ ไม่ต้องเดา
