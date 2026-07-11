# REC-SERVER-PIXEL-CHARACTER-001

## Job
Install and harden `pixel-art-studio-main.zip` as the main AGIS server character-generation skill.

## Audit Result
`PASS WITH HARDENING`

## Source Review
- 42 archive entries
- 6 Python files
- no subprocess/shell execution
- no eval/exec
- no network client/socket
- no executable binary or symlink
- original Python sources compiled
- original rendering example completed successfully

## Removed From Production Runtime
- raw third-party CLI tools
- image study/learning writer
- hybrid cleanup script generator
- examples, docs HTML, sample assets, external links
- developer-specific absolute paths

## Production Replacement
`agis-agent-armada-os/skills/server/agis-pixel-character-studio/scripts/server_character_renderer.py`

## Hardened Controls
- Pillow only
- output-root confinement
- slug/path traversal guard
- allowed canvas/accessory/expression/animation lists
- palette limit
- no external image input
- no network, subprocess, or dynamic code
- SHA-256 receipt generation

## Functional Test
- compile: PASS
- static PNG: PASS
- preview PNG: PASS
- idle GIF: PASS
- spritesheet PNG/JSON: PASS
- receipt JSON: PASS
- path traversal rejection: PASS

## Local Package SHA-256
`d36423d08b19c22aaed163ebd448df224430ca1137a7961bf22fefe2912328f5`

## Decision
Adopt as the AGIS main server skill for original crew-character generation after merge to `main`.
