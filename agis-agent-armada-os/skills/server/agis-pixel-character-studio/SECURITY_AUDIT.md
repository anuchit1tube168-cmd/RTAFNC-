# Security Audit — pixel-art-studio-main.zip

## Scope
- 42 archive entries
- 6 Python files
- documentation, examples, references, image assets
- source zip reviewed without executing untrusted shell/network code

## Static Findings
### No abnormal execution behavior found
- no subprocess/shell execution
- no `eval` or `exec`
- no pickle/marshal dynamic object loading
- no HTTP client, socket, or remote download in Python
- no embedded executable binary
- no symlink
- base64 is used for image serialization, not concealed executable code

### Functional Test
- all Python files compiled
- original slime example generated PNG, GIF, spritesheet, JSON, and project file successfully

## Risks unsuitable for the main server endpoint
1. Raw tools accept user-controlled input/output paths.
2. Image-analysis tools can write into package/reference directories.
3. Hybrid tools generate Python build scripts.
4. Large/untrusted images can create resource-exhaustion risk.
5. Examples include a developer-specific absolute path.
6. Docs include external links not required at runtime.

## Retention Decision
### Retained as knowledge/reference
- deterministic pixel construction concept
- palette, animation, validation, and export practices
- MIT license notice

### Removed from production runtime
- original raw CLI scripts
- hybrid cleanup pipeline
- study/learning writer
- examples and sample assets
- website/docs HTML
- external links
- absolute developer paths

## Hardened Replacement
The AGIS server edition uses one self-contained Pillow renderer with:
- no network
- no subprocess
- no dynamic execution
- fixed validation lists
- path confinement
- canvas/palette limits
- deterministic output
- SHA-256 receipt

## Test Result
- Python compile: PASS
- renderer smoke test: PASS
- path traversal guard: PASS
- static PNG: PASS
- idle GIF: PASS
- spritesheet PNG/JSON: PASS
- receipt generation: PASS

## Result
`PASS — CORE CONCEPT ACCEPTED, ORIGINAL RUNTIME REPLACED BY HARDENED SERVER IMPLEMENTATION`
