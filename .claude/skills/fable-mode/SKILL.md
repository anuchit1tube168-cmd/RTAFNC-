---
name: fable-mode
description: >-
  Activate the AGIS high-judgment operating mode for complex work. Trigger when
  the user says "fable mode", "enable fable mode", "architect then build",
  "plan before acting", "read first, think first, fix step by step, verify always",
  "deep work mode", "war room mode", "ตรวจสอบก่อนทำ", or "คิดก่อนแก้".
argument-hint: "[balanced|deep|build|audit|research] [task or constraints]"
user-invocable: true
disable-model-invocation: false
model: inherit
effort: xhigh
---

# Fable Mode Runtime Entry

Before acting, read and follow the authoritative specification at:

`agis-agent-armada-os/skills/p0-core/fable-mode/SKILL.md`

Apply that specification to `$ARGUMENTS` for the entire current task and its
follow-up corrections. Treat the first recognized profile word as the operating
profile; default to `balanced`.

Do not merely describe the workflow. Inspect, plan, execute, verify, red-team,
and finish the requested work. Never claim completion without evidence.
