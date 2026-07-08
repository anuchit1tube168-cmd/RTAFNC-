# TEST_PLAN — Master Skill Training System

## Test 1: Convert Roadmap to Skill Registry
Input: Skill development table
Expected:
- Skills are classified P0/P1/P2
- Owner agent assigned
- Evidence and test tasks defined

## Test 2: Install One P0 Skill
Input: Requirement Extraction Skill
Expected:
- SKILL.md created
- LLM_WIKI.md created
- CHECKLIST.md created
- AGENT_INJECTION.md created
- Test job defined

## Test 3: Apply to Real Job
Input: A real project command from Boss
Expected:
- Job Card created
- Missions created
- Relevant skill selected
- Evidence collected
- Receipt created

## Test 4: Level Up Decision
Input: Skill used successfully with receipt
Expected:
- Agent gets skill rank Useful or Senior Candidate
- AgentSkillMap updated
- Lesson learned captured

## Pass Criteria
The training system passes only when at least one P0 skill is used in a real job and produces evidence + receipt.
