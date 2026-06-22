# Authentication

Simple JWT auth. No OAuth, no third parties. This is for personal use / friends.

## Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Create account (email, password, profile data) |
| POST | /api/auth/login | Login → returns JWT |
| GET | /api/auth/me | Authenticated user's profile |
| PUT | /api/auth/profile | Update profile data (weight, age, etc.) |

## Implementation

- **bcrypt** for password hashing
- **JWT** with 30-day expiration (personal app, no need for refresh tokens)
- Auth middleware protects all `/api/*` routes except register and login
- Token sent in `Authorization: Bearer <token>` header
- Frontend stores the token in localStorage

## Flow

```
1. User registers → POST /api/auth/register
   Body: { email, password, name, age, weight_kg, height_cm, sex, activity_level }
   Response: { token, user }

2. Login → POST /api/auth/login
   Body: { email, password }
   Response: { token, user }

3. All other requests include:
   Header: Authorization: Bearer <token>
```
