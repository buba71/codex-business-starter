# Implementation Plan: Retrospective Agent Improvements

## 1. Context & Objective

Update repository operating rules and agent definitions after Workshop 24. The objective is to enable autonomous in-scope corrections, reduce unnecessary handoffs, make ownership and Git safeguards consistent, require Planner-owned implementation plans, and evaluate (without creating) a dedicated CI/DevOps agent.

Inputs verified: repository `AGENTS.md`, all five existing definitions in `.codex/agents/`, current Git branch/worktree state, and the requested Workshop 24 requirements. No GitHub issue number was supplied, so this stable task identifier is used.

## 2. Scope & Acceptance Criteria

- Shared rules require a Planner-created plan before implementation, orchestrator verification/progress coordination, autonomous specialist corrections, proportional review, and limited delegation.
- Planner writes `docs/plans/issue-XX/plan.md` or a stable descriptive equivalent with the eight required sections, task ownership/dependencies/statuses, and preserved estimate rules.
- Backend, Frontend, QA and Reviewer definitions reflect the approved ownership and safeguards.
- Git safeguards remain non-destructive and publication operations remain explicitly authorized.
- CI/DevOps is evaluated with objective criteria but no CI/DevOps agent is created.
- All TOML files parse; routing walkthroughs cover PHPStan, ESLint, PostgreSQL CI, missing Vite assets, and dangerous Git operations.
- No application code is modified.

## 3. Technical Approach

Update only `AGENTS.md`, `.codex/agents/*.toml`, and this plan. Keep Planner write access limited to assigned plan files. Keep QA test/config changes scoped and route application defects to Backend or Frontend. Preserve branch, publication, destructive-operation and dependency safeguards.

## 4. Implementation Tasks & Ownership

| Task | Responsible agent | Dependencies | Status |
| --- | --- | --- | --- |
| Update shared orchestration and Git rules | Orchestrator | Preflight complete | Complete |
| Update Planner plan-writing contract and estimates | Planner-owned configuration | Shared rules | Complete |
| Update Backend and Frontend ownership/correction permissions | Orchestrator | Shared rules | Complete |
| Update QA boundaries and Reviewer independence | Orchestrator | Shared rules | Complete |
| Evaluate CI/DevOps agent criteria without creating one | Orchestrator | Validation evidence | Complete |
| Parse TOML and run routing/scope checks | QA | All configuration edits | Complete |

## 5. Execution Strategy

Work is confined to the dedicated branch `codex/retrospective-agent-improvements`. Preserve the pre-existing untracked `backend/.php-cs-fixer.cache`. The orchestrator verifies the plan before configuration edits, then performs validation and records progress here. No commit, push, PR, merge, deployment, reset, stash, force-push or branch deletion is authorized by this task.

## 6. Validation Strategy

- Parse every `.toml` file with a TOML parser.
- Inspect the resulting text for plan-write permission, application-code restrictions, specialist correction permissions, QA routing/database protections, Reviewer non-modification, and Git safeguards.
- Walk through routing: PHPStan → Backend; ESLint → Frontend; PostgreSQL CI failure → QA diagnosis and Backend/Frontend routing as applicable; missing Vite assets in functional tests → Frontend for asset/build defect or QA for test setup; dangerous Git operation → orchestrator blocks it under shared Git safeguards.
- Confirm only requested configuration/plan files changed and application directories remain untouched.

## 7. Risks & Decisions

Risk: broad autonomous correction permissions could expand scope. Decision: limit corrections to defects exposed by named checks and the approved task, with orchestrator coordination for shared files or scope changes.

Risk: a CI/DevOps agent could duplicate QA or specialist ownership. Recommendation: do not create one now. Reconsider only when CI work recurs across at least three independent tasks, requires dedicated provider/container/secrets expertise, or exceeds QA's validation scope; create it only with explicit ownership boundaries and security rules for credentials/deployments.

## 8. Progress & Completion

- [x] Preflight current branch, worktree, upstream and unpublished commits.
- [x] Create dedicated feature branch.
- [x] Update shared rules and all existing agent definitions.
- [x] Create the mandatory stable-identifier plan.
- [x] Parse TOML and validate routing/safeguards.
- [x] Confirm no application code was modified.

Estimates: AI-assisted configuration implementation and focused validation: 20–35 minutes, assuming local TOML tooling is available; confidence high. Human review and acceptance validation: 10–20 minutes, primarily checking wording and routing fit; confidence medium. Environmental blocker/setup time: none confirmed. Optional CI/DevOps agent creation is excluded from the core estimate and not performed.
