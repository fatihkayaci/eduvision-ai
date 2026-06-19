# EduVision Architecture

## Overview

EduVision is a web-based student tracking system designed for multiple schools. It allows school administrators, teachers, students, and parents to follow educational processes such as schedules, grades, attendance, announcements, messaging, and reporting.

Each school operates within its own workspace. Access to data is restricted according to the user's role and their relationship with a school, course, or student.

## System Overview

EduVision consists of a web client, a backend API, and a relational database.

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

## Frontend

The frontend is a single React application built with Vite and TypeScript. It provides different pages and actions for students, parents, teachers, principals, and administrators.

The frontend is responsible for presentation and user interaction. Business rules and security controls are enforced by the backend.

## Backend

The backend is an ASP.NET Core Web API organized into four layers:

- **Domain:** Core business models and rules.
- **Application:** Application use cases and contracts.
- **Infrastructure:** Database access and external service implementations.
- **API:** HTTP endpoints, authentication, and application configuration.

## Data and Access

MSSQL stores application data. School data is isolated so that users cannot access another school's resources without authorization.

Authentication is handled by the backend. Authorization considers both the user's role and their relationship with the requested resource.

## Future Integrations

External AI services may be introduced in later versions for features such as reporting. AI integration is not part of the initial release.
