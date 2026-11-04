# Codex Workflow

This is the universal operating model for change-driven work. The consuming project supplies its stack, paths, commands, CI, forge and security constraints through a project adapter.

## Complexity levels

- **Simple** — concise plan, direct implementation or one specialist, focused validation, and review only when risk warrants it.
- **Standard** — complete plan, explicit ownership, relevant specialist work, QA evidence and proportional independent review.
- **Complex or sensitive** — complete plan, explicit file ownership and sequencing, dedicated QA, independent review, and human acceptance for security, authorization, data, dependency, API-contract, infrastructure or deployment changes.

Complexity may reduce ceremony, never safety.

## Qualification and activation

Classify the request as a new product, recovery of an existing system, or evolution/correction. Record affected technical areas and security, data, architecture, regression and deployment risks.

Use the minimum capability that covers the work:

- Product Analyst clarifies goals, users, functional scope and acceptance criteria when needed, especially for a new product.
- Planner is activated when requirements, ownership, dependencies or acceptance criteria need clarification, and for Standard or Complex work.
- Software Architect is activated for recovery analysis or structural decisions involving boundaries, contracts, integrations, dependencies or ADRs.
- Backend and Frontend are activated only for their assigned implementation surfaces.
- QA is activated when several acceptance criteria, layers, regressions or sensitive behavior require evidence.
- Reviewer is activated for API, security, data, dependency, architecture or other risk that merits independent review.

Sequence agents by default. Parallel execution or worktrees require explicit human approval and genuinely independent scopes. Do not activate an agent for a redundant status report.

Product Analyst precedes Planner when product clarification is needed. Software Architect may precede Planner for recovery or architecture analysis. A simple correction does not activate either systematically.

## Gates

### G0 — Preflight

Confirm the requested outcome, exclusions, acceptance criteria, project adapter, applicable profile and optional Skill, current branch/worktree/upstream/local changes, and whether a dedicated branch or explicit authorization is required. Stop when local work, branch divergence, missing authority or an unsafe environment prevents sound progress.

### G1 — Plan

Simple work uses a concise in-session mini-plan. Standard or Complex work requires a versioned plan under `docs/plans/` before implementation, with these eight sections:

1. Context & Objective
2. Scope & Acceptance Criteria
3. Technical Approach
4. Implementation Tasks & Ownership
5. Execution Strategy
6. Validation Strategy
7. Risks & Decisions
8. Progress & Completion

The session owner verifies the plan before implementation. The plan is never created retroactively.

### G2 — Implementation

The assigned agent inspects existing conventions, changes only approved files, coordinates shared files/contracts, and runs focused project-adapter checks. No dependency, migration, branch, commit, push, merge or publication is implied.

### G3 — QA

QA maps acceptance criteria to observable evidence, runs safe relevant checks, separates application defects from environment blockers, and reports commands, outcomes, uncovered scenarios, blockers and side effects.

### G4 — Review

The Reviewer independently inspects the actual diff and relevant source. Findings are actionable and classified `BLOCKER`, `MAJOR` or `MINOR`, with exact locations, impact and minimal fixes. Owners address findings in scope and QA revalidates affected behavior.

### Human acceptance

Operational authorization is required before destructive, irreversible or externally visible operations. Delivery acceptance is required after implementation, QA and review for sensitive boundaries. Neither approval may be inferred retroactively.

### G5 — Delivery and CI

Creating or updating a commit, push, pull/merge request, merge or deployment requires explicit authorization. When authorized, check the diff and staged files, state scope/validation/limitations, verify relevant CI, and record remaining risks.

## Product and architecture artifacts

Use the smallest appropriate artifact: PRD or functional document for product discovery, user stories and acceptance criteria for user-facing behavior, a versioned technical plan for Standard/Complex work, and a Proposed ADR only for material architectural decisions. Accepted ADRs require explicit user validation.

## Handoff format

```text
Status: ready | blocked | needs-review
Scope: files inspected or changed
Decisions: decisions and assumptions
Evidence: commands and results
Risks: unresolved risks or missing validation
Handoff: next owner and required action
```
