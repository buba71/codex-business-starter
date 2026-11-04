# Codex Workflow

This workflow is the repository's concise operating model for Issue-driven work. It uses the configured Planner, Product Analyst, Software Architect, Backend, Frontend, QA and Reviewer profiles; it does not require another agent, orchestrator, worktree or automation mechanism.

The deferred capability boundaries are documented in [`docs/codex-agent-roadmap.md`](codex-agent-roadmap.md); that roadmap does not create or activate additional profiles.

## Complexity levels

Choose the smallest level that safely covers the request:

- **Simple** — concise plan, direct implementation or one specialist, focused validation, and review only when risk warrants it.
- **Standard** — complete plan, explicit ownership, relevant specialist work, QA evidence and proportional independent review.
- **Complex or sensitive** — complete plan, explicit file ownership and sequencing, dedicated QA, independent review, and human acceptance for security, authorization, data, dependency or API-contract changes.

Complexity may reduce ceremony, never safety. Git, security, authorization, data-integrity and publication safeguards remain mandatory.

## Qualification and agent selection

Before choosing a gate sequence, classify the request as a new product, a recovery of an existing system, or an evolution/correction. Record the affected technical areas and the relevant security, data, architecture, regression and deployment risks.

Use the minimum capability that covers the work:

- Codex may work directly on clear, low-risk Simple tasks.
- Product Analyst is activated for a new product when objectives, users, business needs, functional scope, MVP boundaries or acceptance criteria require clarification.
- Planner is activated when requirements, ownership, dependencies or acceptance criteria need clarification, and for Standard or Complex work.
- Software Architect is activated for recovery of an existing system when architecture or risks require deeper analysis, or for an evolution that crosses boundaries, changes a contract, introduces a major dependency or requires a material technical decision.
- Backend and Frontend are activated only for their respective implementation surfaces.
- QA is activated when several acceptance criteria, layers, regressions or sensitive behavior require evidence.
- Reviewer is activated for API, security, data, dependency, architecture or other risk that merits independent review.

Sequence agents by default. Parallel execution or worktrees require explicit human approval and genuinely independent scopes. Do not activate an agent solely to obtain a redundant status report.

For a new product, Product Analyst precedes Planner when clarification is needed. For recovery of an existing system, Software Architect may precede planning when architecture or risk analysis is needed. For a major technical decision during an evolution, Software Architect proposes the decision and its consequences; Planner organizes approved work, while Reviewer checks conformance. A simple correction does not activate either profile systematically.

Use an ADR only when a decision materially structures architecture, contracts or long-term operations. Do not create one for ordinary implementation choices.

Software Architect writes new ADRs under `docs/architecture/adr/` with status `Proposed` and sections for context, options, proposed decision and consequences. The architect never accepts an ADR alone. An ADR becomes `Accepted` only after explicit user validation; an accepted decision is not silently edited, and a replacement decision requires a new ADR.

## Gates

### G0 — Preflight

Confirm:

- requested outcome, exclusions and acceptance criteria;
- applicable `AGENTS.md`, agent profile and relevant Skill;
- current branch, worktree, upstream and local changes;
- whether the task requires a dedicated branch and explicit authorization.

Stop and report a blocker when local work, branch divergence, missing authority or an unsafe environment prevents sound progress.

### G1 — Plan

For Simple work, record a concise mini-plan in the active session: outcome, scope, validation and risks. Do not create a plan file solely to satisfy the gate.

For Standard or Complex work, a versioned plan under `docs/plans/` must exist before G2 begins. The Planner creates or updates `docs/plans/issue-XX/plan.md`, or a stable descriptive directory when no Issue number exists. The plan keeps the eight standard sections and identifies scope, acceptance criteria, ownership, dependencies, validation, risks and progress. The plan must not be created retroactively during or after implementation.

Before G2, Codex principal communicates the plan path in the active session together with a concise summary of scope, responsibilities, validation and risks. This communication is a coordination handoff, not an approval request, unless a decision explicitly requires human arbitration. If delegation is prohibited, Codex principal may perform the Planner responsibilities directly and must record that ownership in the plan. The session owner verifies the applicable plan before implementation and requests a revision when scope, architecture, ownership or acceptance criteria are materially unclear.

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

### Human acceptance before delivery

This gate applies only when a change affects security, authentication or authorization, data integrity or migrations, dependencies, API contracts, infrastructure, deployment, or another explicitly identified sensitive boundary. Ordinary Standard changes do not require an additional acceptance gate solely because they are Standard.

Two approvals remain distinct:

- **Operational authorization** is required before executing a destructive, irreversible or externally visible operation. It must be explicit before the operation and cannot be supplied retroactively by a later issue or PR approval.
- **Delivery acceptance** is required after implementation, QA and Review, before the change is delivered. Acceptable evidence is an explicit user validation in the current task, an issue acceptance that covers the implemented scope, or a PR approval after the diff and validation are available.

The session owner records the evidence and the scope it covers. If the required approval is absent, the affected operation or the G5 delivery step is blocked; work may continue only in a safe, non-delivery state.

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
