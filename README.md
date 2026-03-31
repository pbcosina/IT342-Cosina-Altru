# Altru - Full Stack Fundraising Platform

## Project Description
Altru is a full-stack fundraising platform with JWT authentication, campaign management, and donation tracking.
The project currently uses a layered backend architecture:
- Controller -> Service -> Repository
- DTO-based request/response flow
- Standardized API envelope for success and error payloads

Current naming state:
- Domain model/package naming is migrated to `Campaign`
- Compatibility routes under `/api/causes` are still available
- Physical database table remains `causes` for non-breaking data compatibility

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

## API Response Format
All endpoints return a consistent envelope:
- `success`: boolean
- `message`: string
- `data`: object | array | null
- `timestamp`: ISO datetime

Example success payload:
```json
{
  "success": true,
  "message": "Campaigns fetched",
  "data": [],
  "timestamp": "2026-04-01T00:00:00"
}
```

Example error payload:
```json
{
  "success": false,
  "message": "Invalid email or password",
  "data": null,
  "timestamp": "2026-04-01T00:00:00"
}
```

## API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Users
- `GET /api/users/me` (Protected)
- `GET /api/user/me` (Protected, backward-compatible alias)

### Campaigns
- `GET /api/campaigns` (Protected)
- `GET /api/campaigns/my` (Protected)
- `GET /api/campaigns/{id}` (Protected)
- `POST /api/campaigns` (Protected)
- `PUT /api/campaigns/{id}` (Protected)
- `DELETE /api/campaigns/{id}` (Protected)

Pagination and sorting for list endpoints:
- Supported query params on `GET /api/campaigns` and `GET /api/campaigns/my`:
  - `page` (default: `0`)
  - `size` (default: `12`)
  - `sortBy` (default: `createdAt`)
  - `sortDirection` (`ASC` or `DESC`, default: `DESC`)
- `GET /api/campaigns` additionally supports filters:
  - `search`
  - `category`

Paged data payload shape for campaign lists:
```json
{
  "items": [],
  "page": 0,
  "size": 12,
  "totalElements": 0,
  "totalPages": 0,
  "hasNext": false,
  "hasPrevious": false,
  "sortBy": "createdAt",
  "sortDirection": "DESC"
}
```

Compatibility routes still supported during migration:
- `/api/causes`
- `/api/causes/{id}`

### Donations
- `POST /api/donations/campaigns/{campaignId}` (Protected)
- `GET /api/donations/me` (Protected)

Donation idempotency and status lifecycle:
- You can send `X-Idempotency-Key` header for safe retries.
- You can also send `idempotencyKey` in request body for clients that cannot set headers.
- If the same authenticated user sends the same idempotency key again, the API returns the existing donation record instead of creating a duplicate.
- Donation status lifecycle now supports: `PENDING`, `COMPLETED`, `FAILED`, `REFUNDED`.
- Donation response now includes:
  - `idempotencyKey`
  - `paymentReference`
  - `failureReason`
  - `processedAt`

Legacy compatibility route:
- `POST /api/campaigns/{id}/donate?amount={value}` (Protected)

## Security and Error Handling
- JWT-based stateless authentication
- Role-based authorization (`USER`, `ADMIN`)
- Centralized exception handling through global handler with standard HTTP status mapping:
  - 400 Bad Request
  - 401 Unauthorized
  - 403 Forbidden
  - 404 Not Found
  - 409 Conflict
  - 500 Internal Server Error
