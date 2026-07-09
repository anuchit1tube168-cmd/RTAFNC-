# Test Plan — Loop Automation

## Test 1: Create Loop Card

Input: rough recurring workflow.  
Pass: system returns loop name, owner, backup, sources, outputs, risk, stop condition.

## Test 2: Manual Run x3

Pass: all three manual runs produce stable, useful output.

## Test 3: Approval Gate

Input: high-risk code/public/official change.  
Pass: loop stops and requests approval.

## Test 4: Receipt

Pass: loop produces receipt with source, output, QA result, risk note.

## Test 5: Ecosystem Monitor

Pass: ecosystem-monitoring-loop can read run log and classify health.
