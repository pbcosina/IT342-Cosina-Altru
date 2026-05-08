# Altru Platform - Software Test Plan

**Version:** 1.0  
**Last Updated:** May 8, 2026  
**Project:** Altru Fundraising Platform  
**Platform:** Spring Boot Backend + React Frontend

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Functional Requirements Coverage](#functional-requirements-coverage)
3. [Test Cases](#test-cases)
4. [Manual Test Scripts](#manual-test-scripts)
5. [Automated Test Cases](#automated-test-cases)
6. [Test Execution Strategy](#test-execution-strategy)

---

## Executive Summary

This test plan provides comprehensive coverage of all functional requirements implemented in the Altru platform. The testing scope includes:

- **Backend APIs** (Spring Boot REST endpoints)
- **Frontend Features** (React components and workflows)
- **Integration Tests** (End-to-end user flows)
- **Security Tests** (JWT authentication, authorization)

---

## Functional Requirements Coverage

### FR-001: User Authentication & Registration

| Requirement | Status | Test Cases |
|-------------|--------|-----------|
| Register new user with email, name, password | ✓ Implemented | TC-AUTH-001 to TC-AUTH-003 |
| Login with email and password | ✓ Implemented | TC-AUTH-004 to TC-AUTH-006 |
| Refresh access token using refresh token | ✓ Implemented | TC-AUTH-007 to TC-AUTH-009 |
| Password encryption (BCrypt) | ✓ Implemented | TC-AUTH-010 |
| Invalid credentials rejection | ✓ Implemented | TC-AUTH-011 to TC-AUTH-012 |

### FR-002: User Profile Management

| Requirement | Status | Test Cases |
|-------------|--------|-----------|
| Get user profile (GET /api/users/me) | ✓ Implemented | TC-USER-001 to TC-USER-002 |
| Update user profile (name, email, password) | ✓ Implemented | TC-USER-003 to TC-USER-004 |
| View profile image URL | ✓ Implemented | TC-USER-005 |
| Authenticated access only | ✓ Implemented | TC-USER-006 |

### FR-003: Campaign Management

| Requirement | Status | Test Cases |
|-------------|--------|-----------|
| Create new campaign (DRAFT status) | ✓ Implemented | TC-CAMPAIGN-001 to TC-CAMPAIGN-003 |
| List published campaigns (with pagination, search, filter) | ✓ Implemented | TC-CAMPAIGN-004 to TC-CAMPAIGN-010 |
| Get campaign details by ID | ✓ Implemented | TC-CAMPAIGN-011 to TC-CAMPAIGN-012 |
| Update campaign (author only) | ✓ Implemented | TC-CAMPAIGN-013 to TC-CAMPAIGN-015 |
| Delete campaign (author only) | ✓ Implemented | TC-CAMPAIGN-016 to TC-CAMPAIGN-017 |
| Publish campaign (change status to PUBLISHED) | ✓ Implemented | TC-CAMPAIGN-018 to TC-CAMPAIGN-019 |
| List user's campaigns (GET /api/campaigns/my) | ✓ Implemented | TC-CAMPAIGN-020 to TC-CAMPAIGN-021 |
| Campaign search and filtering | ✓ Implemented | TC-CAMPAIGN-022 to TC-CAMPAIGN-024 |
| Sort campaigns (by date, amount, etc.) | ✓ Implemented | TC-CAMPAIGN-025 to TC-CAMPAIGN-026 |
| Calculate days remaining | ✓ Implemented | TC-CAMPAIGN-027 |
| Calculate donation progress | ✓ Implemented | TC-CAMPAIGN-028 |

### FR-004: Donation Management

| Requirement | Status | Test Cases |
|-------------|--------|-----------|
| Create donation with amount and optional message | ✓ Implemented | TC-DONATION-001 to TC-DONATION-003 |
| Anonymous donation support | ✓ Implemented | TC-DONATION-004 to TC-DONATION-005 |
| Idempotency key support (prevent duplicate donations) | ✓ Implemented | TC-DONATION-006 to TC-DONATION-007 |
| Get user's donation history | ✓ Implemented | TC-DONATION-008 to TC-DONATION-009 |
| Get campaign donors list | ✓ Implemented | TC-DONATION-010 to TC-DONATION-011 |
| Update campaign's current donation amount | ✓ Implemented | TC-DONATION-012 |
| Donation status tracking | ✓ Implemented | TC-DONATION-013 to TC-DONATION-014 |
| Prevent donation to draft campaigns | ✓ Implemented | TC-DONATION-015 |

### FR-005: Bookmarks Management

| Requirement | Status | Test Cases |
|-------------|--------|-----------|
| Add campaign to bookmarks | ✓ Implemented | TC-BOOKMARK-001 to TC-BOOKMARK-002 |
| Remove campaign from bookmarks | ✓ Implemented | TC-BOOKMARK-003 to TC-BOOKMARK-004 |
| Get bookmarked campaigns list | ✓ Implemented | TC-BOOKMARK-005 |

### FR-006: Dashboard & Summary

| Requirement | Status | Test Cases |
|-------------|--------|-----------|
| Get dashboard summary (donations received, campaigns, total raised) | ✓ Implemented | TC-DASHBOARD-001 to TC-DASHBOARD-002 |
| Display recent activity feed | ✓ Implemented | TC-DASHBOARD-003 to TC-DASHBOARD-004 |
| Calculate statistics | ✓ Implemented | TC-DASHBOARD-005 |

### FR-007: Security & Authorization

| Requirement | Status | Test Cases |
|-------------|--------|-----------|
| JWT-based authentication | ✓ Implemented | TC-SECURITY-001 to TC-SECURITY-002 |
| Bearer token validation | ✓ Implemented | TC-SECURITY-003 to TC-SECURITY-004 |
| Access control (users can only modify own resources) | ✓ Implemented | TC-SECURITY-005 to TC-SECURITY-006 |
| Admin privileges | ✓ Implemented | TC-SECURITY-007 |
| Token expiration handling | ✓ Implemented | TC-SECURITY-008 |

---

## Test Cases

### Authentication Tests

#### TC-AUTH-001: User Registration - Valid Data
**Objective:** Verify successful user registration with valid input  
**Prerequisites:** Backend running, database accessible  
**Steps:**
1. POST request to `/api/auth/register`
2. Payload: `{"name": "John Doe", "email": "john@example.com", "password": "SecurePass123"}`
3. Verify response status 201
4. Verify response contains user object with id, name, email
5. Verify password is encrypted (not plain text in DB)

**Expected Result:** User is created successfully, password is hashed

---

#### TC-AUTH-002: User Registration - Missing Required Fields
**Objective:** Verify validation of required fields  
**Prerequisites:** Backend running  
**Steps:**
1. POST to `/api/auth/register` with missing email
2. Verify response status 400 (Bad Request)
3. Repeat with missing name
4. Repeat with missing password

**Expected Result:** All requests return 400 with validation error messages

---

#### TC-AUTH-003: User Registration - Duplicate Email
**Objective:** Verify duplicate email prevention  
**Prerequisites:** User with email "jane@example.com" already exists  
**Steps:**
1. POST to `/api/auth/register` with duplicate email
2. Verify response status 409 (Conflict)

**Expected Result:** Request rejected with conflict error

---

#### TC-AUTH-004: User Login - Valid Credentials
**Objective:** Verify successful login with correct email/password  
**Steps:**
1. POST to `/api/auth/login`
2. Payload: `{"email": "john@example.com", "password": "SecurePass123"}`
3. Verify response status 200
4. Verify response contains accessToken and refreshToken
5. Store tokens for subsequent requests

**Expected Result:** Login succeeds, tokens returned

---

#### TC-AUTH-005: User Login - Invalid Password
**Objective:** Verify rejection of incorrect password  
**Steps:**
1. POST to `/api/auth/login` with correct email, wrong password
2. Verify response status 401 (Unauthorized)

**Expected Result:** Login rejected with 401 error

---

#### TC-AUTH-006: User Login - Non-existent User
**Objective:** Verify rejection for non-existent email  
**Steps:**
1. POST to `/api/auth/login` with email "nonexistent@example.com"
2. Verify response status 401

**Expected Result:** Login rejected with 401 error

---

#### TC-AUTH-007: Token Refresh - Valid Refresh Token
**Objective:** Verify successful access token refresh  
**Prerequisites:** User has valid refreshToken  
**Steps:**
1. POST to `/api/auth/refresh`
2. Payload: `{"refreshToken": "valid_refresh_token_value"}`
3. Verify response status 200
4. Verify new accessToken is returned
5. Verify new token works for authenticated requests

**Expected Result:** New token successfully generated and usable

---

#### TC-AUTH-008: Token Refresh - Expired Refresh Token
**Objective:** Verify rejection of expired refresh token  
**Steps:**
1. POST to `/api/auth/refresh` with expired refresh token
2. Verify response status 401

**Expected Result:** Refresh rejected, user must login again

---

#### TC-AUTH-009: Token Refresh - Invalid Refresh Token
**Objective:** Verify rejection of malformed token  
**Steps:**
1. POST to `/api/auth/refresh` with invalid token format
2. Verify response status 401

**Expected Result:** Refresh rejected

---

#### TC-AUTH-010: Password Encryption
**Objective:** Verify passwords are never stored in plain text  
**Prerequisites:** Database connection  
**Steps:**
1. Register user with password "TestPass123"
2. Query database directly
3. Verify stored password is hashed (starts with `$2a$` for BCrypt)
4. Verify hash cannot be reversed to original password

**Expected Result:** Password is encrypted, never stored in plain text

---

#### TC-AUTH-011: Login Failure Logging
**Objective:** Verify failed login attempts are handled securely  
**Steps:**
1. Attempt login with wrong password 5 times
2. Verify generic error message returned each time
3. Verify no information leakage about user existence

**Expected Result:** Consistent error messages, no user enumeration possible

---

#### TC-AUTH-012: Backward Compatibility - /api/user/me Endpoint
**Objective:** Verify backward-compatible user profile endpoint  
**Prerequisites:** Valid access token  
**Steps:**
1. GET `/api/user/me` with Bearer token
2. Verify response status 200
3. Verify same profile data as `/api/users/me`

**Expected Result:** Both endpoints return identical data

---

### User Profile Tests

#### TC-USER-001: Get User Profile - Authenticated
**Objective:** Retrieve logged-in user's profile  
**Prerequisites:** Valid JWT access token  
**Steps:**
1. GET `/api/users/me` with Bearer token header
2. Verify response status 200
3. Verify response contains: id, name, email, profileImageUrl, role

**Expected Result:** User profile retrieved successfully

---

#### TC-USER-002: Get User Profile - Unauthenticated
**Objective:** Verify profile access requires authentication  
**Steps:**
1. GET `/api/users/me` without Bearer token
2. Verify response status 401 (Unauthorized)

**Expected Result:** Access denied without token

---

#### TC-USER-003: Update User Profile - Valid Update
**Objective:** Update user name and email  
**Prerequisites:** Valid JWT token  
**Steps:**
1. PUT `/api/users/{userId}`
2. Payload: `{"name": "Jane Doe", "email": "jane@example.com"}`
3. Verify response status 200
4. Verify updates reflected in subsequent GET requests

**Expected Result:** Profile updated successfully

---

#### TC-USER-004: Update User Profile - Password Change
**Objective:** Update user password  
**Prerequisites:** Valid JWT token  
**Steps:**
1. PUT endpoint with `{"currentPassword": "OldPass123", "newPassword": "NewPass456"}`
2. Verify response status 200
3. Logout and verify new password works in login

**Expected Result:** Password successfully changed

---

#### TC-USER-005: User Profile Image URL
**Objective:** Verify profile image URL is stored and retrieved  
**Steps:**
1. Update profile with profileImageUrl
2. GET user profile
3. Verify profileImageUrl matches stored value

**Expected Result:** Image URL correctly stored and retrieved

---

#### TC-USER-006: User Data Isolation
**Objective:** Verify users cannot access other users' profiles  
**Prerequisites:** Two user accounts with tokens  
**Steps:**
1. Login as User A, get their token
2. Attempt to GET `/api/users/{userId_B}`
3. Verify response status 403 or 404 (no data leakage)

**Expected Result:** Access denied, no cross-user data access

---

### Campaign Management Tests

#### TC-CAMPAIGN-001: Create Campaign - Valid Data
**Objective:** Create new campaign in DRAFT status  
**Prerequisites:** Authenticated user  
**Steps:**
1. POST `/api/campaigns`
2. Payload: Campaign data (title, story, category, donationGoal, whoFor, imageUrl)
3. Verify response status 201
4. Verify status is "DRAFT"
5. Verify currentDonation is 0

**Expected Result:** Campaign created successfully in DRAFT status

---

#### TC-CAMPAIGN-002: Create Campaign - Missing Required Fields
**Objective:** Validate required campaign fields  
**Steps:**
1. POST `/api/campaigns` without title
2. Verify response status 400
3. Repeat for other required fields

**Expected Result:** Validation errors returned for missing fields

---

#### TC-CAMPAIGN-003: Create Campaign - Invalid Category
**Objective:** Verify category validation  
**Steps:**
1. POST `/api/campaigns` with invalid category
2. Verify response status 400 or 422

**Expected Result:** Invalid category rejected

---

#### TC-CAMPAIGN-004: List Published Campaigns - Default
**Objective:** Get paginated list of published campaigns  
**Prerequisites:** Multiple published campaigns exist  
**Steps:**
1. GET `/api/campaigns` (no parameters)
2. Verify response status 200
3. Verify response contains paginated list
4. Verify only PUBLISHED campaigns included
5. Verify default page size is 12

**Expected Result:** Published campaigns list returned with pagination

---

#### TC-CAMPAIGN-005: List Published Campaigns - Pagination
**Objective:** Verify pagination works correctly  
**Steps:**
1. GET `/api/campaigns?page=1&size=5`
2. Verify response contains exactly 5 items
3. GET `/api/campaigns?page=2&size=5`
4. Verify items on page 2 are different from page 1

**Expected Result:** Pagination works correctly

---

#### TC-CAMPAIGN-006: List Published Campaigns - Search
**Objective:** Search campaigns by title  
**Steps:**
1. GET `/api/campaigns?search=Healthcare`
2. Verify response contains only campaigns with "Healthcare" in title
3. Verify search is case-insensitive

**Expected Result:** Search filters campaigns correctly

---

#### TC-CAMPAIGN-007: List Published Campaigns - Filter by Category
**Objective:** Filter campaigns by category  
**Steps:**
1. GET `/api/campaigns?category=Health`
2. Verify all returned campaigns have category "Health"
3. Verify filter works with other categories

**Expected Result:** Category filter works correctly

---

#### TC-CAMPAIGN-008: List Published Campaigns - Search + Category
**Objective:** Verify combined search and category filters  
**Steps:**
1. GET `/api/campaigns?search=Hospital&category=Health`
2. Verify results match both criteria

**Expected Result:** Combined filters work correctly

---

#### TC-CAMPAIGN-009: List Published Campaigns - Sorting
**Objective:** Verify sort functionality  
**Steps:**
1. GET `/api/campaigns?sortBy=createdAt&sortDirection=DESC`
2. Verify campaigns sorted by creation date, newest first
3. Try `sortDirection=ASC`
4. Try `sortBy=currentDonation`

**Expected Result:** Sorting works correctly for all supported fields

---

#### TC-CAMPAIGN-010: List Published Campaigns - Status Filter
**Objective:** Verify only PUBLISHED campaigns returned  
**Prerequisites:** Mix of DRAFT and PUBLISHED campaigns exist  
**Steps:**
1. GET `/api/campaigns`
2. Verify NO draft campaigns in response
3. Verify all responses have status "PUBLISHED"

**Expected Result:** Only published campaigns returned

---

#### TC-CAMPAIGN-011: Get Campaign Details - Published Campaign
**Objective:** Retrieve specific campaign details  
**Steps:**
1. GET `/api/campaigns/{campaignId}`
2. Verify response status 200
3. Verify all campaign fields included: title, story, category, etc.
4. Verify donor list included

**Expected Result:** Campaign details retrieved successfully

---

#### TC-CAMPAIGN-012: Get Campaign Details - Non-existent Campaign
**Objective:** Verify 404 for non-existent campaign  
**Steps:**
1. GET `/api/campaigns/999999`
2. Verify response status 404

**Expected Result:** 404 Not Found returned

---

#### TC-CAMPAIGN-013: Update Campaign - Author Can Edit
**Objective:** Verify campaign author can update campaign  
**Prerequisites:** User is campaign author  
**Steps:**
1. PUT `/api/campaigns/{campaignId}`
2. Payload: Updated campaign data
3. Verify response status 200
4. Verify changes reflected in GET

**Expected Result:** Campaign updated successfully

---

#### TC-CAMPAIGN-014: Update Campaign - Non-author Cannot Edit
**Objective:** Verify authorization check  
**Prerequisites:** Different user's token  
**Steps:**
1. PUT `/api/campaigns/{campaignId}` with different user's token
2. Verify response status 403 (Forbidden)

**Expected Result:** Update blocked, 403 returned

---

#### TC-CAMPAIGN-015: Update Campaign - Only Author Can Publish
**Objective:** Verify only author can change status  
**Steps:**
1. Update campaign status to PUBLISHED (author)
2. Verify response status 200
3. Attempt same with different user
4. Verify 403 response

**Expected Result:** Only author can publish

---

#### TC-CAMPAIGN-016: Delete Campaign - Author Can Delete
**Objective:** Verify campaign deletion  
**Prerequisites:** User is author, no donations yet  
**Steps:**
1. DELETE `/api/campaigns/{campaignId}`
2. Verify response status 200
3. Verify GET returns 404

**Expected Result:** Campaign deleted successfully

---

#### TC-CAMPAIGN-017: Delete Campaign - Non-author Cannot Delete
**Objective:** Verify deletion authorization  
**Prerequisites:** Different user  
**Steps:**
1. DELETE with different user's token
2. Verify response status 403

**Expected Result:** Deletion blocked

---

#### TC-CAMPAIGN-018: Publish Campaign - Change Status from DRAFT to PUBLISHED
**Objective:** Make campaign visible to public  
**Prerequisites:** Campaign in DRAFT status  
**Steps:**
1. PUT `/api/campaigns/{campaignId}` with status: "PUBLISHED"
2. Verify response status 200
3. Verify campaign now appears in `/api/campaigns` list

**Expected Result:** Campaign published successfully

---

#### TC-CAMPAIGN-019: Publish Campaign - Set End Date
**Objective:** Verify end date is set on publish  
**Steps:**
1. Publish campaign without explicit end date
2. Verify endDate is set to 30 days from now (or configured duration)

**Expected Result:** End date automatically set

---

#### TC-CAMPAIGN-020: List User's Campaigns - /api/campaigns/my
**Objective:** Get authenticated user's campaigns  
**Prerequisites:** User has created multiple campaigns  
**Steps:**
1. GET `/api/campaigns/my`
2. Verify response includes all user's campaigns (DRAFT and PUBLISHED)
3. Verify no other users' campaigns included

**Expected Result:** User's campaigns retrieved

---

#### TC-CAMPAIGN-021: List User's Campaigns - Pagination
**Objective:** Verify pagination for /api/campaigns/my  
**Steps:**
1. GET `/api/campaigns/my?page=0&size=5`
2. Verify pagination works

**Expected Result:** Pagination works correctly

---

#### TC-CAMPAIGN-022: Campaign Search - Title Match
**Objective:** Search by campaign title  
**Steps:**
1. GET `/api/campaigns?search=Education`
2. Verify returned campaigns have "Education" in title

**Expected Result:** Title search works

---

#### TC-CAMPAIGN-023: Campaign Filter - Multiple Categories
**Objective:** Verify filter supports specific categories  
**Steps:**
1. Try categories: Health, Education, Environment, etc.
2. Verify filtering works for each

**Expected Result:** All categories filter correctly

---

#### TC-CAMPAIGN-024: Campaign Search - Case Insensitive
**Objective:** Verify search is case-insensitive  
**Steps:**
1. GET `/api/campaigns?search=HOSPITAL`
2. GET `/api/campaigns?search=hospital`
3. Verify both return same results

**Expected Result:** Search is case-insensitive

---

#### TC-CAMPAIGN-025: Campaign Sort - By Creation Date
**Objective:** Sort campaigns by date created  
**Steps:**
1. GET `/api/campaigns?sortBy=createdAt&sortDirection=DESC`
2. Verify newest campaigns first
3. Try ASC direction

**Expected Result:** Sorting by date works correctly

---

#### TC-CAMPAIGN-026: Campaign Sort - By Current Donation
**Objective:** Sort by donation progress  
**Steps:**
1. GET `/api/campaigns?sortBy=currentDonation&sortDirection=DESC`
2. Verify highest donations first

**Expected Result:** Sort by amount works

---

#### TC-CAMPAIGN-027: Campaign Days Remaining Calculation
**Objective:** Verify days remaining calculation  
**Prerequisites:** Published campaign with endDate  
**Steps:**
1. GET `/api/campaigns/{campaignId}`
2. Verify daysRemaining matches calculation: `(endDate - now).days`
3. Verify updates daily

**Expected Result:** Days remaining calculated correctly

---

#### TC-CAMPAIGN-028: Campaign Donation Progress Calculation
**Objective:** Verify progress bar calculation  
**Prerequisites:** Campaign with donations  
**Steps:**
1. GET `/api/campaigns/{campaignId}`
2. Calculate progress: `(currentDonation / donationGoal) * 100`
3. Verify matches expected percentage

**Expected Result:** Progress calculated correctly

---

### Donation Management Tests

#### TC-DONATION-001: Create Donation - Valid Data
**Objective:** Create donation to published campaign  
**Prerequisites:** Published campaign exists, authenticated user  
**Steps:**
1. POST `/api/donations/campaigns/{campaignId}`
2. Payload: `{"amount": 500, "donorMessage": "Keep up the good work!"}`
3. Verify response status 201
4. Verify donation is created with COMPLETED status
5. Verify campaign's currentDonation increased by 500

**Expected Result:** Donation created successfully, campaign updated

---

#### TC-DONATION-002: Create Donation - Minimum Amount
**Objective:** Verify minimum donation amount enforcement  
**Steps:**
1. POST with amount: 0
2. Verify response status 400
3. Try with negative amount
4. Verify both rejected

**Expected Result:** Invalid amounts rejected

---

#### TC-DONATION-003: Create Donation - Large Amount
**Objective:** Verify large donations accepted  
**Steps:**
1. POST with amount: 1000000
2. Verify response status 201
3. Verify campaign total updated correctly

**Expected Result:** Large donations accepted

---

#### TC-DONATION-004: Create Donation - Anonymous
**Objective:** Create anonymous donation  
**Steps:**
1. POST with `"anonymous": true, "donorMessage": "..."`
2. Verify donation created
3. Verify donorName shows as "Anonymous" in donor list
4. Verify message is still included

**Expected Result:** Anonymous donation created successfully

---

#### TC-DONATION-005: Create Donation - Named
**Objective:** Create named donation  
**Steps:**
1. POST with `"anonymous": false`
2. Verify donor name appears in donor list

**Expected Result:** Named donation shows donor identity

---

#### TC-DONATION-006: Create Donation - Idempotency Key (Prevent Duplicates)
**Objective:** Verify idempotency key prevents duplicate processing  
**Prerequisites:** Campaign exists  
**Steps:**
1. POST donation with `X-Idempotency-Key: "uuid-123"`
2. Verify response status 201
3. POST exact same request with same idempotency key
4. Verify response status 201 (not 400)
5. Verify campaign currentDonation increased by only 500 (not 1000)

**Expected Result:** Second request with same key returns idempotent result

---

#### TC-DONATION-007: Create Donation - Different Idempotency Keys
**Objective:** Verify different keys create separate donations  
**Steps:**
1. POST with idempotency key "uuid-1"
2. POST identical request with key "uuid-2"
3. Verify campaign increased by 1000 total

**Expected Result:** Different keys create separate donations

---

#### TC-DONATION-008: Get User Donations - /api/donations/me
**Objective:** Retrieve authenticated user's donation history  
**Prerequisites:** User has made donations  
**Steps:**
1. GET `/api/donations/me`
2. Verify response contains all user's donations
3. Verify no other users' donations included

**Expected Result:** User's donations retrieved

---

#### TC-DONATION-009: Get User Donations - Unauthenticated
**Objective:** Verify authentication required  
**Steps:**
1. GET `/api/donations/me` without token
2. Verify response status 401

**Expected Result:** Access denied without auth

---

#### TC-DONATION-010: Get Campaign Donors - /api/donations/campaigns/{campaignId}
**Objective:** Get list of donors for a campaign  
**Prerequisites:** Campaign has donations  
**Steps:**
1. GET `/api/donations/campaigns/{campaignId}`
2. Verify response contains donor list
3. Verify anonymous donors show as "Anonymous"
4. Verify named donors show names
5. Verify donor messages included

**Expected Result:** Donor list retrieved successfully

---

#### TC-DONATION-011: Get Campaign Donors - Empty List
**Objective:** Handle campaign with no donations  
**Steps:**
1. GET `/api/donations/campaigns/{campaignId}` for new campaign
2. Verify response status 200
3. Verify empty list or null returned

**Expected Result:** Empty donor list handled correctly

---

#### TC-DONATION-012: Campaign Total Updated After Donation
**Objective:** Verify campaign donation total accuracy  
**Prerequisites:** Campaign with known initial total  
**Steps:**
1. Record initial `currentDonation`
2. Create donation of 250
3. GET campaign
4. Verify `currentDonation` increased by exactly 250

**Expected Result:** Campaign total updated correctly

---

#### TC-DONATION-013: Donation Status - COMPLETED
**Objective:** Verify donation status tracking  
**Steps:**
1. Create donation
2. GET donation details
3. Verify status is "COMPLETED"

**Expected Result:** Donation marked as COMPLETED

---

#### TC-DONATION-014: Donation Count Tracking
**Objective:** Verify donation count increments  
**Prerequisites:** Campaign with known donation count  
**Steps:**
1. Record initial `donationCount`
2. Create new donation
3. GET campaign
4. Verify `donationCount` incremented by 1

**Expected Result:** Donation count tracked correctly

---

#### TC-DONATION-015: Prevent Donation to Draft Campaign
**Objective:** Verify cannot donate to unpublished campaigns  
**Prerequisites:** Campaign in DRAFT status  
**Steps:**
1. POST to `/api/donations/campaigns/{draftCampaignId}`
2. Verify response status 403 or 422 (Forbidden/Invalid)

**Expected Result:** Draft campaign donation rejected

---

### Bookmark Tests

#### TC-BOOKMARK-001: Add Bookmark
**Objective:** Add campaign to bookmarks  
**Prerequisites:** Campaign exists, authenticated user  
**Steps:**
1. POST `/api/bookmarks/{campaignId}`
2. Verify response status 201

**Expected Result:** Campaign bookmarked successfully

---

#### TC-BOOKMARK-002: Add Bookmark - Duplicate
**Objective:** Verify duplicate bookmark handling  
**Prerequisites:** Campaign already bookmarked  
**Steps:**
1. POST `/api/bookmarks/{campaignId}` again
2. Verify response status (201 or 409 depending on implementation)

**Expected Result:** Duplicate handling works consistently

---

#### TC-BOOKMARK-003: Remove Bookmark
**Objective:** Remove campaign from bookmarks  
**Prerequisites:** Campaign is bookmarked  
**Steps:**
1. DELETE `/api/bookmarks/{campaignId}`
2. Verify response status 200

**Expected Result:** Campaign removed from bookmarks

---

#### TC-BOOKMARK-004: Remove Bookmark - Non-existent
**Objective:** Handle removing non-bookmarked campaign  
**Steps:**
1. DELETE non-bookmarked campaign
2. Verify response status 404 or 200

**Expected Result:** Handled gracefully

---

#### TC-BOOKMARK-005: Get Bookmarked Campaigns
**Objective:** Retrieve user's bookmarked campaigns  
**Prerequisites:** User has bookmarked campaigns  
**Steps:**
1. GET `/api/bookmarks`
2. Verify all bookmarked campaigns returned
3. Verify no non-bookmarked campaigns included

**Expected Result:** Bookmarks retrieved successfully

---

### Dashboard Tests

#### TC-DASHBOARD-001: Get Dashboard Summary
**Objective:** Retrieve dashboard statistics  
**Prerequisites:** Authenticated user with data  
**Steps:**
1. GET `/api/dashboard/summary`
2. Verify response contains: donations received, active campaigns, total raised
3. Verify numbers are accurate based on actual data

**Expected Result:** Dashboard summary retrieved correctly

---

#### TC-DASHBOARD-002: Dashboard Stats - New User
**Objective:** Verify dashboard for user with no campaigns/donations  
**Steps:**
1. New user GET `/api/dashboard/summary`
2. Verify donations received = 0
3. Verify active campaigns = 0
4. Verify total raised = 0

**Expected Result:** Stats show zeros for new user

---

#### TC-DASHBOARD-003: Dashboard Recent Activity
**Objective:** Retrieve recent user activity  
**Steps:**
1. GET `/api/dashboard/summary`
2. Verify recent activity list included
3. Verify shows recent campaigns, donations, etc.

**Expected Result:** Activity feed retrieved

---

#### TC-DASHBOARD-004: Dashboard Activity Limit
**Objective:** Verify activity list limit (e.g., top 5)  
**Steps:**
1. Create 10+ activities
2. GET `/api/dashboard/summary`
3. Verify limited to configured number (e.g., 5)
4. Verify newest activities included

**Expected Result:** Activity list properly limited and sorted

---

#### TC-DASHBOARD-005: Dashboard Stats Accuracy
**Objective:** Verify all calculated stats are accurate  
**Prerequisites:** User with campaigns and donations  
**Steps:**
1. Manually calculate: total donations received, active campaigns count, total amount raised
2. GET dashboard summary
3. Verify each stat matches calculation

**Expected Result:** All stats accurate

---

### Security Tests

#### TC-SECURITY-001: JWT Validation
**Objective:** Verify JWT tokens are properly validated  
**Steps:**
1. GET protected endpoint with valid token
2. Verify success (200)
3. GET with tampered token
4. Verify 401 response

**Expected Result:** Token validation works correctly

---

#### TC-SECURITY-002: Token Expiration
**Objective:** Verify expired tokens are rejected  
**Prerequisites:** Old/expired token  
**Steps:**
1. GET protected endpoint with expired token
2. Verify response status 401

**Expected Result:** Expired tokens rejected

---

#### TC-SECURITY-003: Bearer Token Format
**Objective:** Verify Bearer token required in Authorization header  
**Steps:**
1. GET with header: `Authorization: Bearer valid_token` → success
2. GET with header: `Authorization: valid_token` (no Bearer) → fail
3. GET with no Authorization header → fail

**Expected Result:** Bearer format strictly enforced

---

#### TC-SECURITY-004: Missing Authorization Header
**Objective:** Verify protected endpoints require auth  
**Steps:**
1. GET protected endpoint without Authorization header
2. Verify response status 401

**Expected Result:** Auth header required

---

#### TC-SECURITY-005: Resource Ownership - Campaign
**Objective:** Verify users can only modify own campaigns  
**Prerequisites:** Two users with campaigns  
**Steps:**
1. User A tries to edit User B's campaign
2. Verify 403 response
3. User A tries to delete User B's campaign
4. Verify 403 response

**Expected Result:** Only campaign author can modify

---

#### TC-SECURITY-006: Resource Ownership - Profile
**Objective:** Verify users can only modify own profile  
**Steps:**
1. User A tries to update User B's profile
2. Verify 403 or 404 response

**Expected Result:** Profile modification restricted to owner

---

#### TC-SECURITY-007: Admin Privileges
**Objective:** Verify admin users have elevated permissions  
**Prerequisites:** Admin user account  
**Steps:**
1. Admin edits another user's campaign
2. Verify allowed (200)
3. Admin deletes another user's campaign
4. Verify allowed

**Expected Result:** Admin can modify other users' resources

---

#### TC-SECURITY-008: Token Refresh Flow
**Objective:** Verify refresh token flow for session continuation  
**Steps:**
1. Login, receive accessToken and refreshToken
2. Wait for accessToken to expire
3. Use refreshToken to get new accessToken
4. Verify new token works for protected endpoints

**Expected Result:** Refresh flow allows session continuation

---

---

## Manual Test Scripts

### Script 1: User Registration & Login Flow

```gherkin
Feature: User Registration and Authentication
  
  Scenario: Complete registration and login
    Given I am on the landing page
    When I click "Sign Up"
    And I enter name "John Doe"
    And I enter email "john.doe@example.com"
    And I enter password "SecurePassword123"
    And I click "Register"
    Then I should see success message
    And I should be logged in
    And I should see dashboard
    
  Scenario: Existing user login
    Given I am on the login page
    When I enter email "john.doe@example.com"
    And I enter password "SecurePassword123"
    And I click "Login"
    Then I should be logged in
    And I should see dashboard
```

### Script 2: Campaign Creation & Publishing

```gherkin
Feature: Campaign Management

  Scenario: Create and publish a campaign
    Given I am logged in as a fundraiser
    When I click "Create Campaign"
    Then I should see the campaign form
    
    # Step 1: Who For?
    When I select "For a person"
    And I enter name "Maria Santos"
    And I click "Next"
    Then I should see "Campaign Title" step
    
    # Step 2: Title
    When I enter title "Help Maria's Education"
    And I click "Next"
    Then I should see "Category" step
    
    # Step 3: Category
    When I select category "Education"
    And I click "Next"
    Then I should see "Donation Goal" step
    
    # Step 4: Goal
    When I enter goal "₱50,000"
    And I click "Next"
    Then I should see "Story & Image" step
    
    # Step 5: Complete
    When I enter story "Maria deserves quality education..."
    And I upload image "story.jpg"
    And I click "Create"
    Then I should see success message
    And campaign status should be "DRAFT"
    
    # Publish
    When I click "Publish"
    Then campaign status should be "PUBLISHED"
    And campaign should appear in public list
```

### Script 3: Campaign Browsing & Donation

```gherkin
Feature: Campaign Browsing and Donation

  Scenario: Browse campaigns and donate
    Given I am logged in
    When I click "Browse Campaigns"
    Then I should see list of published campaigns
    
    # Search and filter
    When I search for "Education"
    Then I should see only education-related campaigns
    
    When I filter by category "Health"
    Then I should see only health campaigns
    
    # View campaign details
    When I click on a campaign
    Then I should see campaign details
    And I should see donation progress bar
    And I should see list of donors
    
    # Make donation
    When I enter donation amount "₱500"
    And I click preset amount "₱500"
    And I enter message "All the best!"
    And I click "Donate"
    Then I should see success message
    And I should see my donation in the list
    And campaign total should increase by ₱500
    
    # Anonymous donation
    When I check "Donate anonymously"
    And I donate again
    Then I should see "Anonymous" as donor name
    And my personal donation should still show my name
```

### Script 4: User Dashboard

```gherkin
Feature: User Dashboard

  Scenario: View dashboard statistics
    Given I am logged in
    When I click "Dashboard"
    Then I should see:
      | Statistic | Example Value |
      | Donations Received | ₱15,500 |
      | Active Campaigns | 3 |
      | Total Raised | ₱125,000 |
      
    And I should see recent activity
    And activity should include:
      - Recent campaign creations
      - Recent donations received
      - Recent bookmarks
```

### Script 5: User Profile Management

```gherkin
Feature: User Profile Management

  Scenario: Update profile information
    Given I am logged in
    When I click "Settings"
    Then I should see profile form with current values
    
    When I change name to "Jane Smith"
    And I change email to "jane.smith@example.com"
    And I click "Save"
    Then I should see success message
    And profile should be updated
    
  Scenario: Change password
    Given I am logged in
    When I click "Settings"
    And I enter current password
    And I enter new password "NewSecurePass456"
    And I click "Update Password"
    Then I should see success message
    
    When I logout
    And I login with old password
    Then login should fail
    
    When I login with new password
    Then login should succeed
    
  Scenario: View donation history
    Given I am logged in with donation history
    When I click "Settings"
    And I scroll to "Donation History"
    Then I should see table of donations
    And table should show:
      - Campaign name
      - Amount
      - Date
      - Status
```

---

## Automated Test Cases

### Backend API Tests (JUnit + REST Assured)

#### Test 1: Authentication Module - Integration Tests

**File:** `AuthControllerTest.java`

```java
package edu.cit.cosina.altru.auth;

import edu.cit.cosina.altru.auth.dto.LoginRequest;
import edu.cit.cosina.altru.auth.dto.RegisterRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void testRegisterWithValidData() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setName("John Doe");
        request.setEmail("john@example.com");
        request.setPassword("SecurePass123");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                        "name": "John Doe",
                        "email": "john@example.com",
                        "password": "SecurePass123"
                    }
                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.id").exists())
                .andExpect(jsonPath("$.data.email").value("john@example.com"));
    }

    @Test
    void testRegisterWithDuplicateEmail() throws Exception {
        // Create first user
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                        "name": "John",
                        "email": "duplicate@example.com",
                        "password": "Pass123"
                    }
                """))
                .andExpect(status().isCreated());

        // Try duplicate
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                        "name": "Jane",
                        "email": "duplicate@example.com",
                        "password": "Pass456"
                    }
                """))
                .andExpect(status().isConflict());
    }

    @Test
    void testLoginWithValidCredentials() throws Exception {
        // Register first
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                        "name": "Login Test",
                        "email": "login@example.com",
                        "password": "LoginPass123"
                    }
                """))
                .andExpect(status().isCreated());

        // Login
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                        "email": "login@example.com",
                        "password": "LoginPass123"
                    }
                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.accessToken").exists())
                .andExpect(jsonPath("$.data.refreshToken").exists());
    }

    @Test
    void testLoginWithInvalidPassword() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                        "email": "login@example.com",
                        "password": "WrongPassword"
                    }
                """))
                .andExpect(status().isUnauthorized());
    }
}
```

#### Test 2: Campaign Module - Integration Tests

**File:** `CampaignControllerTest.java`

```java
package edu.cit.cosina.altru.campaign;

import edu.cit.cosina.altru.campaign.dto.CampaignResponse;
import edu.cit.cosina.altru.campaign.dto.CampaignUpsertRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class CampaignControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @WithMockUser(username = "user1", roles = "USER")
    void testCreateCampaign() throws Exception {
        String campaignPayload = """
            {
                "title": "Help Maria's Education",
                "story": "Maria needs funds for college education",
                "category": "Education",
                "donationGoal": 50000,
                "whoFor": "Maria Santos",
                "imageUrl": "https://example.com/image.jpg"
            }
        """;

        mockMvc.perform(post("/api/campaigns")
                .contentType(MediaType.APPLICATION_JSON)
                .content(campaignPayload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.id").exists())
                .andExpect(jsonPath("$.data.status").value("DRAFT"))
                .andExpect(jsonPath("$.data.currentDonation").value(0));
    }

    @Test
    @WithMockUser(username = "user1", roles = "USER")
    void testGetPublishedCampaigns() throws Exception {
        mockMvc.perform(get("/api/campaigns")
                .param("page", "0")
                .param("size", "12"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content", hasSize(greaterThanOrEqualTo(0))))
                .andExpect(jsonPath("$.data.totalElements").exists());
    }

    @Test
    @WithMockUser(username = "user1", roles = "USER")
    void testSearchCampaigns() throws Exception {
        mockMvc.perform(get("/api/campaigns")
                .param("search", "Education")
                .param("page", "0")
                .param("size", "12"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content[*].title", 
                    everyItem(containsStringIgnoringCase("Education")))
                        .description("All titles should contain 'Education'"));
    }

    @Test
    @WithMockUser(username = "user1", roles = "USER")
    void testFilterByCategory() throws Exception {
        mockMvc.perform(get("/api/campaigns")
                .param("category", "Health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content[*].category", 
                    everyItem(equalTo("Health"))));
    }

    @Test
    @WithMockUser(username = "user1", roles = "USER")
    void testUpdateCampaign_AuthorOnly() throws Exception {
        // Create campaign first
        Long campaignId = createTestCampaign();

        String updatePayload = """
            {
                "title": "Updated Title",
                "story": "Updated story",
                "category": "Health",
                "donationGoal": 75000,
                "whoFor": "Updated",
                "imageUrl": "https://example.com/new.jpg"
            }
        """;

        mockMvc.perform(put("/api/campaigns/" + campaignId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(updatePayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.title").value("Updated Title"));
    }

    @Test
    @WithMockUser(username = "user2", roles = "USER")
    void testDeleteCampaign_NonAuthorCannotDelete() throws Exception {
        Long campaignId = createTestCampaign(); // Created by user1

        mockMvc.perform(delete("/api/campaigns/" + campaignId))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "user1", roles = "USER")
    void testGetMyCampaigns() throws Exception {
        mockMvc.perform(get("/api/campaigns/my")
                .param("page", "0")
                .param("size", "12"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content").isArray());
    }

    private Long createTestCampaign() throws Exception {
        // Helper method to create a campaign and return its ID
        // Implementation would parse response and extract ID
        return 1L;
    }
}
```

#### Test 3: Donation Module - Integration Tests

**File:** `DonationControllerTest.java`

```java
package edu.cit.cosina.altru.donation;

import edu.cit.cosina.altru.donation.dto.DonationCreateRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class DonationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @WithMockUser(username = "donor1", roles = "USER")
    void testCreateDonation() throws Exception {
        Long publishedCampaignId = getPublishedCampaignId(); // Helper method

        mockMvc.perform(post("/api/donations/campaigns/" + publishedCampaignId)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                        "amount": 500,
                        "donorMessage": "Keep up the good work!"
                    }
                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.id").exists())
                .andExpect(jsonPath("$.data.status").value("COMPLETED"));
    }

    @Test
    @WithMockUser(username = "donor1", roles = "USER")
    void testCreateAnonymousDonation() throws Exception {
        Long campaignId = getPublishedCampaignId();

        mockMvc.perform(post("/api/donations/campaigns/" + campaignId)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                        "amount": 250,
                        "anonymous": true,
                        "donorMessage": "Support from a friend"
                    }
                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.donorName").value("Anonymous"));
    }

    @Test
    @WithMockUser(username = "donor1", roles = "USER")
    void testIdempotentDonation() throws Exception {
        Long campaignId = getPublishedCampaignId();
        String idempotencyKey = UUID.randomUUID().toString();

        // First donation
        mockMvc.perform(post("/api/donations/campaigns/" + campaignId)
                .header("X-Idempotency-Key", idempotencyKey)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                        "amount": 100
                    }
                """))
                .andExpect(status().isCreated());

        // Duplicate with same key
        mockMvc.perform(post("/api/donations/campaigns/" + campaignId)
                .header("X-Idempotency-Key", idempotencyKey)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                        "amount": 100
                    }
                """))
                .andExpect(status().isCreated());

        // Verify campaign only increased by 100, not 200
        mockMvc.perform(get("/api/campaigns/" + campaignId))
                .andExpect(jsonPath("$.data.currentDonation").value(100));
    }

    @Test
    @WithMockUser(username = "donor1", roles = "USER")
    void testGetMyDonations() throws Exception {
        mockMvc.perform(get("/api/donations/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isArray());
    }

    @Test
    @WithMockUser(username = "user1", roles = "USER")
    void testGetCampaignDonors() throws Exception {
        Long campaignId = getPublishedCampaignId();

        mockMvc.perform(get("/api/donations/campaigns/" + campaignId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isArray());
    }

    @Test
    @WithMockUser(username = "donor1", roles = "USER")
    void testCannotDonateToDraftCampaign() throws Exception {
        Long draftCampaignId = getPrivateCampaignId(); // Draft campaign

        mockMvc.perform(post("/api/donations/campaigns/" + draftCampaignId)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                        "amount": 100
                    }
                """))
                .andExpect(status().isForbidden());
    }

    private Long getPublishedCampaignId() {
        // Helper to get or create a published campaign
        return 1L;
    }

    private Long getPrivateCampaignId() {
        // Helper to get or create a draft campaign
        return 2L;
    }
}
```

### Frontend Tests (Jest + React Testing Library)

#### Test 4: Authentication Component Tests

**File:** `AuthContext.test.jsx`

```javascript
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import { loginApi } from '../core/services/apiService';

jest.mock('../core/services/apiService');

const TestComponent = () => {
    const { user, login, logout } = useAuth();
    return (
        <div>
            <div data-testid="user-info">
                {user ? `Logged in as ${user.name}` : 'Not logged in'}
            </div>
            <button 
                data-testid="login-btn"
                onClick={() => login('test@example.com', 'password')}
            >
                Login
            </button>
            <button 
                data-testid="logout-btn"
                onClick={logout}
            >
                Logout
            </button>
        </div>
    );
};

describe('AuthContext', () => {
    test('should initialize with no user', () => {
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );
        expect(screen.getByTestId('user-info')).toHaveTextContent('Not logged in');
    });

    test('should login user successfully', async () => {
        const mockUser = { id: 1, name: 'John Doe', email: 'john@example.com' };
        loginApi.mockResolvedValue({ user: mockUser, accessToken: 'token123' });

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        screen.getByTestId('login-btn').click();

        await waitFor(() => {
            expect(screen.getByTestId('user-info')).toHaveTextContent('Logged in as John Doe');
        });
    });

    test('should handle login failure', async () => {
        loginApi.mockRejectedValue(new Error('Invalid credentials'));

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        screen.getByTestId('login-btn').click();

        await waitFor(() => {
            expect(screen.getByTestId('user-info')).toHaveTextContent('Not logged in');
        });
    });

    test('should logout user', async () => {
        const mockUser = { id: 1, name: 'John Doe' };
        loginApi.mockResolvedValue({ user: mockUser, accessToken: 'token123' });

        const { rerender } = render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        screen.getByTestId('login-btn').click();

        await waitFor(() => {
            expect(screen.getByTestId('user-info')).toHaveTextContent('Logged in');
        });

        screen.getByTestId('logout-btn').click();

        await waitFor(() => {
            expect(screen.getByTestId('user-info')).toHaveTextContent('Not logged in');
        });
    });
});
```

#### Test 5: Campaign Component Tests

**File:** `Causes.test.jsx`

```javascript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Causes from './features/campaigns/pages/causes';
import * as apiService from './core/services/apiService';

jest.mock('./core/services/apiService');
jest.mock('./core/context/AuthContext', () => ({
    useAuth: () => ({ user: { id: 1, name: 'Test User' } })
}));

describe('Causes Component', () => {
    const mockCampaigns = [
        {
            id: 1,
            title: 'Help Maria',
            category: 'Education',
            donationGoal: 50000,
            currentDonation: 25000,
            daysRemaining: 15,
            authorName: 'John Doe'
        },
        {
            id: 2,
            title: 'Medical Fund',
            category: 'Health',
            donationGoal: 100000,
            currentDonation: 60000,
            daysRemaining: 20,
            authorName: 'Jane Smith'
        }
    ];

    beforeEach(() => {
        apiService.campaignsApi.list.mockResolvedValue(mockCampaigns);
    });

    test('should display list of campaigns', async () => {
        render(
            <BrowserRouter>
                <Causes />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Help Maria')).toBeInTheDocument();
            expect(screen.getByText('Medical Fund')).toBeInTheDocument();
        });
    });

    test('should filter campaigns by category', async () => {
        apiService.campaignsApi.list.mockResolvedValue([mockCampaigns[0]]);

        render(
            <BrowserRouter>
                <Causes />
            </BrowserRouter>
        );

        const categoryFilter = screen.getByDisplayValue('Education');
        fireEvent.change(categoryFilter, { target: { value: 'Education' } });

        await waitFor(() => {
            expect(screen.getByText('Help Maria')).toBeInTheDocument();
        });
    });

    test('should search campaigns by title', async () => {
        apiService.campaignsApi.list.mockResolvedValue([mockCampaigns[0]]);

        render(
            <BrowserRouter>
                <Causes />
            </BrowserRouter>
        );

        const searchInput = screen.getByPlaceholderText(/search/i);
        fireEvent.change(searchInput, { target: { value: 'Maria' } });

        await waitFor(() => {
            expect(apiService.campaignsApi.list).toHaveBeenCalledWith(
                expect.objectContaining({ search: 'Maria' })
            );
        });
    });

    test('should bookmark a campaign', async () => {
        apiService.bookmarksApi.add.mockResolvedValue({});

        render(
            <BrowserRouter>
                <Causes />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Help Maria')).toBeInTheDocument();
        });

        const bookmarkBtn = screen.getAllByTestId('bookmark-btn')[0];
        fireEvent.click(bookmarkBtn);

        await waitFor(() => {
            expect(apiService.bookmarksApi.add).toHaveBeenCalledWith(1);
        });
    });

    test('should navigate to campaign details', async () => {
        const { history } = render(
            <BrowserRouter>
                <Causes />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Help Maria')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('View'));

        await waitFor(() => {
            expect(history.location.pathname).toBe('/campaigns/1');
        });
    });
});
```

#### Test 6: Donation Component Tests

**File:** `CauseDetails.test.jsx`

```javascript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CauseDetails from './features/campaigns/pages/causeDetails';
import * as apiService from './core/services/apiService';

jest.mock('./core/services/apiService');
jest.mock('./core/context/AuthContext', () => ({
    useAuth: () => ({ user: { id: 1, name: 'Test User' } })
}));

describe('CauseDetails Component', () => {
    const mockCampaign = {
        id: 1,
        title: 'Help Maria',
        story: 'Maria needs education...',
        category: 'Education',
        donationGoal: 50000,
        currentDonation: 25000,
        daysRemaining: 15,
        authorName: 'John Doe'
    };

    const mockDonors = [
        { id: 1, donorName: 'Anonymous', amount: 5000, donorMessage: 'Good luck' }
    ];

    beforeEach(() => {
        apiService.campaignsApi.getById.mockResolvedValue(mockCampaign);
        apiService.donationsApi.byCampaign.mockResolvedValue(mockDonors);
    });

    test('should display campaign details', async () => {
        render(
            <BrowserRouter>
                <CauseDetails />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Help Maria')).toBeInTheDocument();
            expect(screen.getByText('Maria needs education...')).toBeInTheDocument();
        });
    });

    test('should display donor list', async () => {
        render(
            <BrowserRouter>
                <CauseDetails />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Anonymous')).toBeInTheDocument();
            expect(screen.getByText('₱5000')).toBeInTheDocument();
        });
    });

    test('should create donation with amount', async () => {
        apiService.donationsApi.create.mockResolvedValue({ success: true });

        render(
            <BrowserRouter>
                <CauseDetails />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Help Maria')).toBeInTheDocument();
        });

        const amountInput = screen.getByPlaceholderText(/Amount to donate/);
        fireEvent.change(amountInput, { target: { value: '1000' } });

        const donateBtn = screen.getByText('Donate');
        fireEvent.click(donateBtn);

        await waitFor(() => {
            expect(apiService.donationsApi.create).toHaveBeenCalledWith(
                1,
                1000,
                expect.anything(),
                false,
                ''
            );
        });
    });

    test('should create anonymous donation', async () => {
        apiService.donationsApi.create.mockResolvedValue({ success: true });

        render(
            <BrowserRouter>
                <CauseDetails />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Help Maria')).toBeInTheDocument();
        });

        fireEvent.change(screen.getByPlaceholderText(/Amount/), { target: { value: '500' } });
        fireEvent.click(screen.getByRole('checkbox', { name: /Donate anonymously/ }));
        fireEvent.click(screen.getByText('Donate'));

        await waitFor(() => {
            expect(apiService.donationsApi.create).toHaveBeenCalledWith(
                1,
                500,
                expect.anything(),
                true,
                ''
            );
        });
    });

    test('should validate donation amount', async () => {
        render(
            <BrowserRouter>
                <CauseDetails />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Help Maria')).toBeInTheDocument();
        });

        fireEvent.change(screen.getByPlaceholderText(/Amount/), { target: { value: '0' } });
        fireEvent.click(screen.getByText('Donate'));

        await waitFor(() => {
            expect(screen.getByText(/Please enter a valid amount/)).toBeInTheDocument();
        });
    });

    test('should display progress bar', async () => {
        render(
            <BrowserRouter>
                <CauseDetails />
            </BrowserRouter>
        );

        await waitFor(() => {
            const progressBar = screen.getByRole('progressbar');
            expect(progressBar).toHaveStyle({ width: '50%' });
        });
    });
});
```

---

## Test Execution Strategy

### Phase 1: Unit Tests
- **Timeline:** Week 1
- **Coverage:** Individual functions, services, DTOs
- **Tool:** JUnit (Backend), Jest (Frontend)
- **Command:**
  ```bash
  # Backend
  cd backend
  mvn test
  
  # Frontend
  cd web
  npm test
  ```

### Phase 2: Integration Tests
- **Timeline:** Week 2
- **Coverage:** API endpoints, database interactions
- **Tool:** MockMvc, REST Assured (Backend), React Testing Library (Frontend)
- **Command:**
  ```bash
  mvn test -Dgroups=integration
  npm run test:integration
  ```

### Phase 3: End-to-End Tests
- **Timeline:** Week 3
- **Coverage:** Complete user workflows
- **Tool:** Cypress or Selenium (Frontend), API tests (Backend)
- **Command:**
  ```bash
  npm run cypress:run
  npm run e2e
  ```

### Phase 4: Performance Tests
- **Timeline:** Week 4
- **Coverage:** Response times, database query optimization
- **Tool:** JMeter, Lighthouse
- **Command:**
  ```bash
  # Load testing
  jmeter -n -t test_plan.jmx
  
  # Frontend performance
  npm run lighthouse
  ```

### Phase 5: Security Tests
- **Timeline:** Week 4
- **Coverage:** Authentication, authorization, input validation
- **Tool:** OWASP ZAP, SonarQube
- **Command:**
  ```bash
  sonar-scanner
  ```

### CI/CD Integration
```yaml
# GitHub Actions / Jenkins Configuration
test:
  backend-unit:
    cmd: mvn test
    
  backend-integration:
    cmd: mvn test -Dgroups=integration
    
  frontend-unit:
    cmd: npm test
    
  frontend-e2e:
    cmd: npm run cypress:run
    
  security-scan:
    cmd: sonar-scanner
```

---

## Test Coverage Goals

| Module | Target Coverage | Current |
|--------|-----------------|---------|
| Authentication | 90% | - |
| User Management | 85% | - |
| Campaign Management | 90% | - |
| Donation Processing | 95% | - |
| Security/Authorization | 90% | - |
| **Overall** | **90%** | - |

---

## Defect Tracking

Use the following template for test failure reporting:

**Defect Template:**
```
Title: [Module] - [Brief description]
Severity: Critical/High/Medium/Low
Steps to Reproduce:
  1. ...
  2. ...
Expected Result:
Actual Result:
Environment: [Backend/Frontend/Both]
Attachment: [Screenshots/Logs]
```

---

**Test Plan Version:** 1.0  
**Last Review Date:** May 8, 2026  
**Next Review Date:** June 8, 2026  
**Prepared By:** QA Team
