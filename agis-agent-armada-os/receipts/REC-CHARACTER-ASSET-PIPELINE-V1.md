# REC-CHARACTER-ASSET-PIPELINE-V1

Date: 2026-07-09  
Mission: Correct the design process by moving from CSS-only avatars to concept-matched character assets  
Owner: AGIS + Fable + Shipwright + Doctor  
Repo: `anuchit1tube168-cmd/RTAFNC-`  
Project Root: `agis-agent-armada-os/`

## Problem Found

The previous pirate ship dashboard solved the movement/reaction engineering problem but did not solve the character fidelity problem. The characters still looked like generic CSS avatars rather than the approved AGIS concept image.

## Root Cause

The process skipped the character asset pipeline.

Previous process:

```text
System engine → CSS avatar approximation → dashboard
```

Corrected process:

```text
Character Bible → Sprite Asset Pipeline → HTML Asset Integration → Movement Engine → QA Fidelity Gate
```

## Work Completed

- Created `CHARACTER_BIBLE.md`
- Created `SPRITE_ASSET_PIPELINE.md`
- Created local working HTML preview using concept-derived character tokens
- Created contact sheet for visual review

## Files Created Locally

- `/mnt/data/agis-character-sprite-ops-dashboard.html`
- `/mnt/data/agis_phase3_character_tokens_contact_sheet.png`
- `/mnt/data/AGIS_CREW_CHARACTER_BIBLE.md`
- `/mnt/data/AGIS_SPRITE_ASSET_PIPELINE.md`

## Files Added To GitHub

- `agis-agent-armada-os/ui/crew/CHARACTER_BIBLE.md`
- `agis-agent-armada-os/ui/crew/SPRITE_ASSET_PIPELINE.md`

## QA Status

PARTIAL PASS

- Process corrected: PASS
- Character Bible: PASS
- Sprite pipeline defined: PASS
- Local HTML preview with concept-matched image tokens: PASS
- Production GitHub sprite asset upload: PENDING

## Reason Production Asset Upload Is Pending

The current GitHub connector actions available in this session support UTF-8 text file creation/update well. They do not provide a direct binary asset upload path for WebP/PNG files. The local HTML preview embeds the image tokens directly, so it works as a proof of process.

## Next Step

Choose one production route:

1. Upload real WebP/PNG sprite assets to `agis-agent-armada-os/assets/crew/`
2. Or keep embedded data-URI sprite tokens in the HTML if file size is acceptable
3. Then replace the GitHub dashboard with the sprite-token version

## Decision Rule

Do not continue improving CSS avatar fidelity. Use real sprites/assets from this point forward.
