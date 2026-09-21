# PixelLab → AGIS Core 12 integration

PixelLab is used only as a **visual asset provider**. It does not control Agent permissions, state, jobs, memory, or tools.

Official API currently recommends `POST /v2/create-character-v3` for reusable eight-direction characters. The integration polls `GET /background-jobs/{job_id}` and exports each managed character through the Character Library endpoints.

## Secret

The token must exist only as:

`PIXELLAB_API_KEY`

Never commit it to source, HTML, JSON, screenshots, logs, or client JavaScript.

## Files

- `core12-character-specs.json` — stable visual design for ATLAS…MENTOR.
- `scripts/pixellab-core12.mjs` — balance/preflight, generation, polling, export.
- `scripts/pixellab-index-assets.mjs` — unzip/index generated assets and create manifest.
- `.github/workflows/pixellab-core12.yml` — owner-triggered generation.
- `assets/pixellab/core12/manifest.json` — generated asset manifest; absent until a successful API run.

## Workflow

1. Set GitHub Actions secret `PIXELLAB_API_KEY`.
2. Run **Generate PixelLab Core 12 Agents** manually.
3. Confirm with `GENERATE-CORE12`.
4. Select `ATLAS` for a one-character style check or `all` for the full team.
5. Workflow generates managed characters, downloads exports, indexes previews and commits generated assets.
6. Active Operations uses PixelLab previews when present and falls back to the local pixel engine otherwise.

## Truth boundary

- Generated movement on the dashboard is visualization of recorded Agent state.
- PixelLab output does not prove a job was executed.
- Operational evidence still comes from jobs/tests/audit/activity.
