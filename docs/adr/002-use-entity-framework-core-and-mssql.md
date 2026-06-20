# ADR-002: Use Entity Framework Core and MSSQL

- **Status:** Accepted
- **Date:** 2026-06-21

## Context

EduVision stores relational data for schools, users, memberships, courses, attendance, grades, and other educational processes. The backend needs a persistence solution that integrates with .NET, supports explicit relational mappings, and provides a repeatable way to evolve the database schema.

## Decision

MSSQL will be the primary relational database, and Entity Framework Core will be used as the object-relational mapper.

Database concerns will remain in `EduVision.Infrastructure`. This layer will contain:

- `ApplicationDbContext`
- Entity type configurations
- MSSQL provider registration
- Schema migrations

Migrations will be generated in `Persistence/Migrations` and committed to source control. Local MSSQL development will use the SQL Server Developer image through Docker Compose.

## Consequences

- The persistence stack integrates directly with ASP.NET Core and the .NET tooling ecosystem.
- Entity configurations provide explicit control over table relationships, constraints, indexes, and column definitions.
- Migrations provide a versioned and repeatable database schema history.
- Local development requires Docker or another reachable MSSQL instance.
- Provider-specific behavior and migrations create a cost if the database is changed later.
- Generated queries must still be reviewed for correctness and performance.

## Alternatives Considered

### PostgreSQL with Entity Framework Core

PostgreSQL would provide a capable open-source relational database, but MSSQL was selected as the database platform for this project.

### Dapper

Dapper would provide more direct control over SQL and lower abstraction overhead, but it would require more manual mapping, schema coordination, and persistence code.

### Raw ADO.NET

Raw ADO.NET would minimize dependencies but would introduce significant repetitive connection, command, and mapping code.
