---
name: sop-it-operations
description: Use when the user wants to create, rewrite, review, standardize, or audit SOPs, runbooks, work instructions, checklists, IT Support ticket flows, System Admin procedures, incident response, access control, backup/restore, patching, maintenance, SLA, KPI, evidence logs, or operational controls.
---

Create SOPs with a tight operational spine: **purpose -> scope -> roles -> flow -> procedure cards -> evidence -> KPI -> review**. Keep the SOP usable by a real operator, not pretty-but-vague.

## Operating loop

1. **Classify the SOP branch.** Choose one branch: `System Admin`, `IT Support Ticketing`, or `Generic IT Operations`. Identify the service/system, requester/user group, urgency, and expected evidence. Done when the branch and target process are named in one sentence.

2. **Build the spine before details.** Draft these sections in order: purpose, scope, terms, responsibility matrix, main process flow, SOP list, KPI, records/evidence, review cadence. Done when every section has either content or a visible `ต้องยืนยัน` marker.

3. **Normalize every procedure card.** Each SOP card must include: code, title, objective, trigger, steps, method, responsible role, evidence/records, control point, escalation/rollback, and KPI/SLA if relevant. Done when no card has a step without owner and evidence.

4. **Apply control gates.** Check each procedure against the control gates below. Add missing gates directly into the step where they matter.
   - Access: requester approval, identity check, least privilege, MFA/password policy, deprovisioning.
   - Change: change request, impact assessment, maintenance window, backup/snapshot, validation, rollback.
   - Incident: priority P1-P4, evidence collection, root cause note, workaround, escalation, closure confirmation.
   - Backup/restore: retention check, restore test, backup log, restore evidence, RPO/RTO note.
   - Audit: log source, reviewer, timestamp, KPI, report destination.
   Done when every control gate is either included or explicitly marked `ไม่เกี่ยวข้อง`.

5. **Ask only blocking questions.** If missing data blocks correctness, ask one sharp question. If it does not block, state the assumption and continue. Done when there is no unresolved blocker.

6. **Self-review as an operator.** Read the SOP as if doing the work at 02:00 during an incident. Fix any vague verb such as “ตรวจสอบ”, “ดำเนินการ”, or “ประสานงาน” by adding what to check, where, who owns it, and what evidence proves it. Done when a new operator could follow the SOP without asking the author.

## Canonical process flows

Use these as default flows unless the user gives a stronger local policy.

### System Admin flow

1. รับแจ้ง/Alert
2. ตรวจสอบข้อมูลและระบบที่เกี่ยวข้อง
3. จัดลำดับความสำคัญ
4. มอบหมายผู้รับผิดชอบ
5. ตรวจสอบสิทธิ์/Access
6. วิเคราะห์สาเหตุ
7. ดำเนินการแก้ไข
8. Backup/Snapshot ก่อนเปลี่ยนแปลง
9. ทดสอบผล
10. ยืนยันการกลับมาใช้งาน
11. บันทึกงาน/CMDB/KB
12. KPI/Review/Improve

### IT Support ticket flow

1. รับแจ้ง
2. เปิด Ticket
3. ตรวจสอบข้อมูล
4. จัดลำดับ P1-P4
5. มอบหมายเจ้าหน้าที่
6. วิเคราะห์ปัญหา
7. Remote Support
8. Onsite/เปลี่ยนอุปกรณ์
9. ทดสอบผล
10. ผู้ใช้ยืนยัน
11. ปิดงาน/บันทึก KB
12. KPI/Review/Improve

## Procedure catalogs

Use these codes when the user asks for SOP ฝ่ายไอที, System Admin, or IT Support.

### System Admin

- `SOP-SA-001` การจัดการผู้ใช้ สิทธิ์ และบัญชีผู้ดูแลระบบ: request, approval, RBAC, account/group creation, MFA/password policy, access test, CMDB/AD update, periodic review/deprovision.
- `SOP-SA-002` การดูแล Server / VM / Storage / Backup: health check, VM capacity, storage/log usage, backup/retention, restore test, snapshot before maintenance, abnormal issue coordination, daily/weekly report.
- `SOP-SA-003` การเฝ้าระวัง ตรวจสอบเหตุขัดข้อง และการแก้ไขเบื้องต้น: receive alert/incident, prioritize P1-P4, collect monitoring/event/syslog evidence, impact/root-cause preliminary analysis, restart/workaround, coordinate network/DBA/app/vendor, test, update incident/RCA status.
- `SOP-SA-004` การเปลี่ยนแปลงระบบ Patch และบำรุงรักษา: change request, impact/rollback plan, maintenance window notice, backup/snapshot, patch/firmware/config change, post-change validation, rollback, CMDB/version/patch record.
- `SOP-SA-005` ความปลอดภัย บันทึกเหตุการณ์ สำรอง/กู้คืน และ KPI: privileged/failed login audit, antivirus/EDR/vulnerability/patch compliance, daily backup result, restore test, abnormal event action plan, security/availability report, monthly KPI, SOP revision.

### IT Support Ticketing

- `SOP-IT-001` การรับแจ้งและเปิด Ticket: receive via portal/phone/email/LINE, verify requester and asset, categorize issue, auto-number ticket, notify ticket number, avoid duplicate ticket, attach screenshot/error, queue to helpdesk.
- `SOP-IT-002` การคัดแยกความเร่งด่วนและมอบหมายงาน: assess impact/urgency, assign P1-P4, check SLA, assign L1/L2/System/Network/App, notify stakeholders, escalate vendor if needed, update status, track within SLA.
- `SOP-IT-003` การวิเคราะห์ปัญหาและการแก้ไขเบื้องต้น: review ticket/asset history, contact user for symptoms, remote session with permission, initial account/network/software/hardware check, workaround, temporary root-cause note, test with user, escalate if not fixed.
- `SOP-IT-004` การเข้าหน้างาน เปลี่ยนอุปกรณ์ และส่งต่อ Vendor: schedule onsite, prepare spare device/parts, check authorization/data security, repair/replace device, backup/restore setting when needed, post-repair test, update asset tag/serial/location/warranty, handoff to vendor with service report.
- `SOP-IT-005` การปิดงาน ติดตามผล KPI และการปรับปรุงต่อเนื่อง: user confirms service works, record resolution code, calculate response/resolution time, close ticket after confirmation, send CSAT, analyze backlog/reopen, report monthly KPI, update KB/action plan.

## Terms and priority

- `Ticket` = รายการแจ้งปัญหาหรือขอรับบริการในระบบ Ticketing.
- `Incident` = เหตุการณ์ที่ทำให้บริการหรือระบบไอทีใช้งานไม่ได้ตามปกติ.
- `Service Request` = คำขอบริการทั่วไปที่ไม่ใช่เหตุขัดข้อง เช่น ขอสิทธิ์ ขออุปกรณ์.
- `P1` = วิกฤต กระทบผู้ใช้จำนวนมากหรือระบบหลักหยุดชะงัก.
- `P2` = สำคัญ กระทบหลายคน แต่ยังมีทางเลือกชั่วคราว.
- `P3` = ทั่วไป กระทบบางส่วนและรอการแก้ไขได้.
- `P4` = เล็กน้อย ไม่กระทบงานหลัก.
- `SLA Response Time` = เวลาสูงสุดที่ต้องเริ่มตอบกลับ.
- `Resolution Time` = เวลาสูงสุดที่ต้องแก้ไขให้เสร็จตาม SLA.
- `Escalation` = ส่งต่อปัญหาไปยังระดับที่สูงขึ้นเมื่อเกินขีดความสามารถหรือ SLA.
- `Workaround` = วิธีแก้ชั่วคราวเพื่อให้ผู้ใช้ทำงานต่อได้.
- `RPO` = จุดเวลาข้อมูลล่าสุดที่ยอมรับได้เมื่อกู้คืน.
- `RTO` = เวลาสูงสุดที่ยอมรับได้ในการกู้ระบบกลับมาใช้งาน.

## KPI defaults

Only use these as defaults. If the organization has official SLA/KPI, use that instead.

### System Admin KPI

| KPI | Target |
|---|---:|
| Server uptime | >=99.5% |
| Backup success rate | >=98% |
| Patch compliance | >=95% |
| Critical alert acknowledgement | <=15 min |
| Restore test success | 100% |
| Privilege review on time | 100% |

### IT Support KPI

| KPI | Target |
|---|---:|
| Response within SLA | >=95% |
| Resolution within SLA | >=90% |
| CSAT | >=4.5/5 |
| Reopen rate | <3% |
| Backlog aging >7 days | <5 tickets |

## Output format

When creating or rewriting an SOP, output in this order:

1. `ชื่อเอกสาร / Document Control` - version, owner, reviewer, approval, effective date, review cycle.
2. `วัตถุประสงค์` - one paragraph plus measurable outcome.
3. `ขอบเขต` - included systems, excluded systems, user groups.
4. `คำจำกัดความ` - only terms used in this SOP.
5. `โครงสร้างความรับผิดชอบ` - role -> duty -> backup role.
6. `Process Flow` - numbered flow or Mermaid diagram if requested.
7. `SOP Cards` - one table per SOP code.
8. `Records / Evidence` - logs, forms, screenshots, reports, ticket fields.
9. `KPI / SLA` - metrics, targets, source, owner, report cadence.
10. `Review / Improvement` - review trigger, monthly/quarterly review, change history.

## SOP card template

| Field | Content |
|---|---|
| SOP Code | SOP-XX-000 |
| Title |  |
| Objective |  |
| Trigger |  |
| Steps | 1. ... |
| Responsible |  |
| Evidence |  |
| Control Point |  |
| Escalation / Rollback |  |
| KPI / SLA |  |
| Definition of Done |  |

## Definition of done

The SOP is done only when:

- Every step has an owner and evidence.
- Every risk-sensitive action has an approval, backup, rollback, or escalation path.
- Ticket/CMDB/KB/log records are named where applicable.
- KPI/SLA targets have a data source and reporting owner.
- Assumptions are visible; invented local policy is not hidden as fact.
- A new operator can execute the SOP without asking the author what to do next.
