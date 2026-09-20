# CORE 12 — HANDOFF MATRIX

## Rule
Handoff exists only when the receiving Agent adds an independent capability or review.
Do not create ceremony between Agents that can be handled by one owner + skill.

| From | To | Trigger | Payload | Receiver responsibility |
|---|---|---|---|---|
| ATLAS | Any Core Agent | Priority selected | Job objective, acceptance, evidence boundary | Execute only assigned scope |
| ORACLE | ECHO | Revenue model needs real pain/buyer evidence | Assumptions + missing numbers | Validate customer-side inputs |
| ECHO | FORGE | Pain/cost/buyer validated | Pain evidence + desired outcome | Define smallest valuable workflow |
| FORGE | AETHER | Workflow scope approved | User flow + acceptance criteria | Define architecture/boundaries |
| AETHER | MAKER | Design is build-ready | Interfaces + constraints + rollback | Implement in staging/sandbox |
| MAKER | SENTINEL | Artifact/test-ready | Build + test logs + evidence | Independently verify acceptance |
| SENTINEL | AEGIS | Security/permission/data-risk change | Test evidence + risk surface | Security gate |
| AEGIS | ATLAS/Boss | Consequential write or production boundary | Risk + permission + rollback | Human/command decision |
| SCOUT | AETHER/FORGE/ECHO/VECTOR | Relevant external/internal signal | Classified claim + evidence + hypothesis | Design smallest experiment |
| SCOUT | SENTINEL | Signal could change strategy/agent behavior | Claim/evidence/counterevidence | Independent validation |
| NEXUS | AETHER | New connector/interface needed | API/auth/dependency contract | Boundary/reuse review |
| AETHER | NEXUS | Integration approved | Contract + scope + auth boundary | Implement connector in staging |
| VECTOR | ORACLE/ECHO | GTM result available | Funnel/conversion/customer response | Economics + customer validation |
| Any Agent | MENTOR | Repeated fail/correction/win | Event + root cause candidate + evidence | Test lesson and promote/reject skill |
| MENTOR | SENTINEL | Skill/rule candidate ready | Before/after + eval evidence | Independent skill promotion gate |

## Canonical workflow
ECHO → FORGE → AETHER → MAKER → SENTINEL → AEGIS (if risk) → ATLAS/Human approval → Evidence → MENTOR

## Scout workflow
SCOUT → claim classification → domain owner → experiment → SENTINEL → MENTOR

## New-Agent workflow
Observed gap → Existing Core + skill/tool/context → measurement → temporary candidate → SENTINEL A/B eval → AEGIS if permission delta → ATLAS decision.

## Blocked rule
A BLOCKED Agent must state:
1. what dependency is missing;
2. why it cannot proceed safely;
3. who/what can unblock it;
4. whether another safe job can continue meanwhile.

Blocked ≠ failed. Blocked must never be hidden as READY or WORKING.
