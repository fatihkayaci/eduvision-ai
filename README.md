# EduVision
EduVision is an AI-powered school tracking platform for teachers, students and parents.

## Tech Stack
### Backend
- ASP.NET Core Web API
- Entity Framework Core
- MsSQL
- JWT Authentication
- FluentValidation

### Frontend
- React
- Vite
- TypeScript
- Tailwind CSS
- Recharts

### AI
- OpenAI API or Claude API

### DevOps

- Docker
- Docker Compose
- GitHub

## Architecture

EduVision will be built with a 4-layer Clean Architecture approach.

The backend will be structured around rich domain models, CQRS and clear separation of responsibilities.

### Backend Layers

- **EduVision.Api**  
  Handles HTTP requests, controllers, authentication, authorization, Swagger and global exception handling.

- **EduVision.Application**  
  Contains CQRS commands, queries, handlers, DTOs, FluentValidation validators, application exceptions, service interfaces and use-case specific business logic.

- **EduVision.Domain**  
  Contains rich domain entities, enums, value objects, domain rules and domain exceptions.

- **EduVision.Infrastructure**  
  Contains Entity Framework Core database access, DbContext, migrations, entity configurations, JWT implementation, password hashing, seed data and external AI service integrations.

### Architectural Decisions

- 4-layer Clean Architecture
- Rich domain model instead of anemic entities
- CQRS pattern in the Application layer
- MediatR for command/query handling
- FluentValidation for request validation in the Application layer
- Domain exceptions in the Domain layer
- Application-specific exceptions such as NotFound and ForbiddenAccess in the Application layer
- EF Core through an application-level DbContext interface
- JWT-based authentication
- Role-based and resource-based authorization
- AI integrations isolated in the Infrastructure layer
