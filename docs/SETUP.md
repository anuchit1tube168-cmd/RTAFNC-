# RTAFNC Private Deployment Setup

## Current phase

The repository now contains:

- `apps/liff/` — mobile-first LIFF portal with separate Good Deed and Hospital modules
- `supabase/migrations/0001_core_schema.sql` — database, 8 good-deed categories, private storage buckets and deny-by-default RLS
- browser-safe configuration template

The application remains in demo mode until LINE server verification and member sessions are complete.

## 1. Create Supabase project

Create a new Supabase project in a region near Thailand. Do not place the database password or service-role key in this repository.

Run the migration using Supabase CLI or SQL Editor:

```text
supabase/migrations/0001_core_schema.sql
```

After the migration, confirm:

- RLS is enabled on every personal-data table
- `good-deed-files`, `hospital-files` and `student-documents` are Private
- anonymous users cannot query `students`, `line_accounts`, `good_deed_records`, `hospital_visits` or `documents`

## 2. Configure LIFF frontend

On the private deployment server:

```bash
cd apps/liff
cp config.example.js config.js
```

Edit only these browser-safe values:

```js
window.RTAFNC_CONFIG = {
  supabaseUrl: "https://PROJECT.supabase.co",
  supabasePublishableKey: "PUBLISHABLE_KEY",
  liffId: "LIFF_ID",
  lineOaId: "@LINE_OA_ID",
  demoMode: true,
};
```

Do not place the following values in `config.js`:

- Supabase service-role key
- LINE Channel Secret
- LINE Channel Access Token
- Telegram Bot Token
- Google service-account JSON
- database password

## 3. Serve through HTTPS

LIFF requires an HTTPS endpoint reachable from student phones. A private source repository is correct, but the LIFF endpoint itself must be internet-reachable.

Recommended production URL:

```text
https://student.your-domain.example/
```

The public endpoint must still reject users who are not verified members.

### Simple Nginx example

```nginx
server {
    listen 443 ssl http2;
    server_name student.your-domain.example;

    root /srv/rtafnc/apps/liff;
    index index.html;

    add_header X-Content-Type-Options nosniff always;
    add_header Referrer-Policy no-referrer always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' https://cdn.jsdelivr.net https://static.line-scdn.net; connect-src 'self' https://*.supabase.co https://api.line.me; img-src 'self' data: https:; style-src 'self'; frame-ancestors https://access.line.me https://line.me" always;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Adjust the Content Security Policy after real integration testing.

## 4. LINE Developers configuration

Create or select a LINE Login channel and add a LIFF app.

Set the endpoint URL to the HTTPS frontend URL. Keep the LIFF ID in browser configuration; keep Channel Secret on the server only.

Required secure login flow:

```text
LIFF obtains ID token
→ frontend sends ID token to Supabase Edge Function
→ Edge Function verifies token with LINE
→ verify audience/channel ID
→ find allow-listed student record
→ link LINE user ID to student UUID
→ create trusted application session
→ RLS permits only that student's rows
```

Do not treat `liff.getProfile()` as proof of identity.

## 5. Production activation gate

Keep this value until all security checks pass:

```js
demoMode: true
```

Change to `false` only after:

- LINE ID token verification works server-side
- one LINE account can link to only one student
- RLS tests prove student A cannot access student B
- Hospital access is restricted to the owner and medical roles
- Private files use signed URLs or authenticated storage policies
- audit logs record staff access to hospital records
- notification tokens are stored only in server secrets

## 6. Real-data import

Do not commit Excel, CSV, PDF, student photos or health records to GitHub.

Import real data directly into Supabase using an administrator-controlled process. Use `student_code` for source matching and UUID `student_id` for internal relationships.

Recommended sequence:

1. Import students
2. Validate duplicate student codes
3. Import historical good-deed transactions
4. Recalculate totals from transactions
5. Import hospital records through a restricted process
6. Upload files into their private buckets
7. verify ownership paths and access policies

## 7. Next implementation phase

The next phase is:

- Supabase Edge Function `line-auth`
- one-time activation code linking
- trusted member session
- student RLS policies
- staff role policies
- private file upload and signed URLs
- staff dashboard approval queue
