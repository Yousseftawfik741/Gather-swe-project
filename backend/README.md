# Gather Backend

Backend REST API for the Gather project, built with Express, TypeScript, PostgreSQL, and Prisma ORM.

## Requirements

- Node.js 24.x
- npm
- PostgreSQL 17

## Installation

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

## Database Setup

1. Install and start PostgreSQL.
2. Create a local PostgreSQL database named `gather_dev`.
3. Copy `.env.example` to `.env`.
4. Update `DATABASE_URL` with your own PostgreSQL credentials.

Example:

```env
PORT=5000
CLIENT_URL=http://localhost:3000
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/gather_dev?schema=public"
```

**Important:** Never commit `.env` or share database credentials.

## Prisma Setup

Generate Prisma Client:

```bash
npx prisma generate
```

The Prisma schema is located at:

```text
prisma/schema.prisma
```

Prisma configuration is located at:

```text
prisma7.config.ts
```

The generated Prisma Client is placed in:

```text
src/generated/prisma/
```

## Running the Backend

Start the development server:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

Health check:

```text
GET http://localhost:5000/api/health
```

The server connects to PostgreSQL before starting Express and disconnects Prisma during graceful shutdown.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Compile TypeScript |
| `npm run start` | Start production build |
| `npm run typecheck` | Check TypeScript types |
| `npx prisma generate` | Generate Prisma Client |
| `npm audit` | Check dependency vulnerabilities |

## Database Schema Coordination

The Prisma schema and migrations are shared across the backend team.

Coordinate model changes and migrations with the relevant developers before applying database changes.

Do not independently introduce conflicting Event or Booking models or migrations.

Database migrations should only be created after the shared schema has been agreed upon.

## Security

- Never commit `.env` files.
- Never commit database passwords or credentials.
- Use `.env.example` as the shared configuration template.
- Keep generated Prisma Client and compiled output out of Git.
