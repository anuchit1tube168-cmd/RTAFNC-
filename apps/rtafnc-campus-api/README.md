# RTAFNC Campus Core Read API — UAT

Read-only Cloudflare Worker facade for the existing `rtafnc-campus-uat` D1 database.

## Current source-of-truth

Google Drive remains authoritative during UAT. Cloudflare D1 is a reconciled runtime/read model, not a replacement source-of-truth.

Verified UAT posture on 2026-11-01:

- Active students: **252** (`Y1=64`, `Y2=64`, `Y3=61`, `Y4=63`).
- `student_id` is the 7-digit business key.
- Advisor group mapping: **252 students / 33 groups**, orphan 0.
- Advisor staff/account authorization: **BLOCKED** until a stable verified staff identifier is available. Name-only authorization is prohibited.
- Good Deed aggregate profile: **164 deeds / 42 students**, 162 approved, 2 rejected, 592.5 total hours, 42/42 IDs matched to active roster.
- Good Deed UAT projection copies no names, descriptions, approvers, locations, or images into the aggregate profile.
- Health migration: **BLOCKED_SEPARATE_APPROVAL**; patient rows are not copied into Campus CORE.
- Production write: **OFF**.
- Staff login: **OFF**.
- Advisor authorization: **OFF**.
- Legacy auth reuse: **OFF**.

## Existing Cloudflare resources

The account already contains the D1 database `rtafnc-campus-uat`. The account is currently at its D1 database-count limit, so this project reuses the existing UAT database and does **not** create or delete databases.

The existing `rtafnc-campus` Worker is already bound to that UAT database. This folder is designed for a separate, minimal read facade named `rtafnc-campus-core-read-uat` so the existing Worker does not need to be overwritten.

## Safety rules

- Google Drive masters are read-only sources during UAT.
- No Google Drive URLs/IDs, OAuth tokens, service-account keys, LINE secrets, passwords, health rows, or student records are committed here.
- Provider references remain private inside the existing D1/source synchronization process.
- `PRODUCTION_WRITE=false` is enforced in the public example and checked again against `system_config` at runtime.
- All non-GET requests return `403 production_write_off`.
- `/api/v1/sources` is disabled by default and, when enabled for controlled UAT, excludes provider references/URLs.
- No automatic D1 migration directory is configured in Wrangler.

## Read-only endpoints

- `GET /healthz` — verifies D1 reachability and fail-closed runtime posture.
- `GET /api/v1/core/summary` — aggregate student/staff/advisor mapping counts only.
- `GET /api/v1/good-deed/summary` — aggregate Good Deed profile only; no row-level PII.
- `GET /api/v1/sources` — non-sensitive source status only; disabled by default.

## UAT D1 contract

The existing UAT database already contains the operational schema. Relevant tables include:

- `source_registry`
- `system_config`
- `student_core_staging`
- `staff_core_staging`
- `advisor_group_assignments_staging`
- `advisor_bindings_staging`
- `integration_gates`
- `good_deed_source_profile`
- `sync_runs`

Files under `migrations/` in this folder are **contract fixtures for CI/disposable local validation only**. They are deliberately not connected to Wrangler migrations and must not be applied over the existing UAT database.

## Integration gates

Current gates intentionally remain conservative:

- CORE student identity: PASS.
- Advisor group mapping: PASS.
- Advisor staff identity binding: BLOCKED.
- HRIS account identity: BLOCKED.
- Good Deed profile/read adapter: validated aggregate-only read path.
- Health data migration: BLOCKED pending separate approval, RBAC and migration controls.

Production write is not authorized by this project.
