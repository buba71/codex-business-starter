# Codex Workflow

This workflow is the repository's concise operating model for Issue-driven work. It uses the existing Planner, Backend, Frontend, QA and Reviewer profiles; it does not require another agent, orchestrator, worktree or automation mechanism.

## Complexity levels

Choose the smallest level that safely covers the request:

- **Simple** — concise plan, direct implementation or one specialist, focused validation, and review only when risk warrants it.
- **Standard** — complete plan, explicit ownership, relevant specialist work, QA evidence and proportional independent review.
- **Complex or sensitive** — complete plan, explicit file ownership and sequencing, dedicated QA, independent review, and human acceptance for security, authorization, data, dependency or API-contract changes.

Complexity may reduce ceremony, never safety. Git, security, authorization, data-integrity and publication safeguards remain mandatory.

## Gates

### G0 — Preflight

Confirm:

- requested outcome, exclusions and acceptance criteria;
- applicable `AGENTS.md`, agent profile and relevant Skill;
- current branch, worktree, upstream and local changes;
- whether the task requires a dedicated branch and explicit authorization.

Stop and report a blocker when local work, branch divergence, missing authority or an unsafe environment prevents sound progress.

### G1 — Plan

The Planner creates or updates `docs/plans/issue-XX/plan.md`, or a stable descriptive directory when no Issue number exists. The plan keeps the eight standard sections, but each section is concise for simple work. It identifies scope, acceptance criteria, ownership, dependencies, validation, risks and progress.

The session owner verifies the plan before implementation and requests a revision when scope, architecture, ownership or acceptance criteria are materially unclear.

### G2 — Implementation

The assigned agent:

- inspects existing code and conventions before editing;
- changes only owned files and approved scope;
- coordinates before editing shared files or contracts;
- runs focused checks and corrects only in-scope failures.

No dependency, API contract, migration, branch, commit, push, merge or publication is implied by this gate.

### G3 — QA

QA maps acceptance criteria to observable evidence, runs safe relevant checks, and separates application defects from environment or infrastructure blockers. QA may change only explicitly assigned tests, fixtures or QA configuration.

The result must state commands, outcomes, uncovered scenarios, blockers and generated artifacts or side effects.

### G4 — Review

The Reviewer inspects the actual diff and relevant source independently. Review is proportional to risk and reports only actionable `BLOCKER`, `MAJOR` or `MINOR` findings with exact locations and minimal fixes.

Implementation owners address findings within scope; QA revalidates affected behavior. Unresolved risks are recorded explicitly.

### G5 — PR and CI

Creating or updating a commit, push, PR, merge or deployment requires explicit authorization. When authorized:

- the diff and staged files are checked;
- the PR states scope, validation and limitations;
- CI is verified, including relevant backend, frontend, security and quality jobs;
- the final report records remaining limitations.

## Common handoff format

Every agent uses this compact format:

```text
Status: ready | blocked | needs-review
Scope: files inspected or changed
Decisions: decisions and assumptions
Evidence: commands and results
Risks: unresolved risks or missing validation
Handoff: next owner and required action
```

The session owner coordinates sequencing and handoffs but does not grant permissions that conflict with `AGENTS.md`, the user request or the repository's Git safeguards.
