## Project Description
Altru is a full-stack fundraising platform where users can register, log in, create campaigns, and donate securely.

## Technologies Used
- Backend: Java 21, Spring Boot, Spring Security (JWT), Spring Data JPA, Maven, MySQL
- Web App: ReactJS (Create React App), React Router, Axios
- Mobile App: Kotlin (planned)

## Steps to Run Backend
1. Open a terminal in `backend`.
2. Ensure MySQL is running.
3. Update database credentials in `backend/src/main/resources/application.properties` if needed.
4. Run `mvn clean spring-boot:run`.
5. Backend will run at `http://localhost:8080`.

## Steps to Run Web App
1. Open a terminal in `web`.
2. Run `npm install`.
3. Run `npm start`.
4. Web app will run at `http://localhost:3000`.

## Steps to Run Mobile App
To be implemented. Kotlin mobile app setup and run instructions will be added once the mobile module is created.

## List of API Endpoints
- Auth:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `POST /api/auth/refresh`
- Users:
  - `GET /api/users/me`
  - `GET /api/user/me`
- Campaigns:
  - `GET /api/campaigns`
  - `GET /api/campaigns/my`
  - `GET /api/campaigns/{id}`
  - `POST /api/campaigns`
  - `PUT /api/campaigns/{id}`
  - `DELETE /api/campaigns/{id}`
  - `GET /api/causes`
  - `GET /api/causes/{id}`
- Donations:
  - `POST /api/donations/campaigns/{campaignId}`
  - `GET /api/donations/me`
  - `POST /api/campaigns/{id}/donate?amount={value}`
