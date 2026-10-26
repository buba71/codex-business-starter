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

## Git workflow

- Before development tasks, perform and report a Git preflight covering the current branch, upstream, working tree and untracked files, unfinished Git operations, unpublished commits, remote divergence when verifiable, and registered worktrees. Treat detached HEAD as a condition to assess, not automatically as an error; it can be normal in a Codex-managed worktree. Keep the report concise when everything is normal, report remote verification limitations, and stop only for a genuine risk or blocker.
- Never implement changes directly on `main`; use a dedicated feature or fix branch. Request authorization before creating or switching branches unless it is already granted in the current request.
- Prefer the current local checkout for ordinary sequential tasks and do not create worktrees automatically. If parallel execution would help, first propose the agents, worktree layout, integration strategy, and risks, then wait for explicit approval before creating worktrees or starting parallel execution.
- Assess whether existing changes belong to the current task before proceeding, and preserve unrelated changes. Never reset, clean, stash, discard, overwrite, or delete user work without explicit authorization. Never force-remove a worktree or delete one containing unpreserved work.
- Avoid unnecessary Git operations and repeated approvals. Once an execution plan is approved, proceed with its authorized routine steps without asking again for each one. Report blockers clearly and request a decision only when necessary.
- Before committing, verify the staged file list and intended diff.

## GitHub delivery

- Do not commit, push, create or modify pull requests, merge, or deploy unless explicitly authorized. Authorization for one operation does not imply authorization for unrelated operations.
- Never merge into `main` or deploy without explicit approval.
- Keep pull requests focused and describe their scope, validation and known limitations.
- Request review when the change warrants it, especially for security, data, dependency or API-contract changes.
