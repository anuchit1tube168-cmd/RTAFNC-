# Rollback Plan — AGIS Crew Dashboard

Date: 2026-07-10  
Owner: Shipwright  
QA: Doctor  
Controller: AGIS

## Protected Target

`agis-agent-armada-os/ui/crew/crew-dashboard.html`

## Known-Good Checkpoint

- Source commit: `14c51f003771fc33d116171b035547d4c41d64f1`
- File blob SHA: `edd6c9826c0ea22c62d80f0a51084886e7501618`
- Known-good title: `AGIS Pirate Ship Ops Dashboard · Code Build Loop Test 1`

## Regression Checkpoint

- Test 2 commit: `70eec25164f2f518e3aa48592b4da339b1fe34f2`
- Regression blob SHA: `b447a166497692825ab6d7d88ac8d0b9fb88117e`

## Safe Rollback Method

1. Read current repository HEAD.
2. Create a new tree from the current repository state.
3. Replace only the dashboard path with the known-good blob SHA.
4. Create a new commit with current HEAD as parent.
5. Fast-forward `main` to the rollback commit.
6. Verify the dashboard blob SHA.
7. Write correction receipt.

## Rollback Applied

- New tree SHA: `15bd71681e4a72dca0dae08fb15d693779735a37`
- Rollback commit: `9fdcc93cf31e0184fca7482d4d576206a7360976`
- Branch update: fast-forward, no force
- Verified current blob: `edd6c9826c0ea22c62d80f0a51084886e7501618`

## Why This Method Is Required

The Test 1 to Test 2 comparison included multiple commits and unrelated files. Resetting the whole commit range could remove valid work from other missions.

Therefore the approved method is file-scoped rollback only.

## Stop Conditions

Stop rollback when:

- current branch has diverged unexpectedly
- target blob SHA cannot be verified
- more than the approved target file would change
- branch update requires force
- rollback would remove unrelated work

## Recovery Verification

PASS when:

- target file SHA equals known-good SHA
- unrelated files remain unchanged
- branch update is fast-forward
- correction receipt exists
