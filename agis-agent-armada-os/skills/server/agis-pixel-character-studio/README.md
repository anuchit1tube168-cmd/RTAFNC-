# AGIS Pixel Character Studio — Hardened Server Edition

Main server skill for original AGIS crew avatars and idle animations.

## Dependency
`Pillow`

## Run
```bash
export AGIS_PIXEL_OUTPUT_ROOT=./outputs
python scripts/server_character_renderer.py \
  --slug agis-captain --name AGIS --role "Captain / Orchestrator" \
  --accessory crown --animation idle
```

## Outputs
- transparent PNG
- contact-sheet preview PNG
- optional idle GIF
- spritesheet PNG + JSON
- receipt JSON with SHA-256 hashes

## Security
No network, subprocess, dynamic execution, arbitrary input images, or unrestricted output paths.

## Production Status
Main server skill after PR merge and State DB registration.
