# ADR-001: Use Clean Architecture for the Backend

- **Status:** Accepted
- **Date:** 2026-06-19

## Context

EduVision will contain business rules for multiple user roles, school-scoped data, authorization, reporting, and future external integrations. The backend needs clear boundaries so that business logic remains independent of HTTP, database, and external service implementation details.

## Decision

The backend will use a four-layer Clean Architecture:

- **EduVision.Domain:** Core business models and rules.
- **EduVision.Application:** Use cases and contracts.
- **EduVision.Infrastructure:** Database access and external service implementations.
- **EduVision.Api:** HTTP endpoints and application composition.

The projects are located under `backend/src` and are grouped by `backend/EduVision.slnx`.

Project references point toward the inner layers:

```text
Application -----> Domain
Infrastructure --> Application + Domain
API -------------> Application + Domain + Infrastructure
```

The Domain project does not reference any other project. The API project acts as the composition root and connects the application layers at startup.

## Consequences

- Business rules can evolve independently of frameworks and infrastructure.
- Layer responsibilities and dependency directions are explicit.
- Infrastructure implementations can be replaced with limited impact on the core application.
- The solution contains more projects and mapping boundaries than a single-project backend.
- Contributors must preserve the dependency direction as new features are introduced.

## Alternatives Considered

### Single ASP.NET Core Project

This would reduce the initial project count but would make it easier for business logic, data access, and HTTP concerns to become coupled as the application grows.

### Traditional Layered Architecture

This would provide separation by technical responsibility, but it would not protect the Domain and Application layers from infrastructure dependencies as clearly.
