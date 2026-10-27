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

## Agent profiles

- The profiles in `.codex/agents/` provide specialized backend, frontend and review guidance only when those agents are explicitly delegated work.
- Ordinary tasks do not require multi-agent orchestration, worktrees or pull requests.
- The Planner creates `docs/plans/issue-XX/plan.md` (or a stable descriptive task identifier when no issue number exists) before implementation begins.
- The orchestrator verifies the plan, coordinates execution, updates progress tracking and requests Planner revisions for significant scope or architectural changes.
- Specialist agents may modify assigned application code and tests without repeated permission requests within the approved task scope.
- Specialists may correct relevant PHPStan, PHP-CS-Fixer, PHPUnit, ESLint, Vitest and build failures autonomously when those corrections remain in scope.
- Multiple correction and validation cycles are allowed within the approved task scope.
- Avoid unnecessary delegation and micro-prompts; keep independent final review proportional to risk.

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

## GitHub delivery

- Keep pull requests focused and describe their scope, validation and known limitations.
- Request review when the change warrants it, especially for security, data, dependency or API-contract changes.
- Do not create branches, push, merge or modify pull requests unless requested.
