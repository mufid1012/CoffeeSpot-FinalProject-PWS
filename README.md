# ☕ CoffeeSpot API

**Open API for Coffee Shop Directory in Indonesia**

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-blue?logo=express)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.x-orange?logo=mysql)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-ISC-purple)](LICENSE)

CoffeeSpot API adalah sebuah RESTful API yang menyediakan data direktori coffee shop di Indonesia. API ini dirancang untuk memudahkan developer dalam mengintegrasikan data coffee shop ke dalam aplikasi mereka.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [API Endpoints](#-api-endpoints)
- [Authentication](#-authentication)
- [Database Schema](#-database-schema)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🔐 User Authentication
- User registration dan login dengan JWT
- Role-based access control (User & Admin)
- Secure password hashing dengan bcrypt

### 🔑 API Key Management
- Generate dan manage API keys
- Rate limiting per API key (100 requests/day default)
- Usage tracking dan analytics

### ☕ Coffee Shop Data
- Comprehensive coffee shop directory
- Filter berdasarkan kota, kategori, dan fasilitas
- Search functionality
- Pagination support

### 📊 Admin Dashboard
- User management
- Coffee shop CRUD operations
- Category & facility management
- API usage logs monitoring

### 👤 User Dashboard
- Personal API key management
- Usage statistics
- Activity logs

---

## 🛠 Tech Stack

### Backend
| Technology | Version | Description |
|------------|---------|-------------|
| Node.js | 18.x+ | JavaScript runtime |
| Express.js | 4.18.x | Web framework |
| MySQL | 8.x | Database |
| JWT | 9.x | Authentication |
| bcryptjs | 2.4.x | Password hashing |

### Frontend
| Technology | Description |
|------------|-------------|
| HTML5 | Markup |
| CSS3 | Styling (Custom design system) |
| Vanilla JavaScript | Client-side logic |

### Dependencies
```json
{
  "bcryptjs": "^2.4.3",
  "cookie-parser": "^1.4.6",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "express": "^4.18.2",
  "express-rate-limit": "^7.1.5",
  "jsonwebtoken": "^9.0.2",
  "mysql2": "^3.6.5",
  "uuid": "^9.0.1"
}
```

---

## 📁 Project Structure

```
openapi-web/
├── backend/
│   ├── config/
│   │   └── database.js         # Database connection configuration
│   ├── database/
│   │   ├── schema.sql          # Database schema
│   │   ├── seed.sql            # Sample data seeding
│   │   └── setup.js            # Database setup script
│   ├── middleware/
│   │   ├── apiKeyMiddleware.js # API key validation
│   │   ├── authMiddleware.js   # JWT authentication
│   │   └── logMiddleware.js    # Request logging
│   ├── routes/
│   │   ├── admin.js            # Admin endpoints
│   │   ├── auth.js             # Authentication endpoints
│   │   ├── publicApi.js        # Public API endpoints
│   │   └── user.js             # User dashboard endpoints
│   ├── .env.example            # Environment variables template
│   ├── app.js                  # Express app configuration
│   ├── package.json            # Backend dependencies
│   └── server.js               # Server entry point
│
├── frontend/
│   ├── admin/                  # Admin dashboard pages
│   │   ├── dashboard.html
│   │   ├── users.html
│   │   ├── coffeeshops.html
│   │   ├── coffeeshop-form.html
│   │   ├── categories.html
│   │   ├── facilities.html
│   │   └── logs.html
│   ├── auth/                   # Authentication pages
│   │   ├── login.html
│   │   └── register.html
│   ├── css/
│   │   └── style.css           # Main stylesheet
│   ├── docs/                   # API documentation
│   │   └── index.html
│   ├── js/
│   │   ├── api.js              # API client utilities
│   │   └── auth.js             # Authentication utilities
│   ├── user/                   # User dashboard pages
│   │   ├── dashboard.html
│   │   ├── api-keys.html
│   │   └── activity.html
│   ├── index.html              # Landing page
│   ├── contact.html            # Contact page
│   ├── privacy.html            # Privacy policy
│   └── terms.html              # Terms of service
│
└── README.md                   # This file
```

---

## 📋 Prerequisites

Pastikan sistem Anda sudah terinstall:

- **Node.js** v18.x atau lebih tinggi
- **npm** v9.x atau lebih tinggi
- **MySQL** v8.x atau lebih tinggi
- **Git** (optional, untuk cloning)

---

## 🚀 Installation

### 1. Clone Repository

```bash
git clone https://github.com/mufid1012/CoffeeSpot-FinalProject-PWS.git
cd coffeespot-api
```

### 2. Install Dependencies

```bash
cd backend
npm install
```

### 3. Setup Database

Buat database MySQL dan jalankan schema:

```bash
# Login ke MySQL
mysql -u root -p

# Jalankan schema.sql
source database/schema.sql

# Jalankan seed.sql untuk data sample
source database/seed.sql
```

Atau gunakan script setup:

```bash
npm run db:setup
```

### 4. Configure Environment

Copy file `.env.example` menjadi `.env` dan sesuaikan konfigurasi:

```bash
cp .env.example .env
```

---

## ⚙️ Configuration

Edit file `.env` dengan konfigurasi Anda:

```env
# Environment
NODE_ENV=development
PORT=3000

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=coffeespot_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# API Configuration
API_RATE_LIMIT=100
API_RATE_WINDOW_MS=86400000
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3000` |
| `DB_HOST` | MySQL host | `localhost` |
| `DB_PORT` | MySQL port | `3306` |
| `DB_USER` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | - |
| `DB_NAME` | Database name | `coffeespot_db` |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` |
| `API_RATE_LIMIT` | Max requests per day | `100` |
| `API_RATE_WINDOW_MS` | Rate limit window (ms) | `86400000` |

---

## ▶️ Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

Server akan berjalan di `http://localhost:3000`

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Run production server |
| `npm run dev` | Run development server with nodemon |
| `npm run db:setup` | Setup database tables |

---

## 📡 API Endpoints

### Public API (Requires API Key)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/coffeeshops` | Get list of coffee shops |
| `GET` | `/api/coffeeshops/:id` | Get coffee shop by ID |
| `GET` | `/api/categories` | Get all categories |
| `GET` | `/api/facilities` | Get all facilities |
| `GET` | `/api/cities` | Get cities with coffee shop count |

### Query Parameters untuk `/api/coffeeshops`

| Parameter | Type | Description |
|-----------|------|-------------|
| `city` | string | Filter by city name |
| `category_id` | integer | Filter by category ID |
| `facility_id` | integer | Filter by facility ID |
| `search` | string | Search by name or address |
| `page` | integer | Page number (default: 1) |
| `limit` | integer | Items per page (default: 10, max: 50) |

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register` | Register new user |
| `POST` | `/auth/login` | User login |
| `POST` | `/auth/logout` | User logout |
| `GET` | `/auth/me` | Get current user info |

### User Endpoints (Requires Auth)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/user/dashboard` | Get user dashboard data |
| `GET` | `/user/api-keys` | Get user's API keys |
| `POST` | `/user/api-keys` | Generate new API key |
| `DELETE` | `/user/api-keys/:id` | Revoke API key |
| `GET` | `/user/activity` | Get user activity logs |

### Admin Endpoints (Requires Admin Auth)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/admin/dashboard` | Get admin dashboard stats |
| `GET` | `/admin/users` | Get all users |
| `DELETE` | `/admin/users/:id` | Delete user |
| `GET` | `/admin/coffeeshops` | Get all coffee shops |
| `POST` | `/admin/coffeeshops` | Create coffee shop |
| `PUT` | `/admin/coffeeshops/:id` | Update coffee shop |
| `DELETE` | `/admin/coffeeshops/:id` | Delete coffee shop |
| `GET` | `/admin/categories` | Get all categories |
| `POST` | `/admin/categories` | Create category |
| `PUT` | `/admin/categories/:id` | Update category |
| `DELETE` | `/admin/categories/:id` | Delete category |
| `GET` | `/admin/facilities` | Get all facilities |
| `POST` | `/admin/facilities` | Create facility |
| `PUT` | `/admin/facilities/:id` | Update facility |
| `DELETE` | `/admin/facilities/:id` | Delete facility |
| `GET` | `/admin/logs` | Get API usage logs |

---

## 🔐 Authentication

### Register User

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Using API Key

Setelah generate API key dari dashboard, gunakan header `x-api-key`:

```bash
curl -X GET "http://localhost:3000/api/coffeeshops" \
  -H "x-api-key: YOUR_API_KEY"
```

### Response Example

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Kopi Kenangan",
      "description": "Modern coffee chain...",
      "address": "Jl. Sudirman No. 123",
      "city": "Jakarta",
      "rating": 4.5,
      "category": {
        "id": 1,
        "name": "Coffee Chain"
      },
      "facilities": [
        { "id": 1, "name": "WiFi", "icon": "📶" },
        { "id": 2, "name": "AC", "icon": "❄️" }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "total_pages": 5
  }
}
```

---

## 🗄️ Database Schema

```
┌──────────────────┐     ┌──────────────────┐
│      users       │     │     api_keys     │
├──────────────────┤     ├──────────────────┤
│ id               │────<│ user_id          │
│ username         │     │ api_key          │
│ email            │     │ name             │
│ password         │     │ status           │
│ role             │     │ usage_limit      │
│ created_at       │     │ daily_usage      │
└──────────────────┘     └──────────────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │    api_logs      │
                         ├──────────────────┤
                         │ api_key_id       │
                         │ endpoint         │
                         │ method           │
                         │ status_code      │
                         └──────────────────┘

┌──────────────────┐     ┌──────────────────┐
│   categories     │     │   coffeeshops    │
├──────────────────┤     ├──────────────────┤
│ id               │────<│ category_id      │
│ name             │     │ name             │
│ description      │     │ description      │
└──────────────────┘     │ address          │
                         │ city             │
                         │ latitude         │
┌──────────────────┐     │ longitude        │
│   facilities     │     │ rating           │
├──────────────────┤     └────────┬─────────┘
│ id               │              │
│ name             │              │
│ icon             │     ┌────────┴─────────┐
└────────┬─────────┘     │coffeeshop_       │
         │               │facilities        │
         └──────────────>├──────────────────┤
                         │ coffeeshop_id    │
                         │ facility_id      │
                         └──────────────────┘
```

---

## 📸 Screenshots

### Landing Page
Halaman utama dengan informasi tentang API dan cara memulai.
<img width="1694" height="978" alt="image" src="https://github.com/user-attachments/assets/aa8767d6-4922-4ed2-92d3-0b7e4d187da4" />

### User Dashboard
Dashboard untuk mengelola API keys dan melihat statistik penggunaan.
<img width="1694" height="1013" alt="image" src="https://github.com/user-attachments/assets/09ded425-4916-4fae-a403-079fc44550cb" />

### Admin Dashboard
Dashboard admin untuk mengelola coffee shops, users, dan melihat logs.
<img width="1695" height="1016" alt="image" src="https://github.com/user-attachments/assets/4e511ee3-b5f6-445a-bbd4-91ecff13805c" />

---

## 🤝 Contributing

Kontribusi sangat diterima! Silakan ikuti langkah berikut:

1. Fork repository ini
2. Buat branch fitur baru (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan Anda (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buka Pull Request

---

## 📄 License

Distributed under the ISC License. See `LICENSE` for more information.

---

## 📞 Contact

Untuk pertanyaan dan dukungan, silakan hubungi melalui:
- Email: mufidghibran1012@gmail.com

---

<p align="center">
  Made with ☕ by CoffeeSpot Team
</p>
