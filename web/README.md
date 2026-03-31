# IT342-Cosina-Altru

## Project Description
Altru is a full-stack fundraising platform with authentication. This Session 1 deliverable includes a Spring Boot REST backend and a ReactJS web app with register/login, protected dashboard access, and logout flow.

## Technologies Used
- Backend:
	- Java 21
	- Spring Boot 3.5.11
	- Maven
	- Spring Security (JWT)
	- Spring Data JPA
	- MySQL
	- BCrypt password encryption
- Web:
	- ReactJS (Create React App)
	- React Router
	- Axios
- Mobile:
	- Planned for succeeding sessions

## Backend Naming Convention
- Group ID: `edu.cit.cosina`
- Artifact ID: `altru`
- Base Package: `edu.cit.cosina.altru`

## Repository Structure
- `backend/` Spring Boot API
- `src/` React app source (inside web workspace)

## Steps To Run Backend
1. Open terminal in `backend/`.
2. Ensure MySQL is running (Workbench can be used for administration).
3. Configure `backend/src/main/resources/application.properties`:
	 - `spring.datasource.username`
	 - `spring.datasource.password`
	 - `spring.datasource.url` (if needed)
4. Run:
	 - `mvn clean spring-boot:run`
5. Backend starts at `http://localhost:8080`.

## Steps To Run Web App
1. Open terminal in this folder (`web/`).
2. Install dependencies:
	 - `npm install`
3. Start development server:
	 - `npm start`
4. Open `http://localhost:3000`.

## Steps To Run Mobile App
1. Open terminal in the mobile app folder (once added).
2. Install dependencies:
	 - `npm install`
3. Start app using project command:
	 - `npm start` or `npx expo start` (depends on chosen mobile stack)
4. Point mobile API base URL to backend host/port.

## API Endpoints
- `POST /api/auth/register`
	- Body: `{ "name": "...", "email": "...", "password": "..." }`
	- Response: `{ "token": "..." }`

- `POST /api/auth/login`
	- Body: `{ "email": "...", "password": "..." }`
	- Response: `{ "token": "..." }`

- `GET /api/user/me` (Protected)
	- Header: `Authorization: Bearer <token>`
	- Response: `{ "id": 1, "name": "...", "email": "..." }`
