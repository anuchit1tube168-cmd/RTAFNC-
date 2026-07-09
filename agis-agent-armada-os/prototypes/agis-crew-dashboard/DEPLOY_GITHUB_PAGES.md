# Deploy AGIS Crew Dashboard to GitHub Pages

## Status
A GitHub Actions workflow has been added:

```text
.github/workflows/agis-crew-dashboard-pages.yml
```

## What it does
The workflow publishes this folder as a GitHub Pages site:

```text
agis-agent-armada-os/prototypes/agis-crew-dashboard
```

## Trigger
It runs when:
- Boss manually runs `Deploy AGIS Crew Dashboard Prototype` from GitHub Actions, or
- files inside the prototype folder are pushed to `main`.

## Expected URL
After deployment succeeds, the expected GitHub Pages URL is usually:

```text
https://anuchit1tube168-cmd.github.io/RTAFNC-/
```

GitHub will also show the final URL in the workflow deployment output.

## Manual Run Steps
1. Open the GitHub repo.
2. Go to Actions.
3. Select `Deploy AGIS Crew Dashboard Prototype`.
4. Click `Run workflow`.
5. Wait until it completes.
6. Open the deployment URL shown in the workflow summary.

## If deployment fails
Check repository settings:

1. Settings → Pages
2. Source should allow GitHub Actions
3. Actions permissions must allow workflows
4. Repository must have GitHub Pages enabled

## Next Gates
1. Confirm dashboard opens in browser.
2. Replace emoji portraits with final original character assets.
3. Add `PROCESSOR_URL` when Apps Script Processor is deployed.
4. Move Phase 2 to PixiJS/Phaser interactive walking deck.

## Receipt
Record this deployment setup as `REC-P1-005` in State DB.
