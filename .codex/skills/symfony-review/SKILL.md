---
name: symfony-review
description: Review Symfony, PHP, Doctrine, and API backend changes for correctness, security, data integrity, regressions, and PHPUnit coverage. Use for backend-only or full-stack reviews; do not use for Vue-only changes or implementation work.
---

# Symfony backend review

Use this skill when the user asks to review Symfony/PHP/Doctrine changes, a backend diff, an API change, or the backend portion of a full-stack change. It may be invoked explicitly with `$symfony-review` or selected automatically from the request. Do not use it for Vue-only reviews, feature implementation, refactoring without a review request, or documentation-only changes.

## Scope and safety

- Inspect only the requested files, relevant tests, and the corresponding Git diff. Read adjacent configuration or domain code only when needed to validate a finding.
- Work read-only: do not edit files, run migrations, change dependencies, commit, push, or alter Git state.
- Follow the repository's `AGENTS.md`; do not repeat its permanent project rules here.
- Read [references/backend-checklist.md](references/backend-checklist.md) for the review criteria.

## Review method

1. Establish the review scope from the user request and actual diff.
2. Trace changed controllers, services, repositories, entities, forms/validators, security configuration, migrations, and tests as applicable.
3. Check behavior, authorization boundaries, persistence effects, failure handling, and test coverage against the checklist.
4. Report only actionable findings. For each finding include `BLOCKER`, `MAJOR`, or `MINOR`, the exact absolute or repository-relative file and line, the confirmed behavior, impact, and a minimal recommended fix.
5. Separate confirmed defects from unverified risks or follow-up questions. State when no actionable finding was confirmed and list validation not performed.

For a full-stack request, this skill can be used together with `$vue-review`; neither skill requires a third orchestration skill.
