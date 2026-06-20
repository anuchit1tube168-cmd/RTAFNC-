# RTAFNC Production Gap Analysis

Updated: 20 June 2026

## Executive status

The repository now contains a complete interactive **demo workflow** for:

- Student LIFF portal
- Good-deed records with all 8 categories
- Hospital/health records separated from good deeds
- News acknowledgement
- Staff good-deed approval queue
- Medical-role review panel
- News management
- Student registry and activation-code generation
- Audit log and notification queue simulation

The system is **not production-ready** until the external services and security controls below are deployed and tested.

## Critical findings

### 1. GitHub Pages publishing

Status: **Blocked by repository setting**

The workflow is ready to publish the Student LIFF at the site root and a safe staff demo under `/admin-demo/`. GitHub Pages must be enabled with:

```text
Settings → Pages → Source → GitHub Actions
```

A successful workflow must complete all steps:

1. Checkout
2. JavaScript syntax validation
3. Prepare static artifact
4. Configure Pages
5. Upload artifact
6. Deploy Pages

Public URL:

```text
https://anuchit1tube168-cmd.github.io/RTAFNC-/
```

Health endpoint after deployment:

```text
https://anuchit1tube168-cmd.github.io/RTAFNC-/health.json
```

### 2. LINE LIFF identity

Status: **Code prepared, credentials not configured**

Required:

- Create or select a LINE Login channel
- Add a LIFF app with `openid` and `profile` scopes
- Set the LIFF Endpoint URL to the final GitHub Pages root URL
- Put only the LIFF ID in `apps/liff/config.js`
- Deploy `supabase/functions/line-auth`
- Set `LINE_CHANNEL_ID` as an Edge Function secret

The browser must send the raw ID token from `liff.getIDToken()` to the server. The server must verify it with LINE before trusting the LINE user ID.

### 3. Supabase database

Status: **Frontend integration points prepared; project values not configured**

Required browser values:

- Supabase Project URL
- Supabase Publishable Key

Required server-side secrets:

- Supabase service-role key
- Database password

Required checks:

- All user-facing tables have RLS enabled
- Every table has explicit role-based policies
- Hospital policies are stricter than good-deed policies
- No service-role key is present in frontend code or Git history
- Anonymous authentication is enabled only when the `line-auth` flow requires it

### 4. Private file storage

Status: **Upload code prepared; buckets and policies not verified**

Required buckets:

- `good-deed-files` — private
- `hospital-files` — private
- `student-documents` — private
- `public-news` — public only for non-sensitive announcements

Private object paths must start with the student's UUID:

```text
<student_uuid>/<reference_uuid>/<random_uuid>-<safe_filename>
```

Required policy tests:

- Student A cannot list or download Student B files
- Good-deed reviewer cannot access hospital files
- Medical role cannot access unrelated private files unless explicitly allowed
- Signed URLs are short-lived
- Removing a database row does not accidentally leave unrestricted files

### 5. Staff authentication and authorization

Status: **Demo role switch only**

The public staff demo role switch is for UI testing only. Production must use:

- Supabase Auth session
- `user_roles` table
- Server-verified role claims or database role lookup
- Route guard before rendering restricted pages
- RLS as the final security boundary

Required roles:

- `student`
- `good_deed_reviewer`
- `medical`
- `registrar`
- `news_editor`
- `admin`
- `auditor`

### 6. Activation-code linking

Status: **Edge Function implemented; concurrency testing still required**

Required tests:

- Code is single-use
- Expired code is rejected
- Deactivated code is rejected
- One LINE account cannot link to multiple students
- One student cannot link to multiple LINE accounts
- Concurrent requests cannot consume the same code twice
- Linking creates an Audit Log

### 7. Notification delivery

Status: **Queue simulation only**

The UI currently creates demo notification events after:

- Good deed approved / returned / rejected
- Hospital follow-up / resolved / cancelled
- Announcement published
- Activation code created

Production still requires:

- Edge Function or worker that reads `notification_events`
- LINE Messaging API delivery
- Telegram delivery for staff channels
- Retry with exponential backoff
- Idempotency key
- Delivery result in `notification_deliveries`
- Dead-letter handling after maximum attempts

### 8. Audit and privacy

Status: **Demo audit implemented; production policy required**

Production requirements:

- Log every medical record view
- Log approval decisions
- Log member linking and role changes
- Store actor, role, timestamp, entity and reason
- Make audit rows append-only for normal staff
- Define retention period
- Limit exports to authorized users
- Avoid logging access tokens, ID tokens, health details or document URLs

## Functional coverage matrix

| Module | Demo UI | Local persistence | Supabase hook | Production-ready |
|---|---:|---:|---:|---:|
| Student profile | Yes | Yes | Prepared | No |
| Good-deed form | Yes | Yes | Prepared | No |
| Good-deed attachments | Validation only | Filename only | Prepared | No |
| Hospital form | Yes | Yes | Prepared | No |
| Hospital attachments | Validation only | Filename only | Prepared | No |
| News reading | Yes | Yes | Prepared | No |
| Staff approval | Yes | Yes | Partial | No |
| Medical review | Yes | Yes | Partial | No |
| News management | Yes | Yes | Partial | No |
| Student registry | Yes | Yes | Partial | No |
| Activation code | Yes | Yes | Edge Function prepared | No |
| Audit log | Yes | Yes | Table prepared | No |
| Notifications | Queue demo | Yes | Planned | No |
| PDF export | Print/JSON only | No | Planned | No |

## Go-live gates

Do not switch `demoMode` to `false` until all gates pass:

1. GitHub Pages returns HTTP 200 and `health.json` shows the current commit.
2. LIFF opens inside LINE and in an external browser.
3. LINE ID token verification succeeds server-side.
4. Activation-code linking passes concurrency and duplicate-link tests.
5. RLS tests pass for every role and table.
6. Private Storage tests pass for every bucket.
7. Staff routes reject unauthorized sessions.
8. Medical data views generate append-only Audit Logs.
9. LINE and Telegram notification retry tests pass.
10. Backup, restore and incident-response procedures are documented.
11. Test data is removed before importing real student records.
12. A privacy notice and consent wording are approved by the responsible authority.

## Primary references

- LINE Developers — Developing a LIFF app: https://developers.line.biz/en/docs/liff/developing-liff-apps/
- LINE Developers — Using user data in LIFF apps and servers: https://developers.line.biz/en/docs/liff/using-user-profile/
- LINE Developers — Verify ID token: https://developers.line.biz/en/docs/line-login/verify-id-token/
- Supabase — Row Level Security: https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase — Storage access control: https://supabase.com/docs/guides/storage/security/access-control
- GitHub — Configuring a publishing source for GitHub Pages: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
