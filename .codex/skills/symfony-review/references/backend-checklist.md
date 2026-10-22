# Symfony/PHP/Doctrine review checklist

Read the sections relevant to the changed files; do not treat every item as a mandatory finding.

## Architecture

- Controllers remain thin and delegate business rules to services.
- Services have clear responsibilities and do not hide persistence or authorization decisions unexpectedly.
- Repository queries match the domain need, avoid accidental N+1 queries, unsafe dynamic clauses, and incorrect pagination or filtering.
- API contracts, serialization, status codes, and error shapes remain compatible.

## PHP correctness

- Types, nullability, visibility, return values, exceptions, and strictness match actual behavior.
- Boundary cases, invalid states, resource handling, and error paths are safe.
- New code follows the project's existing PHP and Symfony conventions without introducing speculative abstractions.

## Doctrine and data integrity

- Entity mappings, relations, cascade behavior, lifecycle hooks, transactions, and flush ordering are correct.
- Queries use parameters safely and preserve tenant/user boundaries where applicable.
- Writes cannot silently lose updates, create duplicates, violate invariants, or leave partial state after failure.
- Migrations are reversible where practical, ordered correctly, compatible with existing data, and safe for deployment.

## Security

- Authentication and authorization are enforced at the correct boundary for every read and write.
- Object-level access cannot be bypassed by changing an identifier or request parameter.
- CSRF protection is present for state-changing browser requests where applicable.
- Input validation, mass assignment, file handling, secrets, logs, and error responses do not expose sensitive data.

## Tests

- PHPUnit tests cover changed business rules, authorization failures, validation failures, persistence edge cases, and important API responses.
- Tests assert observable behavior rather than implementation details.
- Missing coverage is reported only when it protects a realistic regression risk.
