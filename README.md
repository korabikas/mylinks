# MyLinks — Static Link-in-Bio

A lightweight, static clone of [AllMyLinks](https://allmylinks.com/) built with **Next.js 16**, **React 19**, **TypeScript**, and **Tailwind CSS v4**. Users and links are stored in a JSON file and profiles are pre-rendered at build time.

## Features

- Public profile pages at `/[username]`.
- No database, no authentication, no server-side APIs.
- Manage users and links by editing `data/users.json`.
- Custom username, bio, avatar, background color, and button styles per user.
- Responsive, mobile-first design matching the AllMyLinks look and feel.
- Deploys easily to Vercel or any static host.

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS + shadcn/ui

## Local Development

### 1. Clone & Install

```bash
cd mylinks
npm install
```

### 2. Add Users

Edit `data/users.json`:

```json
{
  "users": [
    {
      "username": "johndoe",
      "name": "John Doe",
      "bio": "All my links in one place.",
      "location": "New York",
      "avatar": "https://example.com/avatar.jpg",
      "backgroundType": "color",
      "backgroundValue": "#ffffff",
      "buttonColor": "#f4256f",
      "buttonTextColor": "#ffffff",
      "buttonStyle": "rounded",
      "links": [
        { "title": "Twitter", "url": "https://twitter.com/johndoe", "icon": "Twitter" },
        { "title": "Website", "url": "https://johndoe.com", "icon": "Globe" }
      ]
    }
  ]
}
```

### 3. Run Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "static mylinks"
git push
```

### 2. Create Vercel Project

Import the repository in the [Vercel dashboard](https://vercel.com/new).

No environment variables are required.

### 3. Update Users

After deployment, edit `data/users.json`, commit, and push. Vercel will rebuild the site automatically.

## Link Icons

Use any [Lucide](https://lucide.dev/icons/) icon name for the `icon` field. If no icon matches, the first letter of the title is used.

## Project Structure

```
app/
  [username]/page.tsx      # Public profile page
  page.tsx                 # Homepage listing all profiles
  layout.tsx               # Root layout
  globals.css              # Global styles
components/
  public/profile-view.tsx  # Public profile UI
  ui/                      # shadcn/ui components
data/
  users.json               # All users and links
lib/
  data.ts                  # Helper to read users.json
  utils.ts                 # Utility functions
```

## License

MIT
