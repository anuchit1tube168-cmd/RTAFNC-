# AGIS State DB Schema

Version: v1.0  
Owner: AGIS + Archaeologist  
Storage: Google Sheet

## Purpose

ใช้ Google Sheet เป็นฐานข้อมูลสถานะงาน / skill map / receipt index เพื่อให้ AGIS จำได้ว่าใครถือ skill อะไร งานอยู่ตรงไหน และหลักฐานอยู่ที่ไหน

## Sheets

### 1. AgentSkillMap

| Field | Meaning |
|---|---|
| agent | ชื่อ Agent |
| role | บทบาทหลัก |
| primary_skills | skill หลัก |
| backup_skills | skill สำรอง |
| level | ระดับ |
| xp | คะแนนฝึก |
| status | training / active / standby / retired |
| last_test_date | วันที่ทดสอบล่าสุด |
| evidence_link | link หลักฐาน |

### 2. JobState

| Field | Meaning |
|---|---|
| mission_id | รหัสภารกิจ |
| project | โปรเจกต์ |
| status | backlog / doing / blocked / review / done |
| owner_agent | agent เจ้าของงาน |
| backup_agent | agent สำรอง |
| priority | P0/P1/P2 |
| risk | low/medium/high |
| current_step | ขั้นตอนปัจจุบัน |
| next_step | ขั้นตอนต่อไป |
| blocked_by | ติดอะไร |
| updated_at | อัปเดตล่าสุด |

### 3. ReceiptIndex

| Field | Meaning |
|---|---|
| receipt_id | รหัสหลักฐาน |
| mission_id | รหัสภารกิจ |
| skill_id | skill ที่ใช้ |
| agent | agent ที่ทำ |
| output_link | link ผลลัพธ์ |
| test_result | pass/fail/partial |
| evidence_link | link หลักฐาน |
| review_note | note ตรวจสอบ |
| created_at | วันที่สร้าง |

### 4. SkillRegistry

| Field | Meaning |
|---|---|
| skill_id | รหัส skill |
| skill_name | ชื่อ skill |
| priority | P0/P1/P2 |
| owner_agent | agent เจ้าของ skill |
| backup_agent | agent สำรอง |
| status | draft/training/field-tested/certified |
| version | version |
| level_up_path | ถ้าเก่งแล้วไปต่ออะไร |
| last_revision | วันแก้ล่าสุด |

## Current Google Sheet

Created in Google Drive as: `AGIS Agent Skill State DB`

## Rule

ทุก mission ต้องมีอย่างน้อย 1 แถวใน JobState และเมื่อจบต้องมี 1 แถวใน ReceiptIndex
