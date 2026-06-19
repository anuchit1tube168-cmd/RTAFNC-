#!/usr/bin/env python3
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "dist"
OUTPUT_FILE = OUTPUT_DIR / "rtafnc-staging-bootstrap.sql"

INPUTS = [
    ROOT / "supabase" / "migrations" / "0001_core_schema.sql",
    ROOT / "supabase" / "migrations" / "0002_line_member_auth.sql",
    ROOT / "supabase" / "migrations" / "0003_staff_roles_and_policies.sql",
    ROOT / "supabase" / "seed.sql",
    ROOT / "supabase" / "verify.sql",
]

HEADER = """-- RTAFNC STAGING BOOTSTRAP BUNDLE
-- Generated from version-controlled migration, seed and verification files.
-- Use only with a NEW Supabase STAGING project.
-- Do not run seed data in Production.
--
-- Source order:
-- 1. 0001_core_schema.sql
-- 2. 0002_line_member_auth.sql
-- 3. 0003_staff_roles_and_policies.sql
-- 4. seed.sql
-- 5. verify.sql

"""


def main() -> None:
    missing = [path for path in INPUTS if not path.is_file()]
    if missing:
        names = ", ".join(str(path.relative_to(ROOT)) for path in missing)
        raise SystemExit(f"Missing required SQL files: {names}")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    sections = [HEADER]

    for index, path in enumerate(INPUTS, start=1):
        relative = path.relative_to(ROOT)
        content = path.read_text(encoding="utf-8").rstrip()
        sections.append(
            f"\n-- ============================================================\n"
            f"-- SECTION {index}: {relative}\n"
            f"-- ============================================================\n\n"
            f"{content}\n"
        )

    OUTPUT_FILE.write_text("".join(sections), encoding="utf-8")
    print(f"Created {OUTPUT_FILE.relative_to(ROOT)}")
    print(f"Size: {OUTPUT_FILE.stat().st_size} bytes")


if __name__ == "__main__":
    main()
