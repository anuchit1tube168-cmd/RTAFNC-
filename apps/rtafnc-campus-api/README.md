# RTAFNC Campus API — Staging Core

Cloudflare Worker + D1 staging backend for the RTAFNC Campus portal.

## Safety posture

- Production write: **OFF**
- Google Drive masters remain source-of-truth during UAT.
- No Google Drive file IDs, OAuth tokens, service-account keys, LINE secrets, passwords, health data, or student records are committed to GitHub.
- Health remains a separate domain and is not copied into CORE during this stage.
- Advisor authorization must use verified staff identity; display-name matching alone is not authorization.

## Current vertical slice

`Google Drive masters (read-only) -> verified import/sync -> D1 CORE staging -> read-only Worker API -> portal`

CORE covers:

- 7-digit student identity
- verified staff identity
- advisor bindings
- source registry
- sync audit trail

Good Deed and Health are registered as known domains but are intentionally not imported into CORE yet.

## Source aliases

The database stores logical source keys in public migrations. Real provider references are injected privately during environment setup.

- `DRIVE_STUDENT_MASTER_2569`
- `DRIVE_HRIS_MASTER_2569`
- `DRIVE_ADVISOR_MASTER_2569`
- `DRIVE_GOOD_DEED_2569`
- `DRIVE_HEALTH_MASTER_2569`

## Read-only endpoints

- `GET /healthz`
- `GET /api/v1/sources` — staging-only metadata; no provider references
- `GET /api/v1/core/summary` — aggregate counts only

All non-GET requests return `403 production_write_off`.

## D1 schema

`migrations/0001_core.sql` creates:

- `source_registry`
- `sync_runs`
- `core_students`
- `core_staff`
- `advisor_bindings`
- `audit_events`

`migrations/0002_seed_source_registry.sql` adds logical source aliases without exposing private Drive IDs.

## Staging deployment gate

1. Create `rtafnc-campus-core-staging` in Cloudflare D1.
2. Copy `wrangler.example.jsonc` to a non-public deployment config or inject the real D1 binding through Cloudflare/GitHub environment configuration.
3. Apply D1 migrations remotely.
4. Keep `PRODUCTION_WRITE=false`.
5. Inject provider references privately.
6. Run the Drive-to-D1 importer in read-only mode.
7. Reconcile counts/checksums before enabling any protected read route.
8. Run cross-role RBAC tests before Good Deed or Health integration.

Production deployment/write is not authorized by this scaffold.
