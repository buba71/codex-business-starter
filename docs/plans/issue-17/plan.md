# Implementation Plan: Issue #17 — Customizable UI Design System and Admin Layout

## 1. Context & Objective

Build the reusable, responsive Vue 3 administration UI foundation requested by GitHub Issue #17, with a single place to customize branding and semantic design tokens. It must improve the existing admin, login, and Customer presentation without changing their authentication, authorization, Customer API, or business behavior.

**Verified inputs**

- GitHub Issue #17 and its zero comments: scope, acceptance criteria, exclusions, and sequencing. Issue #9 is closed; PR #16 is closed. Issues #10 (Customer CRUD) and #12 (dashboard KPIs) are open and excluded.
- Root `AGENTS.md`, `.codex/agents/{planner,frontend,backend,qa,reviewer}.toml`, `docs/architecture.md`, and `docs/codex-workflow.md`.
- Current frontend: `backend/assets/app.js` registers Vue controllers through Symfony UX; `CustomerDisplay.vue` is the only Vue UI component and has colocated Vitest coverage. `backend/package.json`, `vite.config.ts`, and the package lock contain Vue/Vite/Vitest/ESLint but no Tailwind, shadcn-vue, PrimeVue, CSS source, or CSS framework.
- Current server-rendered surfaces: `templates/base.html.twig`, `templates/admin/index.html.twig`, `templates/security/login.html.twig`, and `templates/customer/show.html.twig`; `/admin` is protected by `ROLE_ADMIN`, while Customer API requests use the existing session/CSRF-aware client.
- Existing functional coverage in `AuthenticationTest.php` and `CustomerViewControllerTest.php`, which must remain valid or be intentionally updated for the new markup.

**Documented assumptions**

- Branding is project-level, static configuration maintained by developers/deployers; it is not tenant- or user-supplied runtime data.
- “Logo” means an accessible local image/SVG reference plus a textual fallback, not an upload system or remote image proxy.
- A lightweight reusable component layer is sufficient for this starter. The requested table is presentational/data-agnostic; listing, mutation, filtering, pagination, and dashboard metrics remain for #10/#12.

## 2. Scope & Acceptance Criteria

**In scope**

- A documented choice among shadcn-vue, PrimeVue, and lightweight local components, based on the actual dependency-free Symfony UX/Vue setup.
- Central semantic tokens for light and dark themes: color roles, typography, spacing, borders, radii, elevation, focus treatment, and motion-reduction behavior.
- One project brand configuration for application name, logo reference/alt text, and palette overrides, usable by Twig and Vue without per-component edits.
- A responsive `/admin` shell (header, primary navigation, sidebar/drawer, main-content region, account/logout control, and mobile navigation control) that preserves the existing Symfony logout flow.
- Accessible local primitives for button, field/input, card, table, dialog, alert, and loading/empty/error states; use them in the shell and appropriate existing Customer/auth presentation rather than introducing business views.
- Theme selection (`light`, `dark`, and system default) with a non-sensitive local preference and an accessible toggle.
- Customization documentation and focused tests/acceptance checks.

**Acceptance criteria**

- Editing the central brand/theme configuration changes all token-consuming surfaces consistently, including the Vue shell and Twig-rendered entry pages, without component edits.
- Application name and logo are rendered from that configuration with meaningful alternative text/fallback; no runtime editor or uploaded asset is introduced.
- The admin shell is usable at desktop and narrow mobile widths: navigation is persistent on desktop, controllable as a keyboard-accessible drawer on mobile, and does not obscure main content.
- Each primitive has an explicit public contract and the required native semantics, labels, focus behavior, error association, and contrast/focus states; dialogs close with Escape and restore focus.
- Light/dark/system preferences apply consistently, meet agreed contrast checks for default tokens, and remain usable with reduced-motion preferences.
- Existing login/logout, admin authorization, Customer Vue data loading/error/retry behavior, and CSRF-aware HTTP client remain functional.
- Relevant lint, Vitest, Vite build, and safe PHPUnit checks pass; desktop/mobile and keyboard behavior are manually acceptance-checked; customization is documented.

**Explicitly out of scope**

- Customer list/create/edit/delete endpoints or UI (#10), dashboard/KPI/data work (#12), runtime theme editor, tenant-specific themes, user profile persistence, routing redesign, API-contract changes, database migrations, and a visual-regression/E2E test platform.

## 3. Technical Approach

1. **Dependency decision.** Record the short audit before coding. The current recommendation is **lightweight local Vue primitives plus CSS custom properties**, not PrimeVue or shadcn-vue/Tailwind:
   - PrimeVue would add a broad component and theme dependency for a very small current surface and would not naturally style the existing Twig forms.
   - shadcn-vue requires a Tailwind/tooling and copied-component maintenance decision; Tailwind is not installed today. It is not justified merely to create this foundation.
   - Semantic CSS variables let the same token layer style Twig and Vue, keep the bundle/dependency surface small, and leave a future Tailwind mapping possible. If the audit finds a concrete missing requirement that only a library covers, stop for approval before adding any dependency or configuration.

2. **Single branding boundary.** Add a project-owned brand configuration at the Symfony/Twig boundary (for example an `app.brand` parameter exposed as a Twig global) and serialize only the required, trusted display values into the page bootstrap for Vue. It supplies name, logo path/alt text, and light/dark palette values. A shared stylesheet maps those brand values into stable semantic tokens such as `--color-surface`, `--color-text`, `--color-primary`, `--color-danger`, and `--focus-ring`; components consume semantic names only, never raw palette values.

3. **Styling and themes.** Import a new application stylesheet from `assets/app.js`. Define base/reset/layout rules once, `:root`/`[data-theme='light']` and `[data-theme='dark']` token sets, `prefers-color-scheme` system behavior, `prefers-reduced-motion` handling, and responsive breakpoints. A small theme composable/controller validates the three preference values, applies `data-theme` to the document root, and safely falls back when storage or `matchMedia` is unavailable. Keep theme state client-only and non-sensitive.

4. **Composition.** Mount an `AdminShell` Vue controller from `templates/admin/index.html.twig`, passing only display identity and the already-generated logout URL/CSRF token needed by its standard POST form. Keep Symfony authentication, access control, routes, and the existing HTTP client unchanged. Apply the shared token stylesheet and small, semantic markup refinements to the login and Customer Twig surfaces; refactor `CustomerDisplay` only where a shared state/alert/button primitive preserves its current API behavior.

5. **Component contracts.** Place the primitives under a clearly separated shared UI directory (for example `assets/vue/ui/`) and document props, emitted events, slots, disabled/loading behavior, and accessibility guarantees. Prefer native controls and HTML table semantics. Implement a modal dialog only with focus containment, initial/return focus, Escape/backdrop policy, accessible name/description, and body-scroll behavior covered by tests; do not use `v-html` or render untrusted HTML.

6. **Documentation.** Add a concise design-system/customization guide identifying the one brand configuration, semantic token names, logo constraints, theme preference behavior, component usage, and the explicit non-goals above.

**Expected implementation touchpoints (subject to the confirmed component contracts)**

| Area | Existing files | Expected additions/changes |
| --- | --- | --- |
| Vite entry and styles | `assets/app.js`, `vite.config.ts` | Import shared CSS; Vite configuration stays unchanged unless the dependency decision is formally revised. |
| Vue UI | `assets/vue/controllers/CustomerDisplay.vue` | Add `AdminShell`, theme helper, and local UI primitives/tests; adapt Customer display only to reuse equivalent state/alert/button components. |
| Twig/configuration | `config/services.yaml`, `config/packages/twig.yaml`, `templates/{base,admin/index,security/login,customer/show}.html.twig` | Central brand global/bootstrap and semantic class/landmark markup; preserve server form actions and CSRF inputs. |
| Tests/docs | Existing Vitest and functional tests named above | Colocated primitive/shell/theme tests, updated selector assertions, and a customization guide. |

No REST endpoint, entity, repository, service, migration, or persistence contract is required. Backend involvement is limited to the trusted configuration/Twig bridge and functional regressions; any proposed API or data persistence expansion is a scope change.

## 4. Implementation Tasks & Ownership

| Task | Responsible agent | Dependencies | Status |
| --- | --- | --- | --- |
| Confirm the documented dependency audit and approve the local-component recommendation; escalate if a new dependency is truly required | Orchestrator + Frontend | This plan; issue scope | Pending |
| Define the one brand configuration, Twig global/page bootstrap, asset-path constraints, and preserve authorization/logout contracts | Backend | Approved dependency decision; existing `security.yaml` and Twig templates | Pending |
| Add token stylesheet, theme preference helper, and application entry import; validate light/dark/system and reduced-motion behavior | Frontend | Brand configuration contract | Pending |
| Build accessible local UI primitives with explicit component contracts and colocated Vitest tests | Frontend | Token layer | Pending |
| Build and mount responsive `AdminShell`; integrate the existing logout POST/CSRF input and apply shared presentation to login/Customer without implementing Customer CRUD | Frontend, with Backend for Twig template changes | Token layer, primitive contracts, Twig bootstrap | Pending |
| Update/extend Symfony functional assertions for retained login/admin/logout and Customer Vue mount behavior | Backend + QA | Final Twig markup | Pending |
| Map acceptance criteria to tests and manual desktop/mobile/keyboard/contrast evidence; run safe regression checks | QA | Frontend and backend tasks complete | Pending |
| Perform one independent, proportional review of the final diff (Vue accessibility/state and Twig/authentication boundaries); route findings to the owner | Reviewer | QA results and final diff | Pending |
| Create and verify this implementation plan only | Planner | Repository and issue audit | Complete |

Frontend may autonomously correct in-scope ESLint, Vitest, Vite-build, accessibility, and shared-component defects exposed by its validation. Backend may autonomously correct in-scope PHPStan, PHP-CS-Fixer, PHPUnit, Twig/configuration, and authorization-regression defects. QA may correct only explicitly assigned tests/fixtures/configuration. All agents must coordinate before changing shared entry/config/template files; no correction may add #10/#12 behavior or introduce a dependency without approval.

## 5. Execution Strategy

1. The orchestrator reviews this plan and locks the dependency decision. Work remains on `feature/issue-17-admin-design-system`; no branch, worktree, commit, push, PR, merge, dependency installation, or publication is authorized by this plan.
2. Backend and Frontend first agree the serialized brand-config shape and ownership of `base.html.twig`, `admin/index.html.twig`, and `app.js`. This avoids conflicts in the principal shared files.
3. Frontend can then develop tokens/theme support and independently develop component contracts/tests in separate files in parallel. Backend can prepare the configuration/Twig bridge and functional-test expectations in parallel once that shape is agreed.
4. Integrate the shell only after primitives and the bridge are stable. Preserve the current Customer request path, loading/error/retry states, and login/logout form submission; do not add navigation to unavailable Customer CRUD or dashboard features.
5. QA validates the integrated change; the Reviewer performs a single final review after QA evidence. Findings return to Frontend or Backend for in-scope correction, followed by focused revalidation.

Likely conflict hotspots are `assets/app.js`, `config/services.yaml`, `config/packages/twig.yaml`, `templates/base.html.twig`, `templates/admin/index.html.twig`, and the Customer display/template pair. Assign one editor per hotspot at a time and rebase neither nor overwrite unrelated local changes. In particular, preserve the pre-existing untracked `docs/plans/workshop-25-workflow-analyst/plan.md`.

## 6. Validation Strategy

| Acceptance evidence | Validation |
| --- | --- |
| Central brand/tokens and themes | Vitest the configuration/bootstrap and preference fallback behavior; inspect generated page markup; manually switch light/dark/system and verify a representative Twig page and Vue shell use the same semantic roles. Check default-token text, controls, alerts, and focus indicators with a contrast checker. |
| Reusable, accessible components | Colocated Vue Test Utils tests for rendered labels/roles, disabled/loading states, field error `aria-describedby`, alert role, table headers/captions/empty state, and dialog open/close, Escape, focus containment, and focus return. Exercise keyboard-only navigation manually. |
| Responsive admin layout | Component tests for drawer state and ARIA behavior plus manual browser checks at a narrow mobile viewport and a desktop viewport: menu button, focus order, overlay/drawer closure, visible main content, header/logout control, and no horizontal overflow. |
| Existing functionality | `npm test --` for all affected Vitest files, `npm run lint`, and `npm run build` from `backend/`. Run `php bin/phpunit tests/Functional/AuthenticationTest.php tests/Functional/CustomerViewControllerTest.php` in the safe isolated test database, plus any directly affected Customer component tests. Confirm anonymous/non-admin admin protection and standard login/logout still work. |
| Scope and delivery | Inspect `git diff --check`, intended changed paths, dependency manifest/lockfile (unchanged under the recommended approach), and the customization guide. Confirm no API, entity, migration, Customer CRUD, or KPI/dashboard changes. |

QA must report exact commands and results, distinguish unavailable browser/database infrastructure from product defects, and avoid destructive database operations outside the dedicated test environment. No existing test should be weakened only to accommodate markup changes; update selectors only where the user-visible contract is intentionally retained.

## 7. Risks & Decisions

- **Decision — local components over a UI library/Tailwind:** This is the lowest-risk fit for the verified small, dependency-free Vue + Twig application. It makes tokens reusable by both renderers. A later Tailwind adoption is possible through a mapping layer, but is not silently bundled into #17.
- **Risk — a custom dialog can be inaccessible.** Treat the dialog as the highest-risk primitive: native semantic controls, tested focus lifecycle, keyboard Escape, and reviewer attention are mandatory. If requirements grow beyond the documented contract, seek approval for a vetted accessible primitive rather than expanding ad hoc.
- **Risk — raw configurable CSS/asset values could create visual or security defects.** Configuration remains repository/deployment controlled, logo references are limited to local/trusted assets, Twig escaping remains enabled, Vue avoids `v-html`, and no runtime user input reaches styles or markup. A future admin-editable brand system needs separate validation/authorization design.
- **Risk — theme flash or unsupported storage.** Apply a minimal early preference bootstrap where needed, constrain preference values to `light|dark|system`, and fall back safely to system/default without failing the page.
- **Risk — contrast changes with arbitrary client palettes.** Document approved color roles and require manual contrast confirmation for each configured palette; default tokens must meet the agreed WCAG AA text/control contrast target.
- **Risk — cross-cutting Twig/Vue edits regress authentication.** Do not change `security.yaml` rules, routes, API/CSRF client, or logout method. Retain the server-generated CSRF token and POST form, then run the authentication functional tests.
- **Open question, non-blocking:** Issue #17 does not prescribe a visual brand, exact breakpoints, or a default logo. Assume neutral defaults, a conventional narrow breakpoint selected during implementation, and a text fallback until product branding is supplied. These are centralized configuration choices, not component edits.

**Core estimate (experienced Symfony/Vue developer using Codex and the named specialists):** AI-assisted implementation and focused test writing: **4.5–7.5 hours**, assuming the local-component decision stands, one shared brand configuration is accepted, and current frontend/backend toolchains run. Confidence: **medium**. The main uncertainty is robust dialog/focus behavior and the amount of Twig styling needed to make all entry surfaces coherent; the range grows materially if a library/Tailwind is approved or a production-grade icon/logo asset pipeline is required.

**Human review, acceptance validation, and integration:** **45–90 minutes**, assuming a browser and isolated test database are available; this covers keyboard/mobile/contrast inspection and review of the customization contract. Confidence: **medium**.

**Environmental blockers/setup (excluded from core):** **0 minutes confirmed**; dependencies and local `node_modules` are present. If the isolated PHPUnit database or a browser for responsive checks is unavailable, diagnosis/setup time is external to the estimate. A later approved Tailwind/UI-library install and compatibility validation would add **20–45 minutes** of setup, excluded because it is not the recommended scope.

**Optional enhancements (excluded):** automated browser/visual regression coverage (**1–2.5 hours**); a component gallery/playground (**1–2 hours**); persisted per-user theme preference, tenant branding, uploads, or an admin theme editor require separate requirements and are not estimated as #17 work.

## 8. Progress & Completion

- [x] Verify Issue #17, comments, prerequisite/adjacent issue states, and local Git status.
- [x] Inspect applicable instructions, agent ownership, Vue/Vite/Vitest/ESLint configuration, Twig/configuration/security boundaries, existing frontend and functional tests, and current absence of Tailwind/UI libraries.
- [x] Create this plan at `docs/plans/issue-17/plan.md` without modifying application code, tests, configuration, or the existing workshop plan.
- [ ] Orchestrator approves the approach and task ownership.
- [ ] Complete implementation, focused tests, safe functional validation, manual accessibility/responsive checks, and independent review.
- [ ] Record validation evidence, changed files, deviations, and any approved scope decision here before declaring Issue #17 complete.

Current blocker: none for planning. Implementation must pause for explicit approval if the dependency decision changes, a brand requirement requires runtime/user data, or planned work expands into #10/#12.
