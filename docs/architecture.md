# EduVision Architecture

## Overview

EduVision is composed of a web client, a backend API, and a relational database. The client communicates with the API over HTTPS using JSON. The backend applies business rules, controls access, and manages persistent data.

```text
User
   |
   v
React + TypeScript
   |
   | HTTPS / JSON
   v
ASP.NET Core Web API
   |
   v
MSSQL
```

## Technology Stack

### Backend

- ASP.NET Core Web API
- .Net 10
- Entity Framework Core
- MSSQL
- JWT authentication
- FluentValidation
- MediatR

### Frontend

- React
- Vite
- TypeScript
- Tailwind CSS
- Recharts

### Development and Deployment

- Docker
- Docker Compose
- GitHub

## Frontend

The frontend is a single web application built with React, Vite, and TypeScript. It presents role-specific pages and actions for students, parents, teachers, principals, and administrators.

The frontend is responsible for presentation, navigation, and user interaction. It communicates with the backend through HTTP requests and does not enforce business or security rules on its own.

## Backend

The backend is an ASP.NET Core Web API organized into four layers:

### Domain

Contains the core business models, behaviors, and rules. It does not depend on the other application layers.

### Application

Coordinates application use cases and defines the contracts required to execute them. It depends on the Domain layer but remains independent of infrastructure details.

### Infrastructure

Implements technical capabilities required by the application, including database access, authentication services, and future external integrations.

### API

Provides the HTTP entry point to the system. It receives requests, applies authentication and authorization, invokes application use cases, and returns responses to the client.

Dependencies point toward the inner layers:

```text
API ---------> Application ---------> Domain
 |                  ^
 |                  |
 +----------> Infrastructure
```

## Data and Access

Application data is stored in MSSQL. EduVision supports multiple schools, and school-owned data must remain isolated between them.

The backend controls access using both the user's role and their relationship with the requested school, course, or student. Frontend visibility rules improve the user experience but are not treated as a security boundary.

## Request Flow

A typical request follows this path:

1. A user performs an action in the React application.
2. The frontend sends an HTTP request to the API.
3. The API authenticates the user and checks access.
4. The Application layer executes the relevant use case using Domain rules.
5. The Infrastructure layer performs any required database or external service operation.
6. The API returns the result to the frontend.

## Future Integrations

External AI services may later support features such as report generation. These integrations are outside the initial release and will connect to the system through the backend.

Significant implementation choices and their reasoning will be recorded separately as Architectural Decision Records when they are made.

## Architectural Decision Records

- [ADR-001: Use Clean Architecture for the Backend](adr/001-use-clean-architecture-for-the-backend.md)
- [ADR-002: Use Entity Framework Core and MSSQL](adr/002-use-entity-framework-core-and-mssql.md)
- [ADR-003: Model School Access Through Memberships](adr/003-model-school-access-through-memberships.md)
- [ADR-004: Using Composition Over Inheritance for Users](adr/004-using-composition-over-inheritance-for-users.md)
- [ADR-005: Assignment Table Design](adr/005-assignment-table-design.md)
