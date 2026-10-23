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

- Before implementing a feature, bug fix or refactoring, inspect the current branch and Git working tree.
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
