## Project Description
Altru is a full-stack fundraising platform that enables users to launch and support campaigns through a secure and scalable flow. This session delivers a Spring Boot backend and a React web application where users can register, sign in, refresh sessions, manage campaigns, donate to published campaigns, and access protected account/dashboard features with JWT-based authentication.

## Technologies Used
**Backend**
*   Spring Boot 3.5.11
*   Java 21
*   Maven
*   MySQL
*   Spring Data JPA (Hibernate)
*   Spring Security + JWT (Access + Refresh Token)
*   BCrypt Password Encryption

**Web application**
*   ReactJS 19.2 (Bootstrapped with react-scripts)
*   React Router DOM
*   Axios for API requests
*   React Context API for Auth State Management
*   CSS for Styling

## Steps to run backend
1. Open the project folder `backend`.
2. Ensure you have Java 21, Maven, and MySQL installed/running.
3. Open your terminal in the `backend` root context.
4. Optionally update `application.properties` with your database credentials.
5. Run the Spring Boot application using Maven:
   ```bash
   mvn spring-boot:run
   ```
6. The backend server will start on `http://localhost:8080`.

## Steps to run web app
1. Open a new terminal and navigate to the `web` folder.
2. Ensure you have Node.js and npm installed.
3. Install dependencies by running:
   ```bash
   npm install
   ```
4. Start the application:
   ```bash
   npm start
   ```
5. The React development server will start on `http://localhost:3000`.

## Steps to run mobile app
*(Currently a placeholder)*
1. Mobile module is not yet implemented in this workspace.
2. Kotlin mobile setup and run steps will be added once the `mobile` module is created.

## List of API endpoints

| HTTP Method | Endpoint | Description | Authentication |
|-------------|----------|-------------|----------------|
| `POST` | `/api/auth/register` | Register a new user (name, email, password) | None |
| `POST` | `/api/auth/login` | Login an existing user (email, password) | None |
| `POST` | `/api/auth/refresh` | Refresh access token using refresh token | None |
| `GET` | `/api/users/me` | Get profile details of logged-in user | Bearer Token |
| `GET` | `/api/user/me` | Backward-compatible alias for profile endpoint | Bearer Token |
| `GET` | `/api/campaigns` | List published campaigns (supports search/category/pagination/sort) | Bearer Token |
| `GET` | `/api/campaigns/my` | List campaigns created by authenticated user | Bearer Token |
| `GET` | `/api/campaigns/{id}` | Get campaign details by ID | Bearer Token |
| `POST` | `/api/campaigns` | Create a campaign | Bearer Token |
| `PUT` | `/api/campaigns/{id}` | Update a campaign | Bearer Token |
| `DELETE` | `/api/campaigns/{id}` | Delete a campaign | Bearer Token |
| `GET` | `/api/causes` | Backward-compatible alias for campaign listing | Bearer Token |
| `GET` | `/api/causes/{id}` | Backward-compatible alias for campaign details | Bearer Token |
| `POST` | `/api/donations/campaigns/{campaignId}` | Create donation record for a campaign | Bearer Token |
| `GET` | `/api/donations/me` | List donations of authenticated user | Bearer Token |
| `POST` | `/api/campaigns/{id}/donate?amount={value}` | Legacy compatibility donation endpoint | Bearer Token |