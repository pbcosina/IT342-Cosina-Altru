# Altru - Full Stack Fundraising Platform

## Project Description
Altru is a full-stack fundraising platform with user authentication. This Session 1 scope delivers a Spring Boot REST backend and a ReactJS web frontend with registration, login, protected dashboard access, and logout.

## Technologies Used
- Backend:
  - Java 21
  - Spring Boot 3.5.11
  - Maven
  - Spring Security + JWT
  - Spring Data JPA
  - MySQL
  - BCrypt password hashing
- Web App:
  - ReactJS (Create React App)
  - React Router
  - Axios
- Mobile App:
  - Planned for upcoming session (see steps section for expected startup flow)

## Backend Naming Convention
- Group ID: `edu.cit.cosina`
- Artifact ID: `altru`
- Base package: `edu.cit.cosina.altru`

## Steps To Run Backend
1. Open terminal in `backend`.
2. Make sure MySQL is running (Workbench can be used to manage DB).
3. Update database credentials in `backend/src/main/resources/application.properties` if needed:
   - `spring.datasource.username`
   - `spring.datasource.password`
4. Run:
   - `mvn clean spring-boot:run`
5. Backend runs at `http://localhost:8080`.

## Steps To Run Web App
1. Open terminal in `web`.
2. Install dependencies:
   - `npm install`
3. Run dev server:
   - `npm start`
4. Web app runs at `http://localhost:3000`.

## API Endpoints
- `POST /api/auth/register`
  - Registers a new user
  - Request body: `{ "name": "...", "email": "...", "password": "..." }`
  - Response body: `{ "token": "..." }`

- `POST /api/auth/login`
  - Authenticates existing user
  - Request body: `{ "email": "...", "password": "..." }`
  - Response body: `{ "token": "..." }`

- `GET /api/user/me` (Protected)
  - Returns the authenticated user profile
  - Header: `Authorization: Bearer <token>`
  - Response body: `{ "id": 1, "name": "...", "email": "..." }`
