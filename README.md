# MyLinks — AllMyLinks Clone

A secure, deployable clone of [AllMyLinks](https://allmylinks.com/) built for **mylinks.love** with **Next.js 16**, **Prisma**, **PostgreSQL**, and **NextAuth**. Every user gets a public profile page (`/[username]`) and an admin dashboard manages users, links, themes, and analytics.

> The demo profile `/exampleuser` is an example page you can customize, including the avatar, bio, location, and links.

## Features

- Public profile pages with custom username, bio, avatar, background, and button styles.
- Admin dashboard protected by role-based authentication.
- Create, edit, delete, and reorder user links with drag-and-drop.
- Click analytics per link.
- Responsive, mobile-first design matching the AllMyLinks look and feel.
- Secure by default: hashed passwords, CSRF-protected sessions, admin-only API routes, and proxy-level route protection.

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS + shadcn/ui
- Prisma ORM
- PostgreSQL (Neon recommended for Vercel)
- NextAuth.js v5 (Auth.js)
- bcryptjs

## Local Development

### 1. Clone & Install

```bash
cd mylinks
npm install
```

### 2. Set Up PostgreSQL

Create a local database:

```bash
psql postgres -c "CREATE DATABASE mylinks;"
```

### 3. Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mylinks?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-random-string-min-32-chars"
ADMIN_EMAIL="admin@mylinks.com"
ADMIN_PASSWORD="your-strong-admin-password"
```

> Generate a strong `NEXTAUTH_SECRET` with: `openssl rand -base64 32`

### 4. Database Migration & Seed

```bash
npx prisma migrate dev
npx tsx prisma/seed.ts
```

The seed script creates the admin user from `ADMIN_EMAIL` and `ADMIN_PASSWORD` plus a demo user at `/exampleuser`.

### 5. Run Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

- Admin login: [http://localhost:3000/admin](http://localhost:3000/admin)
- Demo profile: [http://localhost:3000/exampleuser](http://localhost:3000/exampleuser)

## Deploy to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "initial"
git push
```

### 2. Create Vercel Project

Import the repository in the [Vercel dashboard](https://vercel.com/new).

### 3. Add Environment Variables

In **Project Settings → Environment Variables**, add:

| Variable | Value |
|---|---|
| `DATABASE_URL` | Your Neon PostgreSQL connection string |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `https://your-domain.vercel.app` |
| `ADMIN_EMAIL` | Admin email address |
| `ADMIN_PASSWORD` | Strong admin password |

### 4. Neon Database

1. Create a free project at [neon.tech](https://neon.tech).
2. Copy the connection string (use the **Pooled** connection string for serverless).
3. Paste it as `DATABASE_URL`.

### 5. First Deploy

Vercel will run `npm run vercel-build`, which applies Prisma migrations and builds the app.

### 6. Seed the Admin

After the first deploy, run the seed script once via Vercel CLI or a one-off function:

```bash
npx vercel env pull
npx tsx prisma/seed.ts
```

Or run it locally pointing to the Neon database.

## Security Checklist

- [ ] Change `ADMIN_PASSWORD` to a strong, unique password.
- [ ] Use a long random `NEXTAUTH_SECRET`.
- [ ] Set `NEXTAUTH_URL` to your production domain.
- [ ] Use the pooled Neon connection string for Vercel.
- [ ] Keep `.env` and `.env.local` out of Git (already ignored).
- [ ] Only the admin role can access `/admin/dashboard` and `/api/admin/*`.

## Project Structure

```
app/
  [username]/page.tsx          # Public profile page
  login/page.tsx               # Login page (admins + users)
  admin/page.tsx               # Redirects to /login
  admin/dashboard/             # Admin dashboard pages
  dashboard/                   # User self-service dashboard
  api/admin/                   # Admin API routes
  api/auth/                    # NextAuth endpoint
  api/me/                      # Self-service user API
  api/me/links                 # Self-service link API
  api/upload                   # Image upload
  api/links/[id]/click         # Link click tracking
components/
  auth/login-form.tsx          # Shared login form
  public/profile-view.tsx      # Public profile UI
  admin/user-editor.tsx        # User + link management
lib/
  auth.ts                      # NextAuth config
  auth-guards.ts               # Shared auth guards
  prisma.ts                    # Prisma client
  admin-auth.ts                # Admin session helpers
prisma/
  schema.prisma                # Database schema
  seed.ts                      # Admin + demo seed
proxy.ts                       # Route protection
```

## License

MIT
