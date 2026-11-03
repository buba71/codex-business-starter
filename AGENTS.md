# Project Instructions

## Context

- The application uses Symfony 7.4, PHP, Doctrine and PostgreSQL in `backend/`.
- Vue 3 sources and colocated Vitest tests are in `backend/assets/vue/`; PHP tests are in `backend/tests/`.
- Write code, comments, commits and technical documentation in English.

## Working rules

- Inspect relevant code, configuration and project conventions before changing anything.
- Keep changes scoped to the request and preserve unrelated local work.
- Raise a missing business requirement only when it blocks a sound implementation.
- Protect authentication, authorization, user data and secrets; report security-sensitive trade-offs.
- Add or change a dependency only with a clear justification, a compatible supported version, and verification against the existing stack.
- Run validation proportionate to the change, including relevant functional checks when practical.
- In the final report, state what changed, validation performed, and any remaining limitations.

## Instruction precedence

- Higher-priority system and user instructions override this file. These repository rules apply to every delegated agent and task unless a more specific applicable instruction says otherwise.
- Follow `docs/codex-workflow.md` for the gates, handoffs and complexity levels. Planning is required before implementation and must remain proportional to the task.
- The session owner coordinates agents and handoffs; this does not require creating another agent, orchestrator, worktree or automation mechanism.

## Agent profiles

- The profiles in `.codex/agents/` provide specialized backend, frontend and review guidance only when those agents are explicitly delegated work.
- Ordinary tasks do not require multi-agent delegation, worktrees or pull requests.
- The Planner creates `docs/plans/issue-XX/plan.md` (or a stable descriptive task identifier when no issue number exists) before implementation begins.
- The session owner verifies the plan, coordinates execution, updates progress tracking and requests Planner revisions for significant scope or architectural changes.
- Specialist agents may modify assigned application code and tests without repeated permission requests within the approved task scope.
- Specialists may correct relevant PHPStan, PHP-CS-Fixer, PHPUnit, ESLint, Vitest and build failures autonomously when those corrections remain in scope.
- Multiple correction and validation cycles are allowed within the approved task scope.
- Avoid unnecessary delegation and micro-prompts; keep independent final review proportional to risk.

## Responsibilities and permissions

| Agent | Owns | May modify | Must not modify |
| --- | --- | --- | --- |
| Planner | Requirements, scope, plan and estimates | Assigned file under `docs/plans/` only | Application code, tests, configuration, branches, GitHub or dependencies |
| Backend | Symfony, PHP, Doctrine, Twig and backend tests | Assigned backend files and in-scope backend tests | Unassigned frontend work, Git publication or dependencies |
| Frontend | Vue, JavaScript, Vite, styling and frontend tests | Assigned frontend files and in-scope frontend tests | Unassigned backend work, API contracts without coordination, Git publication or dependencies |
| QA | Acceptance evidence, regression checks and test diagnosis | Assigned tests, fixtures or QA configuration only when explicitly in scope | Application implementation, unsafe database operations or Git state |
| Reviewer | Independent correctness, security and regression review | Nothing in implementation scope | Any implementation, test, Git or GitHub modification |

Shared files and contracts require coordination before editing. The session owner may narrow an assignment but may not silently expand it.

## Git workflow

- Before implementing a feature, bug fix or refactoring, inspect the current branch and Git working tree.
- Before creating a new feature branch, perform Git preflight, run `git fetch origin`, and verify that local `main` is synchronized with `origin/main`.
- If local `main` is behind `origin/main`, update it with fast-forward only when safe, then create the feature branch from the updated `main`.
- If branches have diverged or local changes could be affected, stop and report the blocker. Never use automatic rebase, reset, force-push or other destructive operations to resolve divergence.
- If the current task's feature branch already exists, do not recreate it or automatically change its base. Report its relationship to `origin/main` and request authorization before any corrective history operation.
- Work on a dedicated feature or fix branch, never directly on `main`. If a task starts on `main`, stop and request authorization to create or switch to a dedicated branch.
- Creating or switching branches requires explicit user authorization unless it is granted in the current request.
- Never reset, stash, discard or overwrite existing user changes without explicit permission; preserve unrelated files and changes.
- Never commit, push, merge or delete branches without explicit authorization.
- Use Git worktrees when parallel tasks require isolated working directories.
- Before committing, verify that only the intended files are staged.

Git safeguards apply independently of task complexity. A concise plan or single-agent workflow never authorizes branch changes, commits, pushes, merges, resets, stashes, rebases, cleans or deletion.

## GitHub delivery

- Do not commit, push, create or modify pull requests, merge, or deploy unless explicitly authorized. Authorization for one operation does not imply authorization for unrelated operations.
- Never merge into `main` or deploy without explicit approval.
- Keep pull requests focused and describe their scope, validation and known limitations.
- Request review when the change warrants it, especially for security, data, dependency or API-contract changes.
