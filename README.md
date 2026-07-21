# Task Management System

A full-stack Task Management Application built as part of a technical assessment.

## Project Structure

```
project/
├── backend/       # Node.js + Express.js + TypeScript API server
├── frontend/      # Next.js App Router + TypeScript + Tailwind CSS UI
├── database/      # PostgreSQL Schema and Seed SQL scripts
├── .gitignore     # Git ignore configuration
└── README.md      # Project documentation
```

## Technology Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express.js, TypeScript, PostgreSQL (`pg`), JWT, BcryptJS, Zod
- **Database**: PostgreSQL

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- PostgreSQL (v14+)

### 1. Database Setup

1. Create a PostgreSQL database (e.g., `task_db`):
   ```sql
   CREATE DATABASE task_db;
   ```
2. Execute the schema script:
   ```bash
   psql -U postgres -d task_db -f database/schema.sql
   ```
3. Seed default admin user and initial sample tasks:
   ```bash
   psql -U postgres -d task_db -f database/seed.sql
   ```

### 2. Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   The backend API will run on `http://localhost:5000`.

### 3. Frontend Setup

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment variables:
   ```bash
   cp .env.local.example .env.local
   ```
4. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   The frontend UI will run on `http://localhost:3000`.

---

## Default Credentials

- **Email**: `admin@test.com`
- **Password**: `123456`

---

## API Endpoints

- `POST /api/auth/login` - Authenticate user & return JWT token
- `GET /api/tasks` - List tasks (with title search, status/priority filter, sorting)
- `GET /api/tasks/:id` - Fetch single task details
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update existing task
- `DELETE /api/tasks/:id` - Delete task
