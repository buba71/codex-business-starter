# Implementation Plan: Atelier 28 Agent Roles

## 1. Context & Objective

Add Product Analyst and Software Architect as bounded operational profiles while preserving the responsibilities and permissions of the five existing agents.

## 2. Scope & Acceptance Criteria

- Add two valid TOML profiles with non-overlapping write permissions.
- Extend the responsibility matrix from five to seven agents.
- Define activation rules for new products, existing-system recovery, structural evolution and simple corrections.
- Define Proposed/Accepted ADR handling without creating an ADR or PRD.
- Preserve existing application, skill, execution-policy and global configuration boundaries.

## 3. Technical Approach

Reuse the existing agent TOML fields and models. Update only the shared responsibility matrix, workflow routing and roadmap status; keep Backend, Frontend, Planner, QA and Reviewer profiles unchanged.

## 4. Implementation Tasks & Ownership

| Task | Responsible agent | Dependencies | Status |
| --- | --- | --- | --- |
| Inspect Git, workflow, roadmap, profiles and architecture conventions | Session owner | Clean worktree and current main | Complete |
| Add Product Analyst and Software Architect profiles | Session owner | Existing TOML conventions | Complete |
| Update matrix, routing and roadmap | Session owner | Profile boundaries | Complete |
| Validate syntax, permissions, contradictions and diff hygiene | Session owner | All configuration edits | Complete |

## 5. Execution Strategy

Work sequentially on `codex/atelier-28-agent-roles`. No sub-agent, worktree, dependency, application-code, GitHub-write or publication operation is in scope.

## 6. Validation Strategy

Parse all seven TOML profiles, inspect permission wording and routing boundaries, verify ADR paths and approval language, run `git diff --check`, and confirm only requested documentation/configuration files changed.

## 7. Risks & Decisions

Risk: Product Analyst could overlap with Planner. Decision: Product Analyst owns discovery and functional clarity; Planner owns accepted scope, sequencing and implementation plans.

Risk: Software Architect could authorize implementation. Decision: the architect proposes technical decisions and ADRs; explicit user validation is required before an ADR is Accepted.

## 8. Progress & Completion

- [x] Complete Git preflight and create a dedicated branch from updated main.
- [x] Inspect existing conventions and architecture documentation.
- [x] Add the two profiles and update integration documentation.
- [x] Complete focused validation and final Git status report.
