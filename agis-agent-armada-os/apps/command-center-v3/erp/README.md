# RTAFNC ERP / Company OS

Operational ERP prototype for RTAFNC / AGIS. This implementation is **independently written** for this repository.

## Reference boundary
The information architecture was informed by the publicly visible README and route/module names in `Boom-Vitt/boombignose-erp` (Company OS concept: dashboard, CRM, pipeline/deals, projects, operational finance, automation/templates, audit, reports). No source code, UI assets, branding, database migrations, tests, or proprietary implementation from that repository were copied.

The reference repository currently states that its license is not finalized and that the software is proprietary / all rights reserved for internal use only. Therefore this project uses only high-level product concepts and public feature descriptions as inspiration.

## Modules
- Executive Dashboard
- CRM / Stakeholders
- Pipeline / Intake
- Projects / Delivery
- Operational Finance
- Documents / Correspondence
- Personnel / HRIS
- Automation / Templates
- Audit Log
- Settings / White-label

## Current storage
Phase 1 is local-first using browser `localStorage` under key `rtafnc.erp.v1`.

Available now:
- Responsive desktop/mobile UI
- Demo operational dataset
- CRUD create/delete on core modules
- Global search
- Module filters
- JSON backup/import
- Audit log
- White-label organization settings

## Next backend adapters
1. Google Apps Script + Google Sheets for fast institutional deployment.
2. Supabase/Postgres + RLS for multi-user production.
3. AGIS Processor bridge for agent-driven job creation, evidence and receipt workflows.

## Live path
When deployed by the existing AGIS GitHub Pages workflow:

`/erp/`

Short alias:

`/erp.html`
