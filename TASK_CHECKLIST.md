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

## IN-PROGRESS

## Architecture Improvement Sprint (One-at-a-Time)
- [x] Improvement 1: Add centralized global exception handling with consistent API error envelope
- [x] Improvement 2: Complete Cause -> Campaign naming migration in backend model/package (table kept as `causes` for safe compatibility)
- [x] Improvement 3: Add pagination and sorting for campaign listing endpoints
- [ ] Improvement 4: Harden donation flow with idempotency key and fuller status lifecycle
- [ ] Improvement 5: Add refresh token flow and productionized CORS/env config

## TODO
- [ ] Add automated integration tests for auth endpoints and protected route access
- [ ] Add mobile app source folder and concrete mobile startup commands
