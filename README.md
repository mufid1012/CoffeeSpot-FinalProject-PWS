# CoffeeSpot API

Complete API platform for coffee shop directory in Indonesia.

## Project Structure

```
openapi-web/
├── frontend/          # Static HTML/CSS/JS frontend
│   ├── index.html     # Landing page
│   ├── css/           # Stylesheets
│   ├── js/            # JavaScript utilities
│   ├── auth/          # Login & Register pages
│   ├── user/          # User dashboard
│   ├── admin/         # Admin dashboard
│   └── docs/          # API documentation
│
└── backend/           # Node.js + Express API
    ├── config/        # Database configuration
    ├── middleware/    # Auth, API key, logging
    ├── routes/        # API routes
    ├── database/      # Schema & seed data
    ├── app.js         # Express app
    └── server.js      # Entry point
```

## Quick Start

### 1. Setup Backend

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Configure environment (edit .env file)
# - Set DB_PASSWORD if needed
# - Change JWT_SECRET for production

# Setup database (requires MySQL running)
npm run db:setup

# Start server
npm run dev
```

### 2. Access Application

- **Frontend**: http://localhost:3000
- **API**: http://localhost:3000/api

### 3. Default Credentials

| Role  | Email               | Password  |
|-------|---------------------|-----------|
| Admin | admin@coffeespot.id | admin123  |
| User  | dev@example.com     | user123   |

## API Endpoints

### Public API (requires x-api-key header)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/coffeeshops | List coffee shops |
| GET | /api/coffeeshops/:id | Get coffee shop detail |
| GET | /api/categories | List categories |
| GET | /api/facilities | List facilities |
| GET | /api/cities | List cities |

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/register | Register new user |
| POST | /auth/login | Login user |
| GET | /auth/profile | Get current user |

### User API (requires JWT Bearer token)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /user/api-keys | List user's API keys |
| POST | /user/api-keys | Generate new API key |
| DELETE | /user/api-keys/:id | Revoke API key |
| GET | /user/stats | Get user statistics |

### Admin API (requires JWT + admin role)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /admin/stats | Dashboard statistics |
| CRUD | /admin/coffeeshops | Manage coffee shops |
| CRUD | /admin/categories | Manage categories |
| CRUD | /admin/facilities | Manage facilities |
| GET | /admin/users | List users |
| GET | /admin/logs | View API logs |

## Technologies

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Auth**: JWT (jsonwebtoken)
- **Security**: bcryptjs, CORS, rate limiting
