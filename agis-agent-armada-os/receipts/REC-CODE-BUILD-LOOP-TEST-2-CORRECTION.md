# REC-CODE-BUILD-LOOP-TEST-2-CORRECTION

Date: 2026-07-10  
Loop: `code-build-loop`  
Owner: Shipwright  
QA: Doctor  
Controller: AGIS

## Reason for Correction

During manual test 3 production-gate review, Doctor compared the Test 1 and Test 2 history and found that Test 2 was not limited to a small isolated UI addition.

The Test 2 commit changed `crew-dashboard.html` substantially and reduced major parts of the richer dashboard implementation. Therefore the original PASS for Test 2 required correction before production validation.

## Evidence

Test 1 dashboard commit:

`14c51f003771fc33d116171b035547d4c41d64f1`

Test 2 dashboard commit:

`70eec25164f2f518e3aa48592b4da339b1fe34f2`

GitHub commit review showed a large dashboard diff rather than one small isolated change.

## Corrective Action

Restored only:

`agis-agent-armada-os/ui/crew/crew-dashboard.html`

to the Test 1 blob:

`edd6c9826c0ea22c62d80f0a51084886e7501618`

The rollback was applied with Git Data API using the current repository tree as the base. Other commits and other files were preserved.

Rollback commit:

`9fdcc93cf31e0184fca7482d4d576206a7360976`

## Verification

Current dashboard blob SHA after rollback:

`edd6c9826c0ea22c62d80f0a51084886e7501618`

Verified title:

`AGIS Pirate Ship Ops Dashboard · Code Build Loop Test 1`

## Corrected Test 2 Status

PASS — corrected through production-gate detection and file-scoped rollback.

## New Rule Learned

```text
A loop test cannot pass from feature presence alone.
It must also verify diff scope and protect unrelated files.
```

## Skill Revision Candidate

Add to `code-build-loop`:

- compare changed files before PASS
- reject broad rewrite when only one small improvement was approved
- rollback by file/blob, not by resetting a wide commit range
