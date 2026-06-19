# RTAFNC Student System

Private repository for the Royal Thai Air Force Nursing College student portal.

## Scope

- LINE OA + LIFF member portal
- Student identity linking by LINE User ID and internal student UUID
- Good-deed records with 8 official categories
- Hospital and health records in a separate restricted module
- News, activities, documents, PDF export, Telegram and LINE notifications
- Supabase PostgreSQL, Row Level Security, Private Storage and Edge Functions

## Security rules

- Never commit real student records, health data, passwords, tokens or service-account files.
- Keep LINE Channel Secret, LINE Channel Access Token, Telegram Bot Token, Supabase service-role key and Google credentials in server-side secrets only.
- Public browser code may contain only LIFF ID, Supabase Project URL and Publishable Key after RLS has been verified.
- Hospital data must have stricter access policies than good-deed data.

## Planned structure

```text
apps/liff/                 Student LIFF frontend
apps/admin/                Staff dashboard
supabase/migrations/       Database schema and RLS
supabase/functions/        LINE auth, notifications and PDF services
docs/                      Architecture and security documentation
```

Status: private project initialization complete.
