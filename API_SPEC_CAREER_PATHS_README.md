# Career Paths Explorer — Backend API Spec

This document complements `API_SPEC_CAREER_PATHS.yaml` and explains how backend developers can implement the endpoints for the Career Paths Explorer.

Overview

- The API should provide career listings, details, personalized recommendations (AI driven), and favorites management, and support admin endpoints to manage careers and weighting.

Security

- Use JWT bearer token for auth.
- Admin endpoints require role-based checks (ADMIN).

Routes to implement (summary):

- GET /api/careers
- GET /api/careers/{careerId}
- POST /api/careers/recommendations
- GET /api/users/{userId}/favorites
- POST /api/users/{userId}/favorites
- DELETE /api/users/{userId}/favorites/{careerId}
- POST /api/careers/compare
- Admin: CRUD for /api/admin/careers

Match Scoring & AI

- Provide ranked results for recommendations using assessment data and account for weighting.
- Add an explainability object for each career with reasonText in English and Spanish.
- AI explanation should be sanitized and stored with admin approval.

Database & Data Model

- Minimal tables: careers, career_families, career_skills, career_locales, user_favorites, ranking_configs

Caching & Performance

- Cache recommendations per user for 24h (or until user completes new assessment).
- Rate-limit AI endpoints.
- Background job for demand/salary updates.

Testing

- Add unit & integration tests for each endpoint.
- Provide mocked LLM responses for deterministic tests.

API Spec is in `API_SPEC_CAREER_PATHS.yaml` — use OpenAPI tools (Swagger) to autogenerate server stubs.

If you prefer TypeScript or Node/Express, `openapi-generator` can scaffold controllers and model types from the YAML.
