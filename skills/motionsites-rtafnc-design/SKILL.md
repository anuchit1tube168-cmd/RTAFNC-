# MotionSites-inspired RTAFNC Motion Design Skill

## Purpose

สกิลกลางสำหรับยกระดับเว็บไซต์และ WebApp ของ Boss Agis ให้มีภาพลักษณ์ทันสมัย มี motion อย่างมืออาชีพ แต่ยังเร็ว ปลอดภัย ใช้งานจริงบนมือถือ และไม่ทำลาย business logic เดิม

ใช้กับ:
- RTAFNC Student LIFF / Staff Console
- Good Deed / Leave / Hospital systems
- OBE / CLO / Evaluation Analyzer
- Teaching Supervision
- AGIS Agent Command Center
- Shopee Affiliate War Room
- Catering / Logistics / Asset dashboards
- Coding / AR educational games
- Real-estate landing pages

## Source and adaptation policy

แนวคิดได้รับแรงบันดาลใจจาก MotionSites.ai และคลังสาธารณะ `aayushsoam/motionsites.ai` ซึ่งระบุ MIT License

กฎของสกิลนี้:
1. ห้ามคัดลอกแบรนด์ ข้อความ ภาพ วิดีโอ หรือ asset ของต้นฉบับมาใช้ตรง ๆ
2. สร้าง UI, copy, animation และ component ใหม่ให้ตรงบริบท RTAFNC/AGIS
3. ห้ามพึ่ง video URL ภายนอกที่ควบคุมไม่ได้สำหรับระบบ production
4. ห้ามแก้ API contract, database schema, authentication, role หรือสูตรคำนวณโดยไม่ได้รับคำสั่ง
5. GitHub เป็น source of truth; Google Drive/Sheets เป็น working data และ archive ตามสถาปัตยกรรมเดิม

## Operating principle

**Read first → Preserve contracts → Build skeleton → Add motion → Test → Record receipt**

ก่อนแก้ UI ต้องอ่าน:
- README และ architecture docs
- API/config files
- auth/role rules
- existing routes and forms
- test contracts

จากนั้นจัดทำ change map ว่าอะไร “คงเดิม / ปรับเฉพาะหน้าตา / เพิ่มใหม่”

## Supported build modes

### Mode A — Existing static/GitHub Pages
ใช้ HTML + CSS + JavaScript เดิม ไม่บังคับย้าย framework

อนุญาต:
- CSS keyframes / transitions
- IntersectionObserver
- Canvas/SVG แบบเบา
- localStorage เฉพาะ demo

### Mode B — Lovable / React
ใช้:
- React + TypeScript
- Tailwind CSS
- Framer Motion
- Lucide icons
- Existing Supabase/GAS/API adapters

### Mode C — Google Apps Script WebApp
ใช้ HTMLService + CSS + vanilla JS

ข้อจำกัด:
- หลีกเลี่ยง bundle ใหญ่
- animation ต้อง degrade gracefully
- เรียก `google.script.run` ผ่าน adapter เดิม

## RTAFNC design signature

### Typography
- UI: `Sarabun`, `Noto Sans Thai`, system sans-serif
- เอกสารราชการ/รายงาน: `TH Sarabun New` หรือ `TH Sarabun PSK`, 16 pt ตาม template

### Color tokens
```css
:root {
  --navy-950: #071426;
  --navy-900: #0B1F3A;
  --blue-600: #2563EB;
  --cyan-400: #22D3EE;
  --violet-500: #8B5CF6;
  --gold-400: #F5C451;
  --green-500: #22C55E;
  --amber-500: #F59E0B;
  --red-500: #EF4444;
  --surface: #FFFFFF;
  --surface-dark: #0F172A;
}
```

### Visual language
- Military precision + modern command center
- Clear hierarchy, restrained glow, clean glass panels
- One dominant motion concept per page
- Status colors must remain semantically consistent
- Avoid decorative clutter, excessive blur and constant movement

## Motion budget

- Initial hero animation: 500–900 ms
- Micro-interaction: 120–240 ms
- Stagger: 40–80 ms per item
- No infinite animation on data tables/forms
- Maximum 2 continuous decorative animations above the fold
- Disable or simplify when `prefers-reduced-motion: reduce`
- Mobile target: smooth on mid-range Android; avoid heavy WebGL unless explicitly required

## Accessibility gates

Required:
- Keyboard navigation
- Visible focus state
- Semantic HTML and labels
- Minimum touch target 44×44 px
- Contrast at least WCAG AA for body text
- Never communicate status by color alone
- Modal traps focus and supports Escape
- Charts include text summaries/table fallback
- Motion never blocks reading or form submission

## Performance gates

- Do not autoplay unmuted media
- Prefer CSS/SVG/local optimized assets
- Lazy-load images and noncritical sections
- Keep hero assets small and responsive
- Avoid loading animation libraries on pages that do not use them
- Preserve Core Web Vitals as a release criterion
- Provide static fallback for background effects

## Security gates

- Never expose real student/health data in public demos
- Never commit tokens, secrets or service-role keys
- UI role checks are not authorization
- Preserve server-side Auth/RLS/GAS validation
- Validate uploads by MIME, size, extension and authorization
- Do not inject user HTML into animated components
- External media URLs require allowlisting and ownership review

## Component system

Required reusable components:
1. `CommandHero` — hero with mission headline, status badge and primary action
2. `MetricCard` — KPI with trend, status and accessible summary
3. `MissionQueue` — approval/task queue with clear priority
4. `EvidenceTimeline` — audit/evidence history
5. `RoleGateNotice` — explains permissions without pretending to enforce them
6. `AnimatedSection` — viewport reveal with reduced-motion fallback
7. `StatusPill` — pending/approved/rejected/draft/alert
8. `DataEmptyState` — useful empty/error/loading states
9. `MobileCommandBar` — bottom actions for LIFF/mobile
10. `ReceiptPanel` — test/build/deploy evidence

## Page patterns

### Pattern 1 — Command Center
ใช้กับ AGIS Agent Team, admin dashboard, monitoring
- Dark navy command hero
- Mission status strip
- KPI grid
- agent/workflow cards
- approval queue
- activity timeline

### Pattern 2 — Trusted Institutional Portal
ใช้กับ RTAFNC Student System, OBE, teaching supervision
- Clean light surface with navy header
- restrained cyan/gold highlights
- role-based shortcuts
- clear forms and evidence status
- minimal motion in working screens

### Pattern 3 — Data Intelligence
ใช้กับ Evaluation Analyzer, Shopee, reports
- Data-first hero
- filter rail
- KPI + chart narrative
- ranking/exception table
- export and audit actions

### Pattern 4 — Campaign Landing
ใช้กับ real estate, projects, public information
- cinematic but lightweight hero
- proof points
- media gallery
- CTA sequence
- contact/lead capture with privacy notice

### Pattern 5 — Educational Adventure
ใช้กับ Coding/AR games
- playful illustrated hero
- clear mission/progress
- large touch controls
- reward feedback
- no motion that distracts from learning

## Mandatory prompt constraints

ทุก Prompt ที่ส่งให้ Lovable/Claude/Cursor ต้องมีข้อความต่อไปนี้โดยความหมาย:

- Read the existing repository before editing.
- Preserve all routes, API contracts, authentication, roles, formulas and data mappings.
- Do not invent backend data or claim an integration works unless it is implemented and tested.
- Build responsive mobile-first Thai UI.
- Use accessible semantic components and reduced-motion fallbacks.
- Keep production secrets out of browser code and repository.
- Run available tests and report exactly what passed, failed or could not be tested.
- Produce a change receipt listing files changed, risks and rollback steps.

## Quality loop

### Gate 1 — Structure
- Routes work
- existing functions remain reachable
- mobile navigation usable

### Gate 2 — Visual
- hierarchy clear in 5 seconds
- Thai text does not overflow
- no fake metrics or lorem ipsum

### Gate 3 — Functional
- forms submit through existing adapter
- filters/export/actions work
- loading/error/empty states exist

### Gate 4 — Accessibility/performance
- keyboard/focus checks
- reduced-motion check
- mobile viewport check
- asset and animation budget check

### Gate 5 — Security
- secret scan
- no real data in demo
- authorization remains server-side

### Gate 6 — Receipt
Create a concise receipt containing:
- scope
- files changed
- tests run
- passed/failed/not tested
- deployment target
- rollback instruction

## Definition of done

งานยังไม่เสร็จเพียงเพราะ “หน้าสวย”

ถือว่าเสร็จเมื่อ:
- business function เดิมไม่เสีย
- responsive และภาษาไทยสมบูรณ์
- motion มี fallback
- test/report มีหลักฐาน
- deploy path ชัดเจน
- ไม่มี secret/ข้อมูลจริงรั่วใน public repository
