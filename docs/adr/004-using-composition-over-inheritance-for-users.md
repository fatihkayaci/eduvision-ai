ADR 001: Using Composition Over Inheritance for Users
Date: June 21, 2026

Status: Accepted

Context
EduVision needs to manage different user types (Students, Teachers, Parents). Using a single table with inheritance would create too many empty (null) columns for specific roles (e.g., a Teacher doesn't have a Student Number). Also, a user might need multiple roles at the same time (e.g., being both a Teacher and a Parent).

Decision
We decided to use Composition (1:1 Profile Tables) instead of Inheritance.

We keep basic info (Name, Email) in a single Users table.

We keep role-specific info in separate tables like StudentProfiles.

StudentProfiles uses UserId as both Primary Key and Foreign Key.

Consequences
Pros: The database stays clean with no null columns. A user can easily have multiple roles without creating duplicate accounts.

Cons: Reading full student details requires a database JOIN operation (which we handle easily with EF Core).