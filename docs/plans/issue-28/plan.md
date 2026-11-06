# Implementation Plan: Issue #28 — Customer Activation and Deactivation

## 1. Context & Objective

Deliver GitHub Issue #28, `feat(customer): allow administrators to activate and deactivate customers` (feature, priority:medium), for user story `US-CUSTOMER-STATUS-001`. The product outcome is an authenticated administrator changing an existing business `Customer` between the only supported statuses, `ACTIVE` and `INACTIVE`, through the versioned customer API and one administration action. `Customer` is not a user account.

**Verified inputs**

- G0 supplied branch and revision: `feature/atelier-30-customer-status` at `c7d672f`; the only pre-existing local work is the untracked `docs/product/` directory containing the PRD, which must be preserved.
- `Customer` already persists the `CustomerStatus` backed enum and exposes `getStatus()`/`setStatus()`. Both enum cases already exist, so this scope needs no schema or migration change.
- `CustomerController` currently owns `GET /api/v1/customers/{id}`, `POST /api/v1/customers`, the JSON response/error shape, and the CSRF-token endpoint. `CustomerCreator` and `CustomerRetriever` exist; no service owns a status transition.
- `security.yaml` requires `ROLE_ADMIN` for `/admin` and `/api/v1/customers`; `CustomerApiCsrfSubscriber` rejects all listed mutating customer API requests without a valid `X-CSRF-Token`. The Vue HTTP client obtains that token automatically for its existing mutation helpers.
- `AdminController`, `templates/admin/index.html.twig`, and `AdminShell.vue` provide the protected administration shell but no Customer management action. `CustomerDisplay.vue` already renders a fetched Customer status. Existing coverage is in `CustomerControllerTest.php`, `AdminShell.test.js`, and `CustomerDisplay.test.js`.
- The preceding architecture decision is accepted: no Software Architect or ADR is needed. The change remains within the established Symfony Controller → business Service → Doctrine Repository/PostgreSQL flow, `/api/v1`, and Symfony UX/Vue administration boundary.

**Assumptions and limits**

- `INACTIVE` is informational only: it neither hides the Customer nor changes authorization or other business operations.
- No history, reason, notification, deletion, bulk operation, account linkage, dependency, configuration, or database migration belongs to Issue #28.
- The plan records a small contract/UX decision for implementation because the existing code has no prior status-mutation endpoint or administration Customer screen; it does not silently prescribe one as an established convention.

## 2. Scope & Acceptance Criteria

**In scope**

- A single-customer status transition that accepts only `ACTIVE` and `INACTIVE`, persists the requested status, and is idempotent when that status is already current.
- An explicitly failing response for a nonexistent Customer, reusing the established customer error envelope where applicable.
- One protected API mutation and one administrator-facing action that invokes it and reflects the resulting current status.
- Backend functional tests and frontend Vitest coverage for the new behavior, plus focused QA evidence.

**Acceptance criteria from Issue #28 / `US-CUSTOMER-STATUS-001`**

1. An authenticated administrator can request `ACTIVE` or `INACTIVE` for an existing Customer through the API or administration action, and the current status becomes the requested value.
2. A principal without `ROLE_ADMIN` is refused and the Customer status remains unchanged.
3. Unauthenticated, unauthorized, or CSRF-invalid status writes are refused.
4. Repeating a request for the current status succeeds without an additional business effect.
5. A request for a nonexistent Customer produces an explicit error and changes no Customer.
6. An `INACTIVE` Customer remains readable and its status remains visible.
7. `INACTIVE` alone does not make another otherwise permitted operation fail.
8. No history, reason, notification, deletion, or bulk status-change capability is introduced.

**Out of scope**

- Customer lists, search, pagination, edit/create redesign, lifecycle history/audit logging, reasons or confirmation policy beyond the minimal action, notifications, status-driven business rules, and all operations on user accounts.

## 3. Technical Approach

1. **Backend business boundary.** Add a narrowly named business service (candidate: `CustomerStatusChanger`) that retrieves the Customer through the existing repository boundary, returns/raises a dedicated not-found outcome, validates the enum value before mutation, applies `setStatus()` only when necessary, and flushes through Doctrine. This keeps idempotence and persistence out of the controller and makes the invariant independent of the Vue caller. No new entity field or migration is expected.

2. **API contract — decision required before coding.** The Backend owner will confirm the smallest resource-oriented mutation contract in the current controller conventions, then document it in the implementation handoff/tests before coding. The candidate is a status-only request under the existing `/api/v1/customers/{id}` resource, with a JSON body containing the requested `status`, the same full Customer representation returned on success, and the existing `{ "error": { "code", "message", "details" } }` envelope on failure. The exact HTTP verb, route suffix/no suffix, successful status code, and final error-code names are intentionally **proposed, not fixed by this plan**; select them only after this convention check. They must support the existing CSRF subscriber's POST/PUT/PATCH/DELETE coverage and preserve `/api/v1` compatibility. Payload validation must reject malformed JSON, missing/non-string `status`, and values outside the enum without persistence.

3. **Authorization, authentication, and CSRF.** Retain the existing `^/api/v1/customers` `ROLE_ADMIN` access-control rule and its JSON authentication/access-denied handlers. Keep the mutation under that protected path and use a method covered by `CustomerApiCsrfSubscriber`; no controller-side bypass or client-supplied authorization claim is allowed. The administration entry/action remains beneath `/admin` and uses the existing session-authenticated Vue client, which fetches a same-origin CSRF token before the mutation. The backend remains authoritative even if a UI control is manipulated.

4. **Administration action — decision required before coding.** Since no administration Customer detail/list exists, Frontend and Backend will validate the minimum placement and bootstrap contract together: a protected, single-Customer administration detail/action surface using a supplied Customer id, status display, and a single action targeting the opposite/requested status. A candidate is a dedicated `/admin` Customer-detail route/controller/template that mounts a focused Vue controller; it is not a Customer list or bulk workflow. The exact route, component name, control wording, confirmation behavior, and loading/error presentation are intentionally **not fixed here** and must follow the current accessible UI primitives and issue scope. On success, the visible status must update from the response; on failure, no optimistic state may be retained.

5. **Frontend integration.** Reuse `get` and the appropriate existing mutation helper in `assets/vue/http/client.js`; no independent CSRF implementation or token storage is needed. Keep `CustomerDisplay` read behavior intact unless the validated minimal placement deliberately reuses a compatible component. New UI must use native button semantics or the established `UiButton`, prevent duplicate submissions while pending, show a non-sensitive actionable/error state, and not expose actions for unavailable Customer-management features.

## 4. Implementation Tasks & Ownership

| Task | Responsible agent | Dependencies | Status |
| --- | --- | --- | --- |
| Confirm the minimal API method/path/success semantics and the minimal protected administration placement against the existing controller/routes; record the approved choices in the implementation handoff before implementation | Backend + Frontend | This plan; no new product decision beyond the defined MVP | Pending — validation gate |
| Add the status-transition business service, reuse `CustomerRepository`, and expose the approved controller action with enum/payload/not-found handling and existing JSON conventions | Backend | Approved API contract | Pending |
| Extend `CustomerControllerTest.php` with persistence, both enum values, idempotence, nonexistent Customer, malformed/invalid input, authentication, `ROLE_ADMIN`, and valid/invalid/missing CSRF cases | Backend | Backend endpoint and service | Pending |
| Add the approved protected administration route/template bootstrap only if needed, without changing global access-control policy | Backend | Approved administration placement; frontend component props | Pending |
| Implement the focused Vue administration controller/action; call the approved API through the existing CSRF-aware client; update displayed status only after success; implement pending and failure states accessibly | Frontend | Approved API/props contract | Pending |
| Add colocated Vitest coverage for initial status display, action request shape/CSRF client interaction, pending duplicate-submission prevention, successful status update, and explicit API/network failure handling | Frontend | Vue action implementation | Pending |
| Map all acceptance criteria to observable evidence; run focused backend/frontend regressions and confirm inactive-read behavior plus scope exclusions | QA | Completed Backend and Frontend tasks; isolated test database | Pending |
| Independently inspect the final API/authentication/CSRF/data-integrity and Vue state/error diff; classify actionable findings | Reviewer | QA evidence and final diff | Pending — proportional API/security review |
| Create this plan only | Planner | G0 context, PRD, existing source/tests | Complete |

Backend owns PHP controller/service/repository interaction, functional tests, and any approved scoped admin Twig/controller bootstrap. Frontend owns Vue component state and colocated Vitest tests. QA owns evidence and test diagnosis only. Shared API/component props and any route/template bootstrap must be agreed before either owner edits them. No agent may expand into Customer CRUD/listing, status history, or authentication redesign.

## 5. Execution Strategy

1. The session owner reviews this G1 plan and confirms the two bounded decisions: API transport details and the smallest administration action placement. The feature branch remains unchanged by planning; this plan authorizes neither branch operations, commits, pushes, PRs, dependency changes, nor publication.
2. Backend and Frontend jointly freeze the request/response and bootstrap-prop contracts. This is the only coordination point; it prevents a Vue action from relying on an invented endpoint or response code.
3. Backend implements and functionally verifies the service/controller path first. Preserve the enum-backed data model, existing access-control and CSRF subscriber, error envelope, and retrieval behavior for inactive Customers.
4. After the contract passes focused backend checks, Frontend implements the approved administration action and its Vitest tests with mocked API responses. It uses the existing request client rather than duplicating security behavior.
5. QA validates the integrated acceptance criteria. Reviewer performs the proportional independent API/security/state review after QA has evidence. Findings return only to their assigned owner; affected checks are rerun.

Expected shared-file hotspots are `CustomerController.php`, `CustomerControllerTest.php`, the chosen admin controller/template, and the API contract used by the Vue component. Work is sequential by default; no parallel agents, worktrees, or external coordination are requested by this plan. Preserve the pre-existing untracked PRD directory throughout.

## 6. Validation Strategy

| Evidence target | Validation |
| --- | --- |
| API success and persistence | PHP functional tests create Customers in both states, invoke the approved endpoint as an administrator, assert the approved response contract and persisted enum value, then repeat the same request and assert successful idempotence. |
| Input and not-found contract | Functional tests cover malformed JSON, missing/non-string/unsupported status, and an unknown id; each verifies the agreed error envelope and that no unrelated Customer changes. |
| Authentication, authorization, and CSRF | Functional tests separately assert JSON rejection for anonymous and non-admin mutation attempts, and `csrf_token_invalid` rejection for missing/invalid tokens; assert persisted status is unchanged. Confirm the chosen method/path is intercepted by `CustomerApiCsrfSubscriber` rather than relying on a new mechanism. |
| Inactive read and non-regression | Functional test reads an `INACTIVE` Customer successfully with its visible status. Retain existing create/read/error assertions; do not add an inactive-based refusal to unrelated behavior. |
| Administration action | Vitest mocks the existing HTTP/CSRF flow and verifies the approved mutation request, pending/disabled behavior, returned-status rendering, and recovery/error state for API/network failures. Check native semantics, accessible name/state, and that failure does not falsely update status. |
| Integrated quality | From `backend/`, run the targeted PHPUnit functional test class, affected Vitest files or `npm test`, then `npm run lint` and `npm run build`; run `vendor/bin/phpstan analyse` and `vendor/bin/php-cs-fixer check --diff --verbose` when the PHP surface changes. Use only the isolated PostgreSQL test environment. Inspect `git diff --check` and intended paths, confirming no migration, dependency/configuration change, or excluded feature appears. |

QA reports exact commands, results, database/environment limitations, and any manual observation of the administration action. Failures caused by unavailable isolated PostgreSQL or local Node tooling are reported as environment blockers, not masked by weaker tests.

## 7. Risks & Decisions

- **Decision — architecture/ADR:** No architect engagement or ADR is warranted because this is a local extension of the verified controller/service/repository/API/Vue patterns. Revisit only if the chosen contract requires a cross-resource workflow, history/audit retention, a new authorization model, or a schema change.
- **Pending minimal decision — API transport:** Existing code shows creation and retrieval but no update convention. Validate one resource-scoped status mutation before implementation; do not infer exact verb, URL, code, or error names from this plan. Reuse the stable `/api/v1` namespace, error envelope, enum, and CSRF method coverage once selected.
- **Pending minimal decision — administration UX:** There is an admin shell but no Customer screen. Validate a single-Customer action surface with a known id; do not introduce a list, selector, bulk controls, or arbitrary confirmation flow. This is the main integration uncertainty.
- **Risk — authorization/CSRF regression:** A new path outside the current regex or a non-covered HTTP method could evade established protection. Mitigation: keep the endpoint below `/api/v1/customers`, select a subscriber-covered mutation method, and prove anonymous/non-admin/CSRF refusals with functional tests.
- **Risk — invalid state or partial mutation:** The request could bypass enum validation or update an unintended Customer. Mitigation: parse with `CustomerStatus`, retrieve exactly by route id through the service/repository boundary, mutate only after validation, and assert persistence/no-change cases.
- **Risk — false success/UI race:** Optimistic status rendering or repeated clicks could misrepresent the persisted state. Mitigation: disable while pending, commit the displayed status from the successful server representation only, test repeat clicks, and rely on server idempotence.
- **Risk — inactive behavior expands accidentally:** A transition implementation could start filtering reads or blocking unrelated operations. Mitigation: preserve `CustomerRetriever` behavior, add inactive-read coverage, and review the diff for any status-based gate outside the transition.

**Estimate — requested implementation scope:** Backend service/controller/tests: **1.5–2.5 hours**; Frontend action/Vitest and approved minimal bootstrap: **1.5–3 hours**; QA execution/evidence: **0.75–1.25 hours**. Total implementation/QA: **3.75–6.75 hours**. Assumptions: the existing test database and Node dependencies work, no migration is required, and the two bounded decisions are resolved without new product requirements. Confidence: medium; the missing administration placement is the principal uncertainty.

**Human review:** **20–40 minutes** for API/CSRF/data-integrity and accessible action-state review. **Potential blockers (excluded):** resolving an unavailable isolated PostgreSQL environment, broken local tooling, or a request to add a Customer list/history/audit capability. **Optional work (excluded):** automated browser/E2E coverage, activity history, change reasons, notifications, bulk changes, or status-driven business restrictions; each requires separate scope and estimates.

## 8. Progress & Completion

- [x] Qualify Issue #28 as a standard, user-facing API and administration evolution with authorization, CSRF, data-integrity, and regression considerations.
- [x] Verify G0 branch/local-work context supplied for this Atelier; inspect the PRD, workflow, entity/enum, controller/services/repository, security/CSRF client, administration shell, and relevant PHPUnit/Vitest coverage.
- [x] Create this versioned G1 plan at `docs/plans/issue-28/plan.md` only.
- [ ] Session owner approves the plan and validates the bounded API/administration-placement decisions.
- [ ] Backend and Frontend implement their assigned surfaces and focused tests.
- [ ] QA records acceptance evidence; Reviewer completes proportional final review; owners address in-scope findings and revalidate.
- [ ] Record final changed files, validation commands/results, deviations, and remaining limitations in the delivery handoff before Issue #28 is considered complete.

Planning status: **ready for session-owner review**. No implementation, test, configuration, PRD, Git, dependency, GitHub, or external-system change was made by the Planner. The only planned-file addition is this document.
