# Codex Agent Roadmap

This document describes the possible evolution of the repository's Codex capabilities. It is a roadmap, not an agent configuration. The Codex principal remains responsible for qualification, coordination, sequencing, approvals and final decisions.

## Operating principles

- Select the smallest set of capabilities that materially improves the result.
- Keep the current five-agent model as the default operating baseline.
- Delegate only a bounded responsibility with an explicit handoff and validation outcome.
- Run agents sequentially by default. Parallel execution and worktrees require prior human approval and independent scopes.
- Do not grant infrastructure, deployment, data or external-system authority implicitly.
- Use ADRs only for decisions that materially structure architecture, contracts or long-term operation.
- Keep documentation and review proportional to the request's complexity and risk.

## Capability levels

### Current foundation

| Agent | Primary boundary |
| --- | --- |
| Planner | Requirements, scope, acceptance criteria, ownership, dependencies and implementation plan |
| Backend Engineer | Symfony, PHP, Doctrine, Twig and backend tests |
| Frontend Engineer | Vue, JavaScript, Vite, styling and frontend tests |
| QA Engineer | Acceptance evidence, regression checks, test diagnosis and CI verification |
| Reviewer | Independent correctness, security, regression and test-coverage review |

These profiles remain the only configured specialized agents. Their permissions and restrictions are defined in `.codex/agents/` and `AGENTS.md`.

### Envisaged extension

The following capabilities may become useful when recurring work demonstrates a stable, separate responsibility. They must not be created merely to rename existing duties.

#### Product Analyst

- Mission: turn an ambiguous product request into a shared problem statement and measurable outcome.
- Activate when: user needs, business rules, actors, success metrics or acceptance criteria are unclear; especially for a new product or major product evolution.
- Deliverables: problem statement, personas or actors, prioritized outcomes, scope boundaries, assumptions and acceptance criteria.
- Read: issue or request, existing product behavior, domain documentation, analytics or research provided by the user.
- Write: only an assigned product-analysis artifact or approved planning document; never application code or external product data.
- Interactions: supplies clarified inputs to Planner; coordinates with Codex principal and Reviewer on scope and risk.
- Explicit exclusions: no technical decomposition, architecture choice, implementation, UX delivery or release decision.
- Creation condition: repeated product-discovery work cannot be handled efficiently by Codex principal and Planner without a distinct analysis handoff.

#### Software Architect

- Mission: evaluate and document decisions that materially affect architecture, boundaries, contracts or long-term maintainability.
- Activate when: a change crosses bounded contexts, introduces a new integration, changes an API contract, adds a major dependency or requires an ADR.
- Deliverables: options, trade-offs, constraints, recommended target design and ADR when justified.
- Read: architecture, contracts, dependency graph, security constraints, operational constraints and relevant implementation context.
- Write: only an assigned ADR or architecture artifact; no application implementation, migration or deployment.
- Interactions: advises Planner on decomposition, Backend/Frontend on contracts and Reviewer on design conformance.
- Explicit exclusions: no ownership of requirements, coding, test execution, release approval or infrastructure changes.
- Creation condition: recurring architecture decisions exceed the safe review capacity of Planner, Codex principal and Reviewer.

#### DevOps Engineer

- Mission: design and validate build, CI/CD, observability, environment and deployment concerns.
- Activate when: work changes pipelines, infrastructure, deployment, secrets handling, runtime configuration or operational recovery.
- Deliverables: operational design, pipeline changes proposal, runbook, rollback conditions and validation evidence.
- Read: CI configuration, deployment manifests, environments, logs and operational documentation within the approved scope.
- Write: only explicitly assigned CI, infrastructure or operational documentation; never production resources without separate authorization.
- Interactions: coordinates with Backend/Frontend on build requirements and with QA on reproducibility and release checks.
- Explicit exclusions: no application feature ownership, database-data manipulation, deployment execution or secret administration by default.
- Creation condition: recurring infrastructure work requires specialized review beyond Codex principal and QA, with a clearly bounded write scope.

### Deferred extension

These capabilities remain intentionally deferred until a concrete, recurring need and safe boundary are demonstrated.

#### Security Engineer

- Mission: assess threat models, security boundaries, authentication, authorization, secrets and security controls.
- Activate when: a change affects identity, permissions, sensitive data, cryptography, exposure boundaries or a confirmed security incident.
- Deliverables: threat model, security findings, required controls and verification plan.
- Read: relevant code, configuration, data flows, logs and security documentation.
- Write: security review artifacts or explicitly assigned tests/configuration only; no credential, policy or production changes by default.
- Interactions: works with Backend, Frontend, QA, Reviewer and Codex principal; does not replace human security approval.
- Explicit exclusions: no general implementation, deployment or incident response execution without explicit authorization.
- Creation condition: security review becomes frequent and materially exceeds the coverage of Reviewer and QA.

#### Database Engineer

- Mission: assess schema, query, migration, data-integrity and recovery implications.
- Activate when: a change introduces or alters migrations, high-volume queries, data movement, replication, backup or recovery procedures.
- Deliverables: schema and migration design, impact analysis, rollback/recovery plan and safe validation evidence.
- Read: entities, repositories, migrations, database configuration, fixtures and approved environment information.
- Write: only assigned migration or database documentation in an isolated scope; never execute destructive operations or alter shared environments by default.
- Interactions: coordinates with Backend on persistence, QA on isolated validation and Reviewer on integrity and safety.
- Explicit exclusions: no production data operations, backup deletion, deployment or unrelated application implementation.
- Creation condition: recurring data-sensitive work requires expertise beyond Backend, QA and Reviewer, with a dedicated isolated test environment.

#### UX/UI Designer

- Mission: define interaction, accessibility and visual behavior before frontend implementation.
- Activate when: a new user journey, complex interaction, accessibility-sensitive flow or substantial design-system decision is required.
- Deliverables: user-flow description, interaction states, accessibility criteria and implementation-ready visual guidance.
- Read: product requirements, existing UI conventions, components, user states and accessibility constraints.
- Write: only an assigned design or UX artifact; no frontend code, API contract or product-scope decision by default.
- Interactions: clarifies outcomes with Product Analyst or Codex principal and hands implementation criteria to Frontend and QA.
- Explicit exclusions: no business prioritization, backend implementation, visual asset publication or release approval.
- Creation condition: recurring interaction design work cannot be handled adequately through existing project conventions and Frontend review.

## Boundary rules

### Product Analyst and Planner

Product Analyst clarifies why the work matters, for whom and how success is recognized. Planner turns an accepted need into scope, ownership, sequencing, dependencies and validation. Neither owns implementation or publication.

### Software Architect, Planner and Reviewer

Software Architect proposes and records structurally significant technical choices. Planner organizes approved work. Reviewer checks the resulting implementation against requirements, risks and approved decisions. Architecture advice does not authorize implementation.

### DevOps Engineer, Backend and QA

DevOps Engineer owns operational concerns within an approved scope. Backend owns application behavior and backend tests. QA verifies reproducibility, acceptance evidence and release checks. None may deploy or alter external infrastructure without explicit authorization.

### Deferred specialists

Security Engineer, Database Engineer and UX/UI Designer remain capability boundaries, not implied workflow stages. Their absence does not remove the corresponding responsibility: Reviewer, Backend, Frontend, QA and Codex principal must still identify and escalate those risks.

## Activation by request type

| Request type | Typical capabilities | Additional trigger |
| --- | --- | --- |
| New product | Codex principal, Planner; Product Analyst or Software Architect only if needed | Security, data, UX or operations risks trigger the relevant deferred capability for analysis, not automatic implementation |
| Recovery of existing system | Planner, relevant specialist, QA, Reviewer | Database, security or operational risk requires the corresponding future capability when recurring and bounded |
| Evolution or correction | Codex principal or one relevant specialist | Add Planner, QA or Reviewer only for ambiguity, cross-layer impact or material risk |

The workflow's Simple, Standard and Complex levels remain authoritative for planning, validation and human approval. This roadmap does not create a new hierarchy, permission model or automatic orchestration mechanism.
