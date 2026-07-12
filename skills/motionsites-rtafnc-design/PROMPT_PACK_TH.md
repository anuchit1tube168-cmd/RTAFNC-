# Prompt Pack พร้อมใช้ — Motion Design for RTAFNC & AGIS

> วิธีใช้: เลือก Prompt ให้ตรงระบบ แล้ววางใน Lovable, Claude Code, Cursor, Bolt หรือ AI builder ที่ใช้อยู่
>
> ทุก Prompt ออกแบบให้ “ปรับของเดิม” ไม่ใช่สร้าง mockup หลอก ๆ และต้องรักษา API/ข้อมูล/สิทธิ์เดิม

---

## 1) AGIS Agent Command Center

```text
Read the entire existing repository before editing. Redesign the AGIS Agent Command Center as a production-ready Thai military-style AI operations dashboard.

Visual direction:
- Dark navy command-center aesthetic, precise and restrained—not a sci-fi toy.
- Hero area with mission status, active agents, queue health and one primary command action.
- Subtle animated grid/particles using CSS or lightweight SVG only; no uncontrolled external video.
- Glass panels with high readability, cyan/violet accents and gold for command authority.

Required sections:
1. Mission overview and current operational state.
2. Agent fleet cards: Intake, Sensor, Router, Planner, Worker, Validator, Reviewer, Reporter, Archivist.
3. Job queue with P0/P1/P2 priority, owner, status and SLA.
4. Approval Queue, Loop Receipts, Loop Health and Manual Test Tracker.
5. Activity timeline and evidence links.
6. Mobile command bar for quick actions.

Technical rules:
- Preserve all routes, API contracts, state schemas, authentication and existing data adapters.
- Never fabricate live agent status; show explicit demo/offline/connected state.
- React + TypeScript + Tailwind + Framer Motion when the repository already supports it; otherwise preserve the current stack.
- Add prefers-reduced-motion fallback, semantic HTML, keyboard focus and 44px touch targets.
- Run available tests and produce a change receipt with files changed, tests, risks and rollback.
```

---

## 2) RTAFNC Student LIFF + Staff Console

```text
Audit the existing RTAFNC Student System repository first. Upgrade both Student LIFF and Staff Console to a modern, trustworthy Thai institutional portal without changing any business logic.

Student LIFF:
- Mobile-first dashboard with identity card, current status, quick actions and clear privacy notice.
- Main actions: บันทึกความดี, ไปโรงพยาบาล, ประวัติ, ข่าวสาร, โปรไฟล์.
- Use a clean light surface, navy header, restrained cyan/gold accents and subtle section reveal.
- Add useful loading, empty, error, draft and offline states.

Staff Console:
- Command dashboard with pending approvals, medical queue, news management, student registry, audit log and notification queue.
- Status must be visible by icon + text, not color alone.
- Separate Good Deed reviewer and Medical role views clearly.

Non-negotiable:
- Preserve LINE LIFF, authentication, role rules, upload limits, routes and data adapters.
- Do not expose student or health data in public demo.
- UI role checks are not authorization; keep server-side authorization intact.
- Do not claim Google Drive, Supabase, LINE or Telegram integration is active unless actually connected and tested.
- Optimize for mid-range Android and reduced motion.
- Run tests and provide exact pass/fail/not-tested results.
```

---

## 3) OBE / CLO Evaluation Intelligence Dashboard

```text
Read the existing OBE/CLO/Evaluation Analyzer code, spreadsheet mappings and report rules before changing anything. Redesign the interface as a Thai data-intelligence workspace for academic quality assurance.

Design:
- Data-first hero with academic year, course, cohort and data quality status.
- KPI cards for student count, completion, mean, SD, CLO attainment and exceptions.
- Filter rail for year, course, class, worksheet, evaluator and status.
- Charts must include text summaries and table fallback.
- Exception table must highlight mismatched totals, missing scores, ambiguous templates and formula issues.
- Report/export area for Excel, PDF and individual/class summaries.

Critical rules:
- Preserve official 1–64 student ordering and all existing name mappings.
- Never rebuild official spreadsheet/report templates; copy template first.
- Use ROUND only according to the existing scoring rules; do not silently change formulas or decimals.
- RAW_SCORE_ENTRY and STUDENT_SUMMARY must remain reconcilable.
- Use TH Sarabun New/PSK 16 pt in generated official reports.
- No fake scores or sample student identities in production mode.
- Add audit receipt for every import, calculation and export.
```

---

## 4) Teaching Supervision System

```text
Transform the existing teaching supervision module into a clear role-based Thai workflow while preserving its current data structure.

Flow:
1. Select person receiving supervision.
2. Automatically determine assessment form from position/academic rank.
3. Select evaluator level: buddy, department head, executive.
4. Score criteria, add comments and attach evidence.
5. Review completeness and submit.
6. Show individual and organization summary.

UI direction:
- Institutional light theme with navy and violet accents.
- Animated stepper only during navigation; no distracting motion inside scoring tables.
- Persistent save state, draft badge and completion percentage.
- Clear rubric descriptions and evidence checklist.
- Summary dashboard with trend, strengths, improvement priorities and pending reviews.

Rules:
- Preserve role permissions and automatic form-selection logic.
- Never let decorative UI imply an assessment is complete when required fields are missing.
- Add validation, autosave feedback, accessible labels and mobile layout.
- Generate a test matrix for each position/rank and evaluator level.
```

---

## 5) Good Deed / Leave / Hospital Mobile Workflow

```text
Redesign the existing mobile workflow for Good Deed, Leave and Hospital records as a fast Thai LIFF application.

Experience:
- One-screen mission dashboard with three primary actions.
- Large touch controls and clear status timeline: Draft → Submitted → Under Review → Approved/Returned/Rejected.
- Evidence upload with file type/size guidance before selection.
- Signature and consent area with plain Thai explanation.
- History filters and searchable records.
- Admin review drawer with evidence preview, comments and decision receipt.

Motion:
- Use subtle card transitions, progress animation and success confirmation.
- No infinite animation in forms or tables.
- Respect reduced-motion settings.

Preserve:
- Existing categories, hour range 0.5–24 step 0.5, hospital workflow, approval roles, file limits and notification adapters.
- Never merge health information into public Good Deed views.
- Keep all security validation server-side.
```

---

## 6) Shopee Affiliate War Room

```text
Build or upgrade the Shopee Affiliate analysis dashboard as a Thai commerce intelligence War Room.

Main layout:
- Hero with market scan status, products analyzed and last verified time.
- Product intake: image, URL or manual data.
- Analysis table columns: category, product, price, sales, reviews, verified commission, commission per item, commission opportunity, audience, video method, hook, score, rank and recommendation.
- Ranking board S/A/B/C with reason codes.
- Basket-priority queue and content production board.
- Script generator area with hook, proof, objection handling and CTA.

Truth rules:
- If real commission is unavailable, never invent a number. Show High/Medium/Low and “check Shopee Affiliate page”.
- Separate verified facts, estimates and recommendations visually.
- Display data timestamp and source status.
- Preserve any existing scraping/API/manual-input constraints and comply with platform terms.
- Provide CSV/Google Sheet export and an evidence receipt.

Visual style:
- Dark commerce dashboard, warm orange highlights, clean data cards and lightweight motion.
- Mobile responsive but optimized for desktop analysis.
```

---

## 7) Catering / Kitchen Logistics Dashboard

```text
Create a professional Thai catering and kitchen logistics dashboard for the RTAFNC catering unit.

Modules:
- Gas cooking equipment and safety inspection.
- Rice cooker capacity planning: 12 layers, tray 5 kg, 40–60 persons per tray, recommended operation 8–10 layers when applicable.
- Ingredient, rice and equipment storage with sealed pest-resistant containers.
- Digital scale calibration and inventory checks.
- Cooked-food container, holding time and sanitation status.
- Daily meal plan, quantity, issue log, maintenance and incident report.

Design:
- Operational logistics style, clean light dashboard with navy/green/amber status.
- Process diagrams and equipment cards with real photos only when supplied or licensed.
- Motion limited to status changes and workflow progression.

Rules:
- Do not turn illustrative capacity figures into mandatory safety claims without approved SOP references.
- Keep inspection evidence, responsible person, date/time and audit trail.
- Add print-ready checklist mode and mobile inspection mode.
```

---

## 8) Coding / AR Educational Game

```text
Create a complete mobile-friendly Thai educational coding game interface inspired by block coding and maze adventures, while using original characters and artwork.

Game structure:
- Mission map, level selection, tutorial, coding workspace, simulation area, hints, score and reward screen.
- Commands: move, turn, repeat, condition and event.
- Difficulty progression suitable for elementary learners.
- Immediate feedback explaining why a sequence works or fails.
- Teacher dashboard for level completion and common mistakes.

Visual direction:
- Kawaii underwater adventure with original art, large touch controls and joyful but controlled motion.
- Avoid copying copyrighted characters, logos, scenes or exact franchise designs.
- Support reduced motion and mute controls.

Technical:
- Responsive web app, install-free, deployable to GitHub Pages/Cloudflare Pages.
- Save progress locally for demo and use a clear adapter for Google Sheet/Supabase production storage.
- Include test levels and validation for every command block.
```

---

## 9) Real Estate Condo Sales Landing Page

```text
Create a high-conversion Thai condo sales landing page for a specific verified unit.

Sections:
- Cinematic but lightweight hero with actual unit photo, project name, size, floor/orientation and asking price.
- Key facts and monthly cost summary.
- Photo gallery, room plan, facilities, transport and neighborhood.
- Transparent ownership/transfer/finance notes supplied by the owner.
- Comparable listing section clearly labeled as asking prices unless verified closed-sale evidence exists.
- Contact form, LINE CTA and viewing appointment request.

Rules:
- Never claim “sold price” or guaranteed sale speed without evidence.
- Do not expose private legal, bank or personal documents.
- Optimize SEO, social preview, mobile speed and conversion tracking with consent.
- Use original project branding only where legally permitted.
```

---

## 10) Unified Project & Skills Portal

```text
Build a unified Thai portal that presents Boss Agis projects, reusable skills and system status without mixing sensitive operational data into the public site.

Information architecture:
- Public project showcase.
- Internal command-center link with authentication.
- Skill Library with P0/P1/P2, owner agent, purpose, version and last validation.
- Project cards for RTAFNC, OBE, supervision, Shopee, catering, AI Agent Team and educational games.
- Architecture map: GitHub source of truth, Drive knowledge lake, Sheet/Supabase state DB, Apps Script/Worker processor and Lovable command-center UI.
- Deployment health and evidence receipts.

Design:
- Premium agency-style hero adapted to a military innovation lab.
- Dark navy, clean typography, restrained animated lines and modular cards.
- Public and internal content must be strictly separated.

Rules:
- No real student, health, finance, password or token data in public pages.
- Do not expose repository secrets or private internal URLs.
- Every project status must be sourced or labeled demo/manual.
- Provide accessible navigation, search and mobile layout.
```

---

## Universal finishing prompt

ใช้หลัง AI builder สร้างหรือแก้หน้าเว็บแล้ว:

```text
Now perform a production-readiness pass. Do not redesign blindly.

1. Compare the implementation against the existing repository contracts.
2. Fix broken routes, actions, forms, Thai overflow, mobile layout, keyboard focus and reduced-motion behavior.
3. Remove fake metrics, fake integration claims, lorem ipsum and uncontrolled external assets.
4. Verify loading, empty, error, offline and permission-denied states.
5. Run available tests and inspect browser-console errors.
6. Check that secrets and real personal/health data are not committed.
7. Return a receipt with:
   - files changed
   - functions preserved
   - tests passed/failed/not tested
   - known risks
   - deployment steps
   - rollback steps
Do not state that the system is production-ready unless every listed gate has evidence.
```
