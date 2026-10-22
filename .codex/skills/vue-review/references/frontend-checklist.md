# Vue 3 frontend review checklist

Read the sections relevant to the changed files; do not treat every item as a mandatory finding.

## Components and reactivity

- Components have focused responsibilities and use the project's established `<script setup>` and Composition API conventions.
- `ref`, `reactive`, `computed`, `watch`, and lifecycle hooks express the intended dependency graph without stale values, unnecessary watchers, or side effects during render.
- Keys, conditional rendering, event handlers, cleanup, and component lifecycles are correct.

## Contracts and state

- Props are typed and validated consistently; components do not mutate props.
- Emits use stable names and payloads, and parent-child contracts remain compatible.
- Shared state belongs in the established store/composable boundary and cannot become stale or leak between users or views.

## Requests and user states

- Asynchronous requests handle loading, success, empty, and error states explicitly where relevant.
- Duplicate submissions, request races, cancellation, unmounting, retries, and stale responses do not produce incorrect UI or state.
- Errors are presented safely and do not expose response bodies, tokens, or internal details.

## Authentication and security

- Authentication state and redirects remain consistent with the backend contract.
- CSRF tokens or headers are included through the established API integration for state-changing requests.
- User-controlled content is escaped by default; unsafe HTML, URL handling, DOM APIs, storage, and logging are justified and constrained.
- Client-side checks are not treated as a replacement for server-side authorization.

## Tests

- Vitest tests cover changed behavior, props/emits contracts, loading/success/empty/error states, authentication failures, and important async edge cases.
- Tests wait for observable UI changes and avoid brittle implementation details.
- Missing coverage is reported only when it protects a realistic regression risk.
