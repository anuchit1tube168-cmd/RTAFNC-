# Project Context

## Project identity

- Project: ระบบนิเทศการสอน วิทยาลัยพยาบาลทหารอากาศ กรมแพทย์ทหารอากาศ
- Organization: วิทยาลัยพยาบาลทหารอากาศ กรมแพทย์ทหารอากาศ
- Abbreviation: วพอ.พอ.
- Academic year: 2569
- Current release: WebApp MVP v3 + SOP v1.0

## Official data sources

| Source | Status | Notes |
|---|---|---|
| ตรา วพอ. PNG | available | ใช้กับ UI และรายงาน |
| รายชื่อบุคลากร ก.ค. 2569 | available | 103 ราย |
| รายชื่อ นพอ. ปี 2569 | available | 252 ราย |
| คู่มือนักเรียนพยาบาลทหารอากาศ 2566 | available | อัตลักษณ์ ค่านิยม ข้อมูลสถาบัน |
| PA4 ฉบับอนุมัติล่าสุด | must verify | ห้ามประกาศเกณฑ์สุดท้ายโดยไม่ตรวจฉบับอนุมัติ |
| SOP ระบบนิเทศ v1.0 | draft | ร่างเพื่อพิจารณาอนุมัติ |

## Current application state

- Single-file HTML + localStorage
- Responsive UI
- RTAFNC logo and full official title
- Three-level evaluation flow
- PA4 mockup 12 indicators
- Dashboard, completion, summary, reports and audit mockup

## Known production gaps

- No real authentication or server-side validation
- No multi-user concurrency
- No Drive upload API from the app
- No append-only audit database
- No approved PA4 configuration registry
- No automated backup/restore

## Design language

RTAF blue/navy/white, Noto Sans Thai for web, TH Sarabun New/PSK 16 pt for formal documents when available.
