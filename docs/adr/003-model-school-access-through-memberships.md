# ADR-003: Model School Access Through Memberships

- **Status:** Accepted
- **Date:** 2026-06-21

## Context

EduVision supports multiple schools. School users belong to one school and have one role, while the platform-level System Admin does not belong to a school. Login names and student numbers may be repeated in different schools but must not be duplicated within the same school.

These rules require a clear boundary between a person's platform identity and their school-specific identity.

## Decision

`User` will represent the platform identity and credentials. `SchoolMembership` will represent the user's relationship with a school.

A school membership contains:

- `UserId`
- `SchoolId`
- `Username`
- `Role`
- An optional `StudentNumber` for student memberships

The following database constraints will apply:

- `UserId` is unique in `SchoolMembership`, allowing one school membership per user.
- `(SchoolId, Username)` is unique.
- `(SchoolId, StudentNumber)` is unique when `StudentNumber` is present.

The domain model will enforce these membership invariants:

- A student membership must have a student number.
- Non-student memberships cannot have a student number.

The System Admin is represented by a `User` with `IsSystemAdmin` set to `true` and has no `SchoolMembership` record.

## Consequences

- Global user information remains separate from school-specific role and login information.
- The same username or student number can safely exist in different schools.
- School-scoped authorization can use the membership's `SchoolId` and `Role`.
- Most school-user queries require joining users with memberships.
- Supporting a user in multiple schools later would require changing the unique `UserId` constraint and reviewing authorization behavior.
- System Admin authorization must explicitly handle the absence of a school membership.

## Alternatives Considered

### Store SchoolId and Role on User

This would reduce joins and match the current one-school rule, but it would mix global identity data with school-specific identity and role data.

### Allow Multiple Memberships per User

This would support users working across several schools, but it would add role-selection and authorization complexity that the current product does not require.

### Make Username Globally Unique

This would simplify lookup but would prevent different schools from independently using familiar identifiers such as `417` or `principal`.
