# Full-Stack Monorepo: Laravel 13 + Next.js 16 + MySQL 9.7 (Dockerized)

A complete, modern full-stack web application monorepo featuring a containerized **Laravel 13 REST API** backend running on **PHP 8.4**, a **Next.js 16.3** frontend running on **Node 26**, and a **MySQL 9.7** database orchestrated seamlessly using Docker Compose.

---

## 🚀 Tech Stack Overview

| Service | Framework / Technology | Version | Base Container Image | Port |
| :--- | :--- | :--- | :--- | :--- |
| **Backend REST API** | Laravel 13 | PHP `8.4` | `php:8.4-cli-alpine` | `8000` |
| **Frontend Web App** | Next.js 16.3 (App Router) | Node `26` | `node:26-alpine` | `3000` |
| **Database** | MySQL | `9.7` stream (`9.0`) | `mysql:9.0` | `3306` |
| **Orchestration** | Docker Compose | `3.8+` | — | — |

---

## 📁 Repository Structure

```
.
├── docker-compose.yml             # Docker Compose stack definition
├── .env.example                   # Environment configuration template
├── README.md                      # Documentation & instructions
│
├── backend/                       # Laravel 13 REST API Application
│   ├── Dockerfile                 # PHP 8.4 container configuration
│   ├── docker-entrypoint.sh       # DB wait, migrations & auto-seeding
│   ├── composer.json              # Laravel 13 dependencies (PHP 8.4)
│   ├── app/
│   │   ├── Http/Controllers/Api/V1/
│   │   │   ├── HealthController.php # System & DB diagnostics API
│   │   │   └── ItemController.php   # RESTful CRUD operations
│   │   └── Models/
│   │       └── Item.php           # Eloquent Model
│   ├── database/
│   │   ├── migrations/            # Table schemas
│   │   └── seeders/               # Sample data seeders
│   └── routes/
│       └── api.php                # REST API routes (/api/v1/*)
│
└── frontend/                      # Next.js 16.3 Frontend Application
    ├── Dockerfile                 # Node 26 container configuration
    ├── package.json               # Next.js 16.3 & React 19 dependencies
    ├── next.config.mjs            # Next.js configuration & API proxies
    ├── tsconfig.json              # TypeScript configuration
    └── src/
        └── app/
            ├── layout.tsx         # Root layout with dark theme
            ├── page.tsx           # Interactive Dashboard & REST CRUD UI
            └── globals.css        # Modern glassmorphism design system
```

---

## ⚡ Quick Start with Docker

### Prerequisites

Ensure you have installed:
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (includes `docker compose`)

### 1. Clone & Setup Environment

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

### 2. Build & Launch Docker Stack

Run the following command to build all image layers and start the containers in the background:

```bash
docker compose up -d --build
```

### 3. Verify Container Status

Check that all three containers (`app_mysql_db`, `app_laravel_backend`, `app_nextjs_frontend`) are running and healthy:

```bash
docker compose ps
```

---

## 🌐 Accessing Services

- **Next.js 16.3 Frontend Dashboard**: [http://localhost:3000](http://localhost:3000)
- **Laravel 13 REST API Base**: [http://localhost:8000/api/v1/health](http://localhost:8000/api/v1/health)
- **MySQL 9.7 Database**: `localhost:3306` (User: `app_user`, DB: `app_db`)

---

## 📡 REST API Endpoints

### System & Database Diagnostics

`GET /api/v1/health`

**Example Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-09-03T14:25:00Z",
  "environment": "local",
  "runtime": {
    "framework": "Laravel 13",
    "php_version": "8.4.1",
    "sapi": "cli-server"
  },
  "database": {
    "status": "connected",
    "driver": "mysql",
    "version": "9.0.1",
    "target": "MySQL 9.7"
  }
}
```

### Resource Management (`/api/v1/items`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/items` | List items (supports `?search=` and `?status=`) |
| `POST` | `/api/v1/items` | Create a new item |
| `GET` | `/api/v1/items/{id}` | Get item details by ID |
| `PUT` | `/api/v1/items/{id}` | Update item by ID |
| `DELETE` | `/api/v1/items/{id}` | Delete item by ID |

---

## 🛠️ Handy CLI Commands

### Run Laravel Artisan Commands in Container

```bash
docker compose exec backend php artisan migrate:status
docker compose exec backend php artisan route:list
```

### View Real-Time Container Logs

```bash
docker compose logs -f
```

### Stop Services

```bash
docker compose down
```

To remove persistent volumes as well:
```bash
docker compose down -v
```

---

## 📄 License

This repository is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
