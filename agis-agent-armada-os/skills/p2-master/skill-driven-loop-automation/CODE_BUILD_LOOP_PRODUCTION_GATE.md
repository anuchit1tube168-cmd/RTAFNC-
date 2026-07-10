# Code Build Loop Production Gate

Version: v1.0  
Owner: Doctor + Shipwright + AGIS

## Purpose

Prevent a code-build loop from passing when the requested small change causes an unexpectedly broad rewrite, removes working features, or mixes unrelated repository changes into the rollback scope.

## Required Gate Before PASS

### 1. Requirement Scope

- What exact file or component may change?
- How many improvements were approved?
- Which files must remain untouched?

### 2. Diff Scope Check

Before PASS, verify:

- changed filenames
- additions/deletions
- whether unrelated files are included
- whether working features were removed
- whether the size of the diff matches the approved change

### 3. Functional Check

Confirm:

- original core behavior remains
- new behavior works
- movement/reaction/routing features are not accidentally removed
- responsive layout remains usable

### 4. Approval Check

High-risk code changes require an approval record in `ApprovalQueue`.

### 5. Rollback Checkpoint

Store:

- current production commit
- prior known-good file blob SHA
- exact target file path
- rollback method

### 6. Evidence Check

A valid PASS requires:

- commit SHA
- file/blob SHA
- QA note
- run log
- receipt

## Fail Conditions

Mark FAIL or PARTIAL when:

- approved one-small-change produces a broad rewrite
- unrelated files are included in rollback scope
- working functions disappear
- no known-good checkpoint exists
- no approval record exists for high-risk modification

## Safe Rollback Rule

```text
Rollback the exact file/blob on top of the current repository tree.
Do not reset a wide commit range when unrelated commits exist.
```

## Test 3 Result

The gate detected a broad Test 2 dashboard rewrite, prevented a false production PASS, and restored only `crew-dashboard.html` while preserving unrelated repository work.
