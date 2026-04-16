# StudentPath

Full-stack app for student guidance (admissions, exams, colleges, cities). The repo is split into a **Next.js** frontend and an **Express + Prisma + PostgreSQL** backend.

## Project layout

| Folder     | Description                          |
| ---------- | ------------------------------------ |
| `frontend` | Next.js app (App Router), UI, admin  |
| `backend`  | REST API, auth, uploads, email       |

See also:

- [Frontend README](./frontend/README.md)
- [Backend README](./backend/README.md)

## Quick start

### Prerequisites

- Node.js 18+
- npm
- PostgreSQL (for backend)

### 1. Backend

```bash
cd backend
cp .env.example .env
# Edit .env: DATABASE_URL, JWT_SECRET, admin + Google vars
npm install
npx prisma generate
npx prisma migrate dev
# or: npx prisma db push
npm run dev
```

API default: `http://localhost:5000`

### 2. Frontend

```bash
cd frontend
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL and NEXT_PUBLIC_GOOGLE_CLIENT_ID
npm install
npm run dev
```

App default: `http://localhost:3000`

## Environment files

- **Do not commit** real `.env` or `.env.local` files.
- Use **`frontend/.env.example`** and **`backend/.env.example`** as templates.
- Root **`.gitignore`** ignores secrets but allows `.env.example`.

## Git

Initialize once at repo root (optional):

```bash
git init
git add .
git status
```

## Useful scripts

**Backend** (`backend/package.json`)

- `npm run dev` — development (nodemon)
- `npm start` — production
- `npm run seed:institution` / `npm run seed:cities` — seed data

**Frontend** (`frontend/package.json`)

- `npm run dev` — development
- `npm run build` / `npm run start` — production
- `npm run lint` — ESLint

## License

Specify your license in this file when you publish the project.
