# Multi-Tenant Blog API

A backend API built with NestJS, PostgreSQL, and Prisma. Supports multi-tenant architecture where each tenant has isolated data for users and blog posts. Uses JWT authentication with role-based access.

## Tech Stack

- Node.js (NestJS)
- PostgreSQL (Docker Compose)
- Prisma ORM
- JWT Authentication

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/multi-tenant-api.git
cd multi-tenant-api
```

### 2. Set up environment variables

Create a .env file in the project root based on .env.example.

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/multitenantdb?schema=public
JWT_SECRET=your_jwt_secret_key
PORT=3000
```

### 3. Run Docker containers

```bash
docker-compose up -d
```

### 4. Install dependencies

```bash
npm install
```

### 5. Generate Prisma client

```bash
npx prisma generate
```

### 6. Run database migrations

```bash
npx prisma migrate dev
```

### 7. Seed the database

```bash
npx prisma db seed
```

### 7. Start the app

```bash
npm run start:dev

```

## API Documentation

### Swagger is available at:

```bash
http://localhost:3000/api

```

# Database Seed Instructions

This project uses Prisma's seeding feature to populate the database with initial data for development and testing.

## Running the Seed

After setting up your database and running migrations:

```bash
npx prisma db seed
```

## What the Seed Adds

### Two tenants:

- tenant1

- tenant2

### Three users for each tenant:

- admin@admin.com

- editor@admin.com

- viewer@admin.com

### All users have the same password:

- password

### To determine which tenant’s data you interact with.

- add tenant_id inside swagger popup value
