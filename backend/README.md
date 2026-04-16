# Backend

StudentPath backend is built with Express, Prisma ORM, PostgreSQL, JWT auth, Google auth support, file uploads (Multer), and email sending (Nodemailer).

## Requirements

- Node.js 18+
- npm
- PostgreSQL running locally (or remote DB URL)

## Environment

Create local env from example:

```bash
cp .env.example .env
```

Required variables:

```env
PORT=5000
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME"
JWT_SECRET=your_jwt_secret_here
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password_here
GOOGLE_CLIENT_ID=your_google_client_id_here
NODE_ENV=development
```

## Install

```bash
npm install
```

## Prisma Setup

Generate Prisma client:

```bash
npx prisma generate
```

Apply migrations (if migrations exist):

```bash
npx prisma migrate dev
```

If no migrations are present and you want to sync schema directly:

```bash
npx prisma db push
```

## Run

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

Seed scripts:

```bash
npm run seed:institution
npm run seed:cities
```

## Folder Structure

- `src/server.js` - server bootstrap
- `src/app.js` - Express app setup
- `src/routes/` - API routes
- `src/controllers/` - request handlers
- `src/middlewares/` - middleware
- `src/config/` - DB/config utilities
- `prisma/` - Prisma schema and migrations
- `uploads/` - uploaded files

## Local URL

- Backend: `http://localhost:5000`

## Notes

- Frontend default API target is `http://localhost:5000/api`.
- For Gmail SMTP, use an App Password (not normal account password).
