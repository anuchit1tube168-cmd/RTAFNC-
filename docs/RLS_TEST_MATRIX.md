# RTAFNC RLS and Private Storage Test Matrix

This document defines the minimum tests that must pass before `demoMode` can be changed to `false`.

## Test identities

Create dedicated test accounts only. Do not use real student records.

| Test identity | Role | Linked student |
|---|---|---|
| student_a | student | student UUID A |
| student_b | student | student UUID B |
| reviewer_1 | good_deed_reviewer | none |
| medical_1 | medical | none |
| registrar_1 | registrar | none |
| news_1 | news_editor | none |
| admin_1 | admin | none |
| auditor_1 | auditor | none |

## Database policies

### students

- student_a can read only the safe profile columns for student A.
- student_a cannot read student B.
- registrar can read and update registry fields.
- reviewer cannot update student registry.
- medical cannot update student registry.
- admin can manage records according to approved policy.

### line_accounts

- student can read only their linked account status.
- browser clients cannot insert or relink LINE accounts directly.
- only the trusted `line-auth` server flow can link accounts.
- LINE user ID and Supabase auth user ID remain one-to-one.

### activation_codes

- students cannot list activation codes.
- ordinary staff cannot read code hashes.
- registrar/admin can create and revoke codes.
- raw activation codes are shown only at creation time.
- expired, revoked and used codes cannot be consumed.

### good_deed_records

- student_a can create a draft or pending record for student A only.
- student_a cannot create a record for student B.
- student_a can edit only draft or returned records belonging to student A.
- student_a cannot change `approved_hours`, reviewer fields or approved status.
- reviewer can read pending good-deed records within assigned scope.
- reviewer can approve, return or reject according to assigned scope.
- reviewer cannot read hospital records through joins or views.

### hospital_visits

- student_a can create and read only student A hospital records.
- student_a cannot read student B hospital records.
- good-deed reviewer receives zero rows.
- medical role can read only the approved medical scope.
- registrar and news editor receive zero rows.
- every medical detail read is logged by the application/server workflow.

### announcements and news_reads

- students can read only published announcements addressed to all, their cohort, their year or their student UUID.
- students cannot publish or edit announcements.
- news editor can create drafts and publish within approved scope.
- students can insert/update only their own acknowledgement row.

### documents

- student_a can see metadata for student A documents only.
- good-deed reviewer can see good-deed document metadata only.
- medical role can see hospital document metadata only.
- storage path, bucket and reference ID must match the module and owner.

### audit_logs

- normal students and staff cannot update or delete audit rows.
- auditor/admin can read approved log fields.
- sensitive tokens, document URLs and clinical detail are not written to metadata.

## Storage policies

### good-deed-files

Expected path:

```text
<student_uuid>/<good_deed_record_uuid>/<random_uuid>-<safe_filename>
```

Tests:

- student_a upload to student A prefix: allow.
- student_a upload to student B prefix: deny.
- student_a list/download student B file: deny.
- reviewer download attached evidence for an authorized good-deed review: allow.
- medical role browsing this bucket without good-deed permission: deny.

### hospital-files

Expected path:

```text
<student_uuid>/<hospital_visit_uuid>/<random_uuid>-<safe_filename>
```

Tests:

- student_a upload/read student A file: allow.
- student_b read student A file: deny.
- reviewer read any hospital file: deny.
- registrar read any hospital file: deny.
- medical role read only records in authorized scope: allow.
- public URL generation: impossible because bucket is private.

### student-documents

- only owner and explicitly authorized registrar/admin role can read.
- medical documents must not be moved into this bucket to bypass medical policies.

### public-news

- only non-sensitive public announcement media is stored here.
- no student UUID, medical certificate, identification file or personal evidence is allowed.

## Negative API tests

Run with the Publishable Key and each authenticated test session:

1. Change `student_id` in an insert payload to another student.
2. Request another student's UUID directly.
3. Add a PostgREST filter designed to widen the result set.
4. Call update/delete on an approved good-deed record as a student.
5. Query hospital tables as reviewer, registrar and news editor.
6. Guess private Storage paths.
7. Request unsigned public URLs for private buckets.
8. Submit `approved_hours` from Student LIFF.
9. Reuse an activation code concurrently.
10. Reuse one LINE account with a second student code.

Every negative test must return no rows or a permission error. A hidden button or route guard does not count as security.

## Performance checks for 300–500 members

- Add indexes for all foreign keys and common RLS predicates.
- Index `line_accounts.auth_user_id`, `line_accounts.line_user_id` and `line_accounts.student_id`.
- Index good-deed and hospital records by `student_id`, `status` and date.
- Paginate staff tables; do not load every record at once.
- Store files in Storage, not as database byte arrays.
- Generate thumbnails for large images before staff review.
- Test with realistic record counts and concurrent logins.

## Pass criteria

Go-live is blocked if any test exposes another student's row, hospital detail or private object path.
