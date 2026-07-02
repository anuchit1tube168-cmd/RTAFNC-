# CLAUDE.md

Guidance for AI assistants (Claude Code and others) working in this repository.

## What this project is

**RTAFNC Student System** — a prototype for Royal Thai Air Force Nursing College
students, delivered through a **LINE Official Account + LINE LIFF** frontend with a
separate **Staff Console** for officers. The UI text is Thai; code identifiers and
comments are English.

**Current status: public demo repository.** The app runs in `demoMode: true` and stores
data in `localStorage`. The planned production stack (Supabase Postgres + Auth + RLS +
Private Storage, Edge Functions, LINE Messaging API, Telegram) exists as migrations,
edge functions, and docs but is **not yet activated**.

> **Never commit real student records, health records, credentials, or messaging tokens.**
> This repository is public. See "Security rules" below — CI actively scans for secrets.

## Repository layout

The **deployed application** is a small set of directories; the rest of the repo is
supporting material, docs, and unrelated sibling prototypes.

### Core application (what actually ships)

```
portal/index.html            Landing page / router served at /
apps/liff/                    Student LIFF frontend (mobile-first)
apps/admin/                   Staff Console
supabase/migrations/          Database schema + RLS policies (SQL)
supabase/functions/           Deno Edge Functions (server-side)
supabase/seed.sql, verify.sql Staging seed data and verification queries
deploy/                       Docker + nginx production image
docker-compose.yml            Local container run
tools/                        Preview server + SQL bundle builder
tests/static-contract.test.mjs  Static contract + secret checks (the test suite)
docs/                         Architecture, deployment, RLS, and gap-analysis docs
.github/workflows/            CI, quality, Pages deploy, SQL bundle
```

### Key files inside the apps

- `apps/liff/app-runtime.js` — **the active Student LIFF runtime** (loaded as a module by
  `index.html`). ~1000 lines: good-deed categories, hospital module, news, localStorage
  demo state, Supabase/LINE wiring.
- `apps/liff/interaction-hotfix.js` — activity registration + staff-news extensions layered
  on top of the runtime.
- `apps/liff/app.js` — **legacy; not referenced by `index.html` and not the entry point.**
  Do not add features here. Edit `app-runtime.js` instead.
- `apps/admin/app.js` — **the active Staff Console runtime** (admin has no `app-runtime.js`;
  `app.js` is its real entry point, loaded as a module).
- `apps/*/config.js` — generated/runtime browser config (see Configuration below).
- `apps/*/config.example.js` — the template; browser-safe identifiers only.

### Supporting / sibling content (not part of the deployed app)

`skills/` (a "control plane" of numbered `SKILL.md` design docs), `ai-playground-os/`,
`gsef01/`, `free-webapp/`, `good-deed-*.html`, `readtoon-style-reader/`, `scholarship/`,
`specific-procurement-system/`, `portal` siblings, `Javis--main.zip`. Treat these as
separate prototypes/documentation — don't assume changes there affect the LIFF/admin app
or its CI. When a task says "the app," it means `portal` + `apps/liff` + `apps/admin` +
`supabase`.

## Development workflow

### Local preview (no build step)

The frontend is plain HTML/CSS/vanilla JS — no bundler, no `node_modules`.

```bash
python3 tools/preview_server.py --port 5500
# Student LIFF: http://localhost:5500/liff/
# Staff Admin:  http://localhost:5500/admin/
# Portal:       http://localhost:5500/
```

### Run the production container locally

```bash
cp .env.example .env      # fill browser-safe values; keep DEMO_MODE=true for demo
./deploy/start.sh         # or: docker compose up --build -d
# http://localhost:8080/  (+ /liff/, /admin/, /healthz)
```

The nginx image (`deploy/Dockerfile`) copies `portal`, `apps/liff`, `apps/admin` and, at
container start, `deploy/40-rtafnc-runtime-config.sh` regenerates each app's `config.js`
from environment variables. It listens on **8080** and serves `/healthz`.

### Tests and checks (run these before pushing)

There is no unit-test framework; the "test suite" is a static contract check plus syntax
checks — the same commands CI runs:

```bash
# Static contract + secret scan (the main check)
node tests/static-contract.test.mjs

# JS syntax (must pass for every runtime file)
node --check apps/liff/app-runtime.js
node --check apps/liff/interaction-hotfix.js
node --check apps/liff/config.js
node --check apps/admin/app.js
node --check apps/admin/interaction-hotfix.js
node --check apps/admin/config.js

# Preview server syntax
python3 -m py_compile tools/preview_server.py
```

`tests/static-contract.test.mjs` is a **contract** — it hard-fails if you rename or remove
expected functions or constants. If you touch the runtime, keep these intact (or update the
test deliberately):
- LIFF must contain good-deed codes `GD01`–`GD08` and functions `submitGoodForm`,
  `submitHospitalForm`, `validateFiles`, `uploadAttachments`, `authenticateMember`,
  `loadPrivateData`, `markNewsRead`.
- Admin must contain `viewDeed`, `viewHospital`, `openNewsForm`, `openStudentForm`,
  `generateCode`, `logAudit`, `queueNotification`, `openImportStudents`, `auditPage`.
- `apps/liff/config.js` must keep `demoMode: true`.
- The edge functions must keep their server-side contracts (LINE token verification URL,
  `SUPABASE_SERVICE_ROLE_KEY`, atomic linking RPC, notification worker secrets, etc.).

### CI (GitHub Actions, on push/PR to `main`)

- **`ci.yml`** — JS/py syntax, required-file checks, secret scan, builds the Docker image,
  starts it, and smoke-tests `/healthz`, `/`, `/liff/`, `/admin/`.
- **`quality.yml`** — JS syntax + `tests/static-contract.test.mjs` + required production files.
- **`pages.yml`** — deploys the demo to GitHub Pages (only when `apps/**`, `supabase/**`,
  select docs, or `tests/**` change). Publishes `apps/liff` at `/` and `apps/admin` at
  `/admin-demo/`, writes `health.json`.
- **`build-staging-sql.yml`** — runs `tools/build_staging_sql.py` to bundle migrations +
  seed + verify into `dist/rtafnc-staging-bootstrap.sql` (workflow_dispatch / on SQL changes).

### Database work

Migrations are ordered and run in sequence on a **new** Supabase project:
`0001_core_schema.sql` (tables, 8 good-deed categories, private buckets, deny-by-default
RLS) → `0002_line_member_auth.sql` (verified LINE membership + student RLS) →
`0003_staff_roles_and_policies.sql` (staff roles) → the `202606*` migrations (atomic
activation-code linking RPC, notification delivery/retry state). Build the staging bundle
with `python3 tools/build_staging_sql.py`. See `docs/DATABASE_BOOTSTRAP.md`. Never run
`seed.sql` in production.

## Configuration model

- **Browser config is generated, not hand-committed for production.** `config.js` in each
  app holds only browser-safe identifiers (`supabaseUrl`, `supabasePublishableKey`/publishable
  key, `liffId`, `lineOaId`, `demoMode`, `defaultSemester`). In the container these are
  written at startup from env vars; for local static preview, copy from `config.example.js`.
- Runtime reads config via `window.RTAFNC_CONFIG` (LIFF) / `window.RTAFNC_ADMIN_CONFIG` (admin),
  with safe defaults (`demoMode` defaults to `true`).
- **Server secrets never go in the repo or in browser config.** `SUPABASE_SERVICE_ROLE_KEY`,
  `LINE_CHANNEL_ID/SECRET/ACCESS_TOKEN`, `TELEGRAM_BOT_TOKEN`, Google service-account JSON,
  and DB passwords live only in Supabase Function Secrets / server env.

## Conventions

- **No build tooling for the frontend.** Vanilla JS modules, hand-written CSS. Match the
  existing style in the file you're editing; runtime scripts use frozen config objects and
  plain DOM manipulation.
- **Cache-busting** is done via `?v=YYYYMMDD-N` query strings on `<link>`/`<script>` in the
  `index.html` files. Bump the version when changing a CSS/JS asset that browsers cache.
- **UI copy is Thai; code is English.** Keep user-facing strings in Thai, identifiers and
  comments in English, consistent with existing files.
- **Edge functions** are Deno/TypeScript (`supabase/functions/*/index.ts`) — server-side only.
- **Commits**: short imperative subject lines (e.g. "Add Vercel deployment config").

## Security rules (do not violate)

- Never commit real student/health data, credentials, tokens, or DB passwords. CI scans for
  `sk-proj-*`, `SUPABASE_SERVICE_ROLE_KEY=`, `LINE_CHANNEL_SECRET=`, `TELEGRAM_BOT_TOKEN=`,
  postgres connection strings, etc. — a match **fails the build**.
- Browser code may contain only public identifiers, and only after RLS is verified.
- Staff-UI role checks are **not** a security boundary — real enforcement is Auth + RLS.
- LINE profile / `liff.getProfile()` is display-only; identity must be verified server-side
  from the raw LINE ID token by the `line-auth` edge function.
- Hospital records need stricter policies than good-deed data; staff access to hospital
  records must be audited.

## Production activation gate

Keep `demoMode: true` until **all** gates in `docs/PRODUCTION_GAP_ANALYSIS.md`,
`docs/SETUP.md` (§5), and `docs/RLS_TEST_MATRIX.md` pass: server-side LINE token verification,
one-LINE-account-to-one-student linking, proven RLS isolation, hospital access restricted to
owner + medical roles, private files behind signed URLs, staff-access audit logs, and secrets
stored only in server config.

## Where to look

- Architecture / setup: `README.md`, `docs/SETUP.md`
- Production readiness: `docs/PRODUCTION_GAP_ANALYSIS.md`, `docs/PRODUCTION_ACTIVATION.md`
- Deployment: `docs/DEPLOYMENT_RUNBOOK_TH.md`, `deploy/`
- Database: `docs/DATABASE_BOOTSTRAP.md`, `docs/RLS_TEST_MATRIX.md`, `supabase/`
- Design/spec "skills": `skills/README.md`, `skills/CONTROL_MATRIX.md`, `skills/*/SKILL.md`
