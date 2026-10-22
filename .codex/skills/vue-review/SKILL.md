---
name: vue-review
description: Review Vue 3 and JavaScript frontend changes for reactivity, component contracts, async behavior, security, user states, regressions, and Vitest coverage. Use for frontend-only or full-stack reviews; do not use for Symfony/PHP-only changes or implementation work.
---

# Vue frontend review

Use this skill when the user asks to review Vue 3/JavaScript changes, a frontend diff, a component, a composable, or the frontend portion of a full-stack change. It may be invoked explicitly with `$vue-review` or selected automatically from the request. Do not use it for Symfony/PHP-only reviews, feature implementation, refactoring without a review request, or documentation-only changes.

## Scope and safety

- Inspect only the requested files, relevant tests, and the corresponding Git diff. Read adjacent stores, API clients, or configuration only when needed to validate a finding.
- Work read-only: do not edit files, install dependencies, change generated assets, commit, push, or alter Git state.
- Follow the repository's `AGENTS.md`; do not repeat its permanent project rules here.
- Read [references/frontend-checklist.md](references/frontend-checklist.md) for the review criteria.

## Review method

1. Establish the review scope from the user request and actual diff.
2. Trace changed components, composables, stores, API clients, routing, authentication integration, and colocated tests as applicable.
3. Check rendering behavior, state transitions, request cancellation or races, security boundaries, accessibility-relevant states, and test coverage against the checklist.
4. Report only actionable findings. For each finding include `BLOCKER`, `MAJOR`, or `MINOR`, the exact absolute or repository-relative file and line, the confirmed behavior, impact, and a minimal recommended fix.
5. Separate confirmed defects from unverified risks or follow-up questions. State when no actionable finding was confirmed and list validation not performed.

For a full-stack request, this skill can be used together with `$symfony-review`; neither skill requires a third orchestration skill.
