# Frontend

StudentPath frontend is built with Next.js (App Router), React, Tailwind CSS, and reusable UI components.

## Requirements

- Node.js 18+
- npm

## Environment

Create local env from example:

```bash
cp .env.example .env.local
```

Required variables:

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Install

```bash
npm install
```

## Run

Development:

```bash
npm run dev
```

Build + start:

```bash
npm run build
npm run start
```

Lint:

```bash
npm run lint
```

## Folder Structure

- `app/` - route pages and layouts
- `components/` - shared UI and feature components
- `lib/` - utilities and API helpers
- `public/` - static files

## Local URLs

- Frontend: `http://localhost:3000`
- Backend API (default target): `http://localhost:5000/api`

## Notes

- Keep backend running before testing data-driven pages.
- Google login requires a valid client ID in frontend and backend env files.
