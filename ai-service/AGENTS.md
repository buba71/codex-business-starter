# AI Service Rules

## Scope

- `ai-service/` is optional and experimental. Keep it isolated from the Symfony/Vue application unless cross-service integration has explicit approval.
- Do not add application, deployment, Docker/Compose, shared-database, authentication, or network integration without explicit approval.
- Do not merge experimental service work into `main` without explicit approval.

## Python conventions

- Use Python type hints for public functions, route inputs, and route outputs.
- Keep modules focused and use clear, descriptive names.
- Keep route handlers simple. Extract business logic into separate functions or services when complexity or reuse justifies it.
- Define request and response contracts explicitly with Pydantic models when FastAPI endpoints are introduced.
- Keep configuration explicit and avoid hidden environment-dependent behavior.
- Handle expected errors deliberately; do not expose internal implementation details in API responses.

## Dependencies

- Do not add or upgrade Python dependencies without checking the target version, compatibility, and maintenance status first.
- Prefer stable, actively supported packages.
- Add only dependencies required by the approved scope.

## Validation

- Add focused tests for new behavior when test infrastructure exists or is introduced with approval.
- Run the relevant configured formatter, linter, type checker, and test commands before considering a change complete.
- If a validation tool is not configured, report that limitation rather than adding tooling outside the approved scope.
