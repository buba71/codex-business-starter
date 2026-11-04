# Implementation Plan: Fix Symfony Security Advisories

## 1. Context & Objective

Update the locked Symfony 7.4 dependencies affected by the Composer security advisories reported in CI run 41905280102, without changing application code or crossing a major Symfony version.

## 2. Scope & Acceptance Criteria

- Update only the Symfony dependency set required to resolve the reported advisories and compatible transitive dependencies.
- Preserve the `7.4.*` constraints in `backend/composer.json`.
- Make `composer audit --locked --no-interaction` pass.
- Keep `composer.json` changes absent unless a constraint change is demonstrably required.
- Run Composer validation, relevant backend tests and `git diff --check`.

## 3. Technical Approach

Use a targeted Composer update for the nine affected Symfony packages with `--with-all-dependencies`, inspect the resulting lock diff, and reject unrelated package or application changes.

## 4. Implementation Tasks & Ownership

| Task | Responsible agent | Dependencies | Status |
| --- | --- | --- | --- |
| Inspect CI failure and current Composer constraints/lock | Session owner | Clean branch from updated main | Complete |
| Resolve affected Symfony dependencies | Session owner | Composer audit and dry-run result | Complete |
| Validate Composer metadata, audit, tests and diff | Session owner | Updated lock file | Complete with environment blockers |

## 5. Execution Strategy

Work sequentially on `fix/symfony-security-advisories`. Modify only `backend/composer.lock` unless Composer proves a constraint change necessary. Do not modify agents, Skills, global rules or application code.

## 6. Validation Strategy

Run `composer validate`, `composer audit --locked --no-interaction`, targeted Symfony checks, PHPUnit, and `git diff --check`. Compare package versions before and after and inspect the complete lock diff.

## 7. Risks & Decisions

Risk: Symfony components must remain version-compatible. Decision: use the `7.4.*` constraints and update the affected component family only as required by Composer resolution.

Risk: the advisory database may change between local and CI execution. Decision: report any remaining advisories rather than suppressing or ignoring them.

## 8. Progress & Completion

- [x] Complete Git preflight and create the dedicated branch from updated main.
- [x] Diagnose CI and run the Composer update dry-run.
- [x] Apply the targeted dependency update.
- [x] Complete validation and final diff report.

Validation limitations: PHPUnit encountered 26 PostgreSQL connection errors because no test database was available locally. PHPStan could not open its local TCP server on `127.0.0.1:0`; Symfony container/YAML lint and PHP-CS-Fixer passed.
