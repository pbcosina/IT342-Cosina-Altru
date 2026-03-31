# Task Checklist (Session 1)

## DONE
- [x] Backend scaffolded with required Maven naming convention (edu.cit.cosina:altru) - commit: a56a371
- [x] Implemented POST /api/auth/register - commit: a56a371
- [x] Implemented POST /api/auth/login - commit: a56a371
- [x] Implemented protected GET /api/user/me endpoint - commit: a56a371
- [x] Configured MySQL datasource and JPA - commit: a56a371
- [x] Added BCrypt password encryption - commit: a56a371
- [x] Wired React routes for Register, Login, and protected Dashboard - commit: a56a371
- [x] Added logout flow from dashboard - commit: a56a371
- [x] Normalized frontend naming/import casing and fixed broken asset paths - commit: a56a371
- [x] Updated README with required sections - commit: a56a371
- [x] Add centralized global exception handling with consistent API error envelope
- [x] Complete Cause -> Campaign naming migration in backend model/package (table kept as `causes` for safe compatibility)
- [x] Add pagination and sorting for campaign listing endpoints
- [x] Harden donation flow with idempotency key and fuller status lifecycle
- [x] Add refresh token flow and productionized CORS/env config

## IN-PROGRESS

## TODO
- [ ] Add automated integration tests for auth endpoints and protected route access
- [ ] Add mobile app source folder and concrete mobile startup commands
- [ ] Improve dashboard with real summary cards (total raised, active campaigns, recent donations)
- [ ] Add dashboard activity feed (latest donations and campaign updates)
- [ ] Improve campaign and donation UX with loading, empty, and error states
- [ ] Add basic charts/analytics section for personal fundraising progress
