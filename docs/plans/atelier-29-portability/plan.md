# Implementation Plan: Atelier 29 — Workflow Portability

## 1. Context & Objective

Make the seven-agent Codex workflow reusable across repositories and technology stacks while preserving the Starter Kit's current behavior, project-specific validation commands, optional Symfony/Vue Skills, gates and human authorization boundaries.

## 2. Scope & Acceptance Criteria

- Keep the seven existing agent profiles and their ownership, permissions and restrictions.
- Remove mandatory Symfony, Vue, PostgreSQL and GitHub assumptions from generic profiles and workflow text.
- Centralize Starter Kit stack, paths, validation commands, CI, forge and special constraints in `AGENTS.md`.
- Preserve PRD, user-story, plan and ADR conventions without adding unnecessary mandatory documents.
- Do not modify application code, Skills, global Exec Policy or personal global configuration.
- Parse all seven TOML files, verify permission/routing wording, run `git diff --check`, and complete a focused review.

## 3. Technical Approach

Keep the current file layout. Make the seven TOML profiles and `docs/codex-workflow.md` technology- and forge-neutral. Use the existing project `AGENTS.md` as the small project adapter containing the Starter Kit's Symfony/Vue/PostgreSQL paths and commands. Leave `symfony-review` and `vue-review` as optional specialized Skills.

## 4. Implementation Tasks & Ownership

| Task | Responsible agent | Dependencies | Status |
| --- | --- | --- | --- |
| Complete Git preflight and create the dedicated branch | Session owner | Explicit user authorization | Complete |
| Record this versioned implementation plan | Session owner acting as Planner | G1 before implementation | Complete |
| Make agent profiles stack- and forge-neutral | Session owner | Project adapter wording | Complete |
| Update workflow and project adapter documentation | Session owner | Generic profile boundaries | Complete |
| Validate TOML, permissions, routing and diff hygiene | Session owner acting as QA/Reviewer | All documentation changes | Complete |

## 5. Execution Strategy

Work sequentially on `codex/atelier-29-portability`. Modify only `.codex/agents/*.toml`, `AGENTS.md`, `docs/codex-workflow.md`, and this plan. Do not add agents, orchestrators, dependencies, application changes, Skills, global rules or personal configuration changes. Do not commit, push or create a PR without explicit authorization.

## 6. Validation Strategy

- Parse all seven TOML files with an available TOML parser.
- Inspect each profile for preserved ownership, write boundaries, non-modification rules and human authorization constraints.
- Confirm project-specific Symfony/Vue commands remain in `AGENTS.md`.
- Search generic workflow/profile text for unintended mandatory Symfony, Vue, PostgreSQL or GitHub assumptions.
- Run `git diff --check` and inspect the complete diff and status.

## 7. Risks & Decisions

- Risk: removing stack-specific commands from profiles could make validation less actionable. Decision: retain the exact commands in the project adapter and require agents to consult it.
- Risk: generic forge wording could weaken delivery safeguards. Decision: preserve explicit authorization for issue tracking, pull/merge requests, commits, pushes, merges, deployments and CI delivery.
- Risk: a generic Backend or Frontend role may be interpreted too broadly. Decision: keep the seven names and ownership boundaries, while making the project adapter define the actual technical surfaces.

## 8. Progress & Completion

- [x] Fast-forward local `main` to `origin/main`.
- [x] Create `codex/atelier-29-portability`.
- [x] Inspect the seven profiles, workflow and project instructions.
- [x] Create the G1 plan before implementation.
- [x] Apply the portability changes.
- [x] Complete focused validation and targeted review.

Validation evidence: all seven TOML files parsed successfully with Python `tomllib`; generic profiles, workflow and roadmap contain no Symfony, Vue, PostgreSQL or forge-specific commands; project-specific commands remain in `AGENTS.md`; `git diff --check` passed; no application or Skill files changed.
