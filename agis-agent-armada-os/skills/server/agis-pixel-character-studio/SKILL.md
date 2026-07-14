---
name: agis-pixel-character-studio
version: 1.1.0
description: >-
  Main AGIS pixel-character skill for producing original crew characters as
  browser-safe Canvas art, downloadable PNGs, idle/walk/action sprite sheets,
  and hardened server PNG/GIF outputs. Use for AGIS dashboard agents,
  game-like crew UI, animated status cards, character labs, and consistent
  original character assets. The web contract never depends on an AVIF-only
  preview, external image URL, arbitrary code execution, or unrestricted paths.
---

# AGIS Pixel Character Studio — Main Skill

## Mission
Generate original, consistent AGIS crew characters that open correctly in the browser and can be exported for dashboards, games, presentations, and future interactive crew decks.

## Crew Ownership
- Primary creative owner: Cook / Brand Graphic Designer
- Technical owner: Shipwright
- QA owner: Doctor
- Security owner: Swordsman
- Routing owner: AGIS

## Production Entry Points
- Browser renderer: `apps/command-center-v3/pixel-character-engine.js`
- Browser studio: `apps/command-center-v3/pixel-library.html`
- Hardened server renderer: `scripts/server_character_renderer.py`

## Workflow
`Brief → Validate → Render → Visual QA → Browser QA → Export → Receipt → Publish`

## Required Brief
- slug
- name
- role
- primary and secondary colors
- accessory
- expression
- animation mode
- intended output: browser, PNG, GIF, or sprite sheet

## Character Contract
- canonical canvas: 64×64 pixel
- palette budget: maximum 16 colors per character
- readable silhouette at native size
- unique primary color and role accessory
- supported web animation: idle, walk, action
- supported server animation: static, idle
- no copyrighted-character likeness

## Canonical Crew
- AGIS: crown
- Fable: crystal
- Navigator: compass
- Archaeologist: book
- Shipwright: hammer
- Doctor: cross
- Swordsman: sword
- Cook: pan
- Sniper: target
- Clone: clone mark

## Web Delivery Contract
1. Canvas renderer is the source of truth for the public website.
2. The page must render all 10 characters without loading an image URL.
3. AVIF, Base64 chunks, or generated atlases may be optional references only.
4. A broken optional asset must not hide the canonical pixel characters.
5. Every character must support direct PNG download from the browser.
6. The selected character must support a four-frame sprite sheet export.
7. `image-rendering: pixelated` or nearest-neighbor scaling is mandatory.
8. Chrome, Safari, and mobile layouts must be treated as acceptance targets.

## Server Contract
- deterministic Pillow-only renderer
- output confined to `AGIS_PIXEL_OUTPUT_ROOT`
- no URL/file upload in the main endpoint
- allowed canvas: 32, 48, 64, 96, 128
- palette budget: maximum 16 colors
- allowed server animation: static, idle
- every render emits `receipt.json` with SHA-256

## Quality Gate
1. All 10 public cards visibly render.
2. Idle, walk, and action modes animate without console errors.
3. Selected-character view matches the card identity.
4. PNG download opens as a valid image.
5. Sprite sheet contains four aligned frames.
6. Character remains readable at 64×64.
7. Silhouette and accessory are distinct.
8. Brand colors match the AGIS navy/gold direction.
9. Mobile controls remain usable.
10. Output files open correctly and receipts/hashes are present where applicable.

## Safety Gate
- reject invalid slug and escaped path
- reject unsupported size, color, accessory, expression, or animation
- reject public use of raw third-party CLI scripts
- no arbitrary network, shell, dynamic code, or unrestricted filesystem access
- no production status without visual evidence plus receipt

## Failure Recovery
When a browser image does not display:
1. Do not mark the page Done merely because CI passed.
2. Switch the public preview to the Canvas renderer.
3. Keep the failed binary asset only as optional evidence.
4. test native 64×64, enlarged preview, PNG download, and mobile layout.
5. update the receipt with the failing browser, root cause, and fix commit.

## Definition of Done
- Browser: 10/10 visible characters + three animation modes + PNG export + sprite sheet export.
- Server: PNG + preview + optional GIF/spritesheet + receipt, all verified.
- Product: public URL opens, character cards are visible, and no mandatory image dependency fails.

## Attribution
The uploaded `pixel-art-studio-main.zip` informed the deterministic pixel-art workflow. Its MIT notice is preserved in `THIRD_PARTY_LICENSE_PIXEL_ART_STUDIO.txt`. The production browser and server renderers are hardened AGIS-specific implementations with a reduced attack surface.
