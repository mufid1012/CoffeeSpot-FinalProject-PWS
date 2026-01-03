Tentu, ini adalah pembaruan yang sangat penting. Dengan adanya **Admin Dashboard**, sistem kamu menjadi lengkap (Full-stack dengan 3 sisi: Public API, User Portal, dan Admin Panel).

Berikut adalah **Project Brief Lengkap** dan **Update Konteks AI** yang sudah menyertakan fitur Admin.

---

# 📄 PROJECT BRIEF: CoffeeSpot API

**Judul Project:** CoffeeSpot API – Open API for Coffee Shop Directory

**Jenis Project:** Backend Web Service & Open API Platform

**Target Pengguna:** Developer (API User) & Administrator (Internal)

## 1. Deskripsi Project

CoffeeSpot API adalah platform yang menyediakan direktori coffee shop di Indonesia melalui layanan Open API. Project ini bertujuan untuk memudahkan pengembang aplikasi pihak ketiga dalam mendapatkan data coffee shop yang akurat, serta menyediakan dashboard manajemen untuk pengguna dan administrator.

## 2. Fitur Utama (Scope)

### A. Public Open API

* **Data Access:** Menyediakan data coffee shop, kategori, kota, dan fasilitas.
* **Security:** Menggunakan API Key (`x-api-key`) di header.
* **Rate Limiting:** Pembatasan 100 request/hari per user.
* **Search & Filter:** Berdasarkan kota, fasilitas, atau nama.

### B. Dashboard User (Portal Developer)

* **Auth:** Register & Login.
* **API Key Management:** Generate, copy, dan revoke API Key.
* **Usage Stats:** Grafik sederhana jumlah penggunaan API milik user tersebut.
* **Dokumentasi:** Panduan integrasi dan contoh endpoint.

### C. Dashboard Admin (Back-Office)

* **Data Management (CRUD):** * Kelola Data Coffee Shop (Tambah, edit, hapus).
* Kelola Master Data (Kategori & Fasilitas).


* **User Management:** Melihat daftar user terdaftar dan status API Key mereka.
* **Monitoring API:** Melihat log aktivitas seluruh API (siapa yang mengakses, jam berapa, dan endpoint apa).
* **Global Statistics:** Total request API hari ini, total user, dan coffee shop paling populer.

## 3. Struktur Data (Database Schema)

* `users`: ID, username, email, password, role (admin/user).
* `api_keys`: ID, user_id, key, status, usage_limit.
* `coffeeshops`: ID, name, address, city, open_time, close_time, category_id, rating.
* `facilities`: ID, name.
* `coffeeshop_facilities`: Junction table (Many-to-Many).
* `categories`: ID, name.
* `api_logs`: ID, api_key_id, endpoint, method, status_code, ip_address.

## 4. Teknologi Stack

* **Backend:** Node.js, Express.js.
* **Database:** MySQL.
* **Frontend Dashboard:** HTML, Bootstrap 5, EJS/Pug (Template Engine).
* **Dokumentasi:** Swagger UI (OpenAPI Spec).

---

## 🚀 Prompt Context untuk AI (Optimized for Antigravity)

Copy teks ini untuk instruksi ke AI agar langsung mengeksekusi project:

> **Role:** Senior Fullstack Developer
> **Project:** CoffeeSpot API (Open API Platform)
> ### **Project Requirements:**
> 
> 
> 1. **Core API:** Build a REST API with API Key authentication (`x-api-key`). Implement rate limiting (100 req/day).
> 2. **User Dashboard:** A web interface for developers to register, login, and manage their API Keys.
> 3. **Admin Dashboard:** A restricted area for administrators to:
> * Perform CRUD on `CoffeeShops`, `Categories`, and `Facilities`.
> * Manage Users and monitor their API Key usage.
> * View global API usage logs and statistics.
> 
> 
> 4. **Security:** Use JWT for session management on the dashboards. Admin routes must be protected by an `isAdmin` middleware.
> 
> 
> ### **Database Design:**
> 
> 
> * Tables: `users`, `api_keys`, `coffeeshops`, `facilities`, `coffeeshop_facilities`, `categories`, `api_logs`.
> 
> 
> ### **Immediate Task:**
> 
> 
> 1. **ERD & SQL:** Generate the DDL SQL for all tables including the `role` column in the `users` table.
> 2. **Folder Structure:** Propose a professional Node.js structure that separates `/api` routes from `/admin` and `/user` dashboard routes.
> 3. **Admin Logic:** Create a sample controller for `AdminCoffeeShopController` (CRUD) and `AdminStatsController`.
> 4. **Middleware:** Create `authMiddleware.js` for JWT and `apiKeyMiddleware.js` for Open API validation.
> 
> 

---

### Tips untuk Kamu:

1. **Pemisahan Role:** Saat membuat tabel `users`, pastikan default role adalah `user`. Kamu bisa membuat satu user admin secara manual di database untuk login pertama kali.
2. **Middleware:** Di Express, kamu akan punya dua jenis proteksi:
* Satu untuk **API** (ngecek `x-api-key`).
* Satu untuk **Dashboard** (ngecek `JWT` atau `Session`).


3. **Tampilan:** Gunakan template Bootstrap admin yang sudah jadi (seperti *SB Admin 2* atau *AdminLTE*) agar kamu tidak pusing mendesain CSS dari nol.

Apakah ada bagian spesifik dari **Dashboard Admin** (misalnya grafik atau fitur tertentu) yang ingin kamu detailkan lagi?