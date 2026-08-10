# V1 Architecture

## Status

This document describes the target architecture for V1. The repository is currently a minimal starter and does not yet contain the backend, frontend, database, Docker, or test implementation described below.

## Validated runtime versions

- PHP: `8.4`
- Symfony: `7.4 LTS`

This combination was selected for its long-term support horizon, compatibility with the modular REST architecture, and suitability for reuse across multiple client projects. Dependencies have not yet been installed.

## Architectural goals

V1 is designed as a modular business application with a clear separation between the user interface, HTTP transport, business rules, and persistence. The architecture should keep framework-specific concerns at the edges so that important business behavior remains easy to test and evolve.

## System overview

The system consists of four runtime components:

- A Vue 3 single-page frontend that presents the application UI and calls the backend over HTTP.
- A Symfony backend that exposes a REST API and coordinates application use cases.
- A PostgreSQL database used as the primary persistent store.
- Docker containers and a Docker Compose configuration used to run the application consistently in development and in deployment environments.

The normal request flow is:

```text
Browser
  -> Vue 3 frontend
  -> Symfony REST API
  -> Thin controller
  -> Application service
  -> Repository
  -> PostgreSQL
```

Responses travel back through the same layers. Controllers translate HTTP requests and responses; they do not own business decisions or database queries.

## Backend: Symfony

Symfony is the backend framework and the boundary for HTTP, configuration, dependency injection, validation, serialization, and persistence integration.

The backend is organized into business modules. Each module owns a coherent capability and should keep its application services, domain concepts, repositories, API contracts, and tests close together where practical. Shared technical concerns belong in dedicated infrastructure or shared directories rather than being copied between modules.

### Thin controllers

REST controllers have one primary responsibility: translate an HTTP request into a service call and translate the service result into an HTTP response. A controller may handle route parameters, request deserialization, basic input validation, authentication context, and response status codes. It should not contain workflows, business rules, transaction orchestration, or direct database queries.

### Services contain business logic

Application services represent use cases, such as creating, updating, listing, or completing a business object. They coordinate domain rules, authorization checks, transactions, and calls to repositories. Services should depend on interfaces where that improves testability and should return application/domain results rather than leaking HTTP concerns into the business layer.

### Repositories contain data access

Repositories are the only application-facing abstraction for loading and persisting business data. They encapsulate Doctrine/PostgreSQL queries, mapping, filtering, and persistence details. Services should ask repositories for business objects or result sets rather than constructing queries themselves. Repository integration tests should verify important query and mapping behavior against PostgreSQL.

## Frontend: Vue 3

The frontend is a Vue 3 single-page application. It should be split by feature/module, with reusable UI components and shared infrastructure kept separate from business-specific views.

Frontend responsibilities include:

- Rendering views and handling user interaction.
- Managing local UI state and feature-level state.
- Calling the REST API through a small API client layer.
- Presenting loading, success, validation, and error states.
- Keeping API DTOs and transport details out of presentational components where practical.

The frontend does not duplicate authoritative business rules from the backend. It may provide immediate UX validation, but the Symfony API remains the source of truth.

## REST API

The Symfony backend exposes versioned REST endpoints under `/api/v1`. Resources should use predictable HTTP methods and status codes:

- `GET` retrieves resources or collections.
- `POST` creates a resource.
- `PUT` or `PATCH` updates a resource, according to the resource contract.
- `DELETE` removes a resource where deletion is supported.

API responses should use stable JSON contracts. Validation and business errors should have a consistent error shape containing at least a machine-readable code and a human-readable message. Authentication, authorization, pagination, filtering, and endpoint-specific contracts should be documented as each module is added.

## PostgreSQL

PostgreSQL is the V1 relational database. The schema is managed through versioned migrations, and database access is performed through repositories. Database constraints should enforce invariants that are naturally relational, while business rules that require application context remain in services/domain code.

The application should use separate configuration for development, testing, and production databases. Tests that exercise SQL, mappings, transactions, or constraints should run against a disposable PostgreSQL test database.

## Docker

Docker provides reproducible local and deployment environments. A Docker Compose setup should define at least:

- `backend`: Symfony/PHP application and API.
- `frontend`: Vue development server or a production static-asset web server.
- `database`: PostgreSQL.

Environment-specific values such as credentials, ports, and API URLs must be supplied through environment configuration rather than committed secrets. Containers should expose only the ports needed for local development or the selected deployment topology. Health checks and a persistent PostgreSQL volume should be included in the Compose configuration.

## Modular architecture

Modules are organized around business capabilities rather than technical layers alone. A module should expose a small public application surface and keep its internal details private. A typical module contains:

- API adapters: controllers, request/response DTOs, and serializers.
- Application: use-case services and input/output models.
- Domain: entities, value objects, and business rules when needed.
- Infrastructure: repository implementations and framework/database wiring.
- Tests: unit, integration, and API behavior tests relevant to the module.

Dependencies should point inward toward business behavior. Infrastructure and HTTP adapters may depend on application/domain code; domain code should not depend on Symfony controllers or Vue.

## Testing strategy

Tests should focus on important behaviors and the boundaries where regressions are costly:

- Unit tests for business rules and application services, using test doubles for repositories where appropriate.
- Repository/integration tests for important queries, persistence mappings, constraints, and transactions against PostgreSQL.
- API tests for routing, serialization, validation, authorization, status codes, and representative end-to-end use cases.
- Frontend component and feature tests for key user interactions, API states, and error handling.

The test suite should run in Docker-compatible environments and should not require production services. Every new module should add tests for its critical success paths and failure paths.

## Target project structure

```text
.
├── backend/
│   ├── config/
│   ├── migrations/
│   ├── public/
│   ├── src/
│   │   ├── ModuleName/
│   │   │   ├── Application/
│   │   │   ├── Domain/
│   │   │   ├── Infrastructure/
│   │   │   └── Presentation/Api/
│   │   └── Shared/
│   ├── tests/
│   │   ├── Integration/
│   │   ├── Functional/
│   │   └── Unit/
│   ├── composer.json
│   └── symfony.lock
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── modules/
│   │   ├── components/
│   │   ├── views/
│   │   ├── router/
│   │   ├── services/
│   │   └── shared/
│   ├── tests/
│   ├── package.json
│   └── vite.config.ts
├── docs/
│   └── architecture.md
├── docker/
│   ├── backend/
│   ├── frontend/
│   └── postgres/
├── compose.yaml
└── README.md
```

This structure is a target, not a claim that all listed directories and files already exist. As implementation begins, module names should replace `ModuleName`, and the structure should only grow when a real feature requires it.
