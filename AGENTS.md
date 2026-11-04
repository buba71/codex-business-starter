# Project Instructions

## Context

- The application uses Symfony 7.4, PHP, Doctrine and PostgreSQL in `backend/`.
- Vue 3 sources and colocated Vitest tests are in `backend/assets/vue/`; PHP tests are in `backend/tests/`.
- Write code, comments, commits and technical documentation in English.

## Project rules

- Preserve the existing architecture and project conventions; do not refactor outside the approved scope.
- Protect authentication, authorization, user data and secrets; report security-sensitive trade-offs.
- Add or change a dependency only with a clear justification, a compatible supported version, and verification against the existing stack.
- Run validation proportionate to the change, including relevant functional checks when practical.
- State changed files, validation performed and remaining limitations in the final report.

## Workflow and agents

- Follow `docs/codex-workflow.md` for detailed gates, handoffs and complexity levels; the essential rules below remain applicable even when that document is not loaded.
- Qualify each request by type, scope, complexity and risk before acting. Simple work may use a concise in-session mini-plan; standard or complex work requires a versioned plan under `docs/plans/`.
- The session owner selects the minimum useful agents, coordinates execution and requests Planner revisions for significant scope or architectural changes. QA and Reviewer involvement remains proportional to risk.
- Execute sequentially by default. Human approval is required before parallel agent work or worktrees. Git, security, data and publication safeguards apply at every complexity level.
- Use ADRs only for decisions that materially structure the architecture, contracts or long-term operation.
- Specialist agents may modify assigned files and tests within the approved scope. They may correct in-scope validation failures without repeated permission.
- Ordinary tasks do not require multi-agent delegation, worktrees or pull requests.

## Responsibilities and permissions

| Agent | Owns | May modify | Must not modify |
| --- | --- | --- | --- |
| Planner | Requirements, scope, plan and estimates | Assigned file under `docs/plans/` only | Application code, tests, configuration, branches, GitHub or dependencies |
| Product Analyst | Product goals, users, functional scope, user stories and verifiable acceptance criteria | Assigned functional documentation only | Architecture, application code, validated requirements, tests, configuration, branches, GitHub or dependencies |
| Software Architect | Architecture analysis, technical options, contracts, risks and proposed ADRs | Assigned architecture documentation, including `docs/architecture.md`, and new ADRs under `docs/architecture/adr/` | Application code, migrations, infrastructure, deployment, accepted ADRs without explicit approval, branches, GitHub or dependencies |
| Backend | Symfony, PHP, Doctrine, Twig and backend tests | Assigned backend files and in-scope backend tests | Unassigned frontend work, Git publication or dependencies |
| Frontend | Vue, JavaScript, Vite, styling and frontend tests | Assigned frontend files and in-scope frontend tests | Unassigned backend work, API contracts without coordination, Git publication or dependencies |
| QA | Acceptance evidence, regression checks and test diagnosis | Assigned tests, fixtures or QA configuration only when explicitly in scope | Application implementation, unsafe database operations or Git state |
| Reviewer | Independent correctness, security and regression review | Nothing in implementation scope | Any implementation, test, Git or GitHub modification |

Shared files and contracts require coordination before editing. The session owner may narrow an assignment but may not silently expand it.

## Git workflow

- Before implementing a feature, bug fix or refactoring, inspect the current branch and Git working tree.
- Before creating a feature branch, perform Git preflight, run `git fetch origin`, and verify local `main` is synchronized with `origin/main`.
- If local `main` is behind, update it with fast-forward only when safe, then create the feature branch from the updated `main`.
- If branches have diverged or local changes could be affected, stop and report the blocker. Never use automatic rebase, reset, force-push or other destructive operations to resolve divergence.
- If the task branch already exists, do not recreate it or automatically change its base. Report its relationship to `origin/main` and request authorization before corrective history operations.
- Work on a dedicated feature or fix branch, never directly on `main`. Creating or switching branches requires explicit user authorization.
- Never reset, stash, discard or overwrite existing user changes without explicit permission.
- Never commit, push, merge or delete branches without explicit authorization.
- Use Git worktrees when parallel tasks require isolated working directories.
- Before committing, verify that only intended files are staged.

These Git safeguards apply independently of task complexity.

## GitHub delivery

- Do not commit, push, create or modify pull requests, merge, or deploy unless explicitly authorized.
- Never merge into `main` or deploy without explicit approval.
- Keep pull requests focused and describe their scope, validation and known limitations.
- Request review when the change warrants it, especially for security, data, dependency or API-contract changes.
