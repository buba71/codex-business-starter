# Project Instructions

## Project adapter

This section contains repository-specific context. The workflow and agent profiles remain stack- and forge-neutral.

- Stack: Symfony 7.4 and PHP with Doctrine/PostgreSQL in `backend/`; Vue 3, Vite and Vitest are also under `backend/`.
- Architecture: Symfony controllers handle HTTP, services own business logic, repositories own persistence, and Vue presents frontend state through the existing Symfony UX integration.
- Paths: Vue sources and colocated tests are in `backend/assets/vue/`; PHP tests are in `backend/tests/`.
- Validation: run `php bin/phpunit`, `vendor/bin/phpstan analyse`, `vendor/bin/php-cs-fixer check --diff --verbose`, `npm test`, `npm run lint` and `npm run build` from `backend/` as applicable. Database-backed tests require the isolated PostgreSQL test environment.
- CI: GitHub Actions is defined in `.github/workflows/ci.yml`; it runs backend, frontend, security and code-quality jobs.
- Forge: this repository uses GitHub Issues, Pull Requests and Actions. Equivalent issue, pull/merge-request and CI concepts may be used when this workflow is adapted elsewhere.
- Special constraints: protect authentication, authorization, user data and secrets; do not run destructive database operations against shared environments.
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
| Planner | Requirements, scope, plan and estimates | Assigned file under `docs/plans/` only | Application code, tests, configuration, branches, external systems or dependencies |
| Product Analyst | Product goals, users, functional scope, user stories and verifiable acceptance criteria | Assigned functional documentation only | Architecture, application code, validated requirements, tests, configuration, branches, external systems or dependencies |
| Software Architect | Architecture analysis, technical options, contracts, risks and proposed ADRs | Assigned architecture documentation, including `docs/architecture.md`, and new ADRs under `docs/architecture/adr/` | Application code, migrations, infrastructure, deployment, accepted ADRs without explicit approval, branches, external systems or dependencies |
| Backend | Assigned server-side/application implementation surface and related tests | Assigned implementation files and in-scope tests | Unassigned frontend work, contracts without coordination, Git publication or dependencies |
| Frontend | Assigned client-side/presentation implementation surface and related tests | Assigned implementation files and in-scope tests | Unassigned backend work, contracts without coordination, Git publication or dependencies |
| QA | Acceptance evidence, regression checks and test diagnosis | Assigned tests, fixtures or QA configuration only when explicitly in scope | Application implementation, unsafe database operations or Git state |
| Reviewer | Independent correctness, security and regression review | Nothing in implementation scope | Any implementation, test, Git or external-system modification |

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

## Delivery and external systems

- Do not commit, push, create or modify a pull/merge request, merge, or deploy unless explicitly authorized.
- Never merge into the protected default branch or deploy without explicit approval.
- Keep delivery requests focused and describe their scope, validation and limitations.
- Request review when the change warrants it, especially for security, data, dependency or API-contract changes.

## Optional Skills

The repository's `symfony-review` and `vue-review` Skills are optional specializations. Activate them only when the changed surface and review request make them relevant; they are not requirements of the workflow itself.

## Workflow source

The canonical portable workflow is maintained in [codex-workflow](https://github.com/buba71/codex-workflow). Updates are intentional and manual: review and adapt source changes when needed; do not synchronize automatically or overwrite Starter Kit conventions.
