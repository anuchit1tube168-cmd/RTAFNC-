---
name: agis-pixel-character-studio
version: 1.0.0
description: >-
  Main AGIS server skill for generating original crew characters, avatar PNGs,
  idle GIFs, and spritesheets through a hardened deterministic Pillow renderer.
  Use for AGIS dashboard agents, game-like crew UI, animated status cards, and
  consistent original character assets. The public entry point has no network,
  shell execution, arbitrary code execution, or unrestricted filesystem paths.
---

# AGIS Pixel Character Studio — Main Server Skill

## Mission
Generate original, consistent AGIS crew characters for the dashboard and future interactive crew deck.

## Crew Ownership
- Primary creative owner: Cook / Brand Graphic Designer
- Technical owner: Shipwright
- QA owner: Doctor
- Security owner: Swordsman
- Routing owner: AGIS

## Main Server Entry Point
`scripts/server_character_renderer.py`

## Server Contract
- deterministic Pillow-only renderer
- output confined to `AGIS_PIXEL_OUTPUT_ROOT`
- no URL/file upload in the main endpoint
- allowed canvas: 32, 48, 64, 96, 128
- palette budget: maximum 16 colors
- allowed animation: static, idle
- every render emits `receipt.json` with SHA-256

## Workflow
`Brief → Validate → Render → Visual QA → Security QA → Receipt → Publish`

## Required Brief
- slug
- name
- role
- primary/secondary colors
- accessory
- expression
- animation

## Accessory Map
- AGIS: crown
- Navigator: compass
- Archaeologist: book
- Shipwright: hammer
- Doctor: cross
- Swordsman: sword
- Cook: pan
- Sniper: target
- Clone: clone

## Quality Gate
1. Character remains readable at 64×64.
2. Silhouette is distinct.
3. Brand colors match AGIS navy/gold direction.
4. No copyrighted-character likeness.
5. Output files open correctly.
6. Receipt hashes are present.

## Safety Gate
- reject invalid slug and escaped path
- reject unsupported size, color, accessory, expression, or animation
- reject public use of raw third-party CLI scripts
- no production status without evidence + receipt

## Definition of Done
PNG + preview + optional GIF/spritesheet + receipt, all verified.

## Attribution
The uploaded `pixel-art-studio-main.zip` informed the deterministic pixel-art workflow. Its MIT notice is preserved in `THIRD_PARTY_LICENSE_PIXEL_ART_STUDIO.txt`. The production renderer is a hardened AGIS-specific implementation with a reduced attack surface.
