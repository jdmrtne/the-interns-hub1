# The Interns Hub

A complete intern management platform — time clock, messaging, announcements, and admin tools.

Built as a Progressive Web App (PWA), deployable via GitHub Pages, powered by Supabase.

---

## Features

- **Time Clock** — AM/PM clock-in and clock-out with offline support and past log entry
- **Dashboard** — Weekly stats, attendance overview, leaderboard
- **Interns** — Browse all interns, view profiles
- **Messages** — Real-time direct messaging between interns and admins
- **Announcements** — Admin-posted pinboard with read receipts
- **Admin Panel** — Manage users, view all time logs, export reports, post announcements
- **PWA** — Installable on Android, iOS, and desktop; works offline

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vanilla HTML, CSS, JavaScript |
| Backend | [Supabase](https://supabase.com) (Postgres + Auth + Realtime) |
| Icons | Lucide Icons (inline SVG) |
| Hosting | GitHub Pages |
| PWA | Service Worker + Web App Manifest |

---

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/the-interns-hub1.git
cd the-interns-hub
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Supabase

Open `config.js` and update the credentials:

```js
const SUPABASE_URL = 'https://ntbqdkfxcnditgdxdipb.supabase.co';
const SUPABASE_KEY = 'your-anon-key-here';
```

### 4. Run locally

```bash
npm run dev
```

The app will open at `http://localhost:3000`.

### 5. Build for production

```bash
npm run build
```

Output is written to the `/dist` folder.

---

## Supabase Setup

### 1. Create a Supabase project

Go to [supabase.com](https://supabase.com) and create a new project.

### 2. Run the database schema

In the Supabase Dashboard → SQL Editor, run the contents of:

```
supabase/schema.sql
```

This creates all required tables, relationships, RLS policies, and triggers.

### 3. Tables created

| Table | Description |
|---|---|
| `users` | User profiles linked to Supabase Auth |
| `time_logs` | AM/PM clock-in/out records per user per day |
| `messages` | Direct messages between users (realtime) |
| `announcements` | Admin-posted announcements |

### 4. Enable Realtime

In Supabase Dashboard → Database → Replication → Tables, enable realtime for:
- `messages`

### 5. Create your first admin

After signing up, run this SQL to promote a user to admin:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

---

## GitHub Pages Deployment

### Automatic (recommended)

This project includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically builds and deploys on every push to `main`.

**Steps:**
1. Push the project to your GitHub repository
2. Go to **Settings → Pages**
3. Under **Source**, select **GitHub Actions**
4. Push a commit to `main` — deployment happens automatically
5. Your site will be live at `https://YOUR_USERNAME.github.io/the-interns-hub1/`

### Manual

```bash
npm run build
# Then upload /dist contents to gh-pages branch
```

---

## PWA Installation

**Android (Chrome):**
1. Open the site in Chrome
2. Tap the menu → "Add to Home screen"
3. The app installs as a native-looking app

**iOS (Safari):**
1. Open the site in Safari
2. Tap the Share button → "Add to Home Screen"
3. The app installs with full-screen mode

**Desktop:**
1. Open in Chrome/Edge
2. Look for the install icon in the address bar
3. Click Install

---

## Icon Sizes

| File | Size | Usage |
|---|---|---|
| `icon-72.png` | 72×72 | Android legacy |
| `icon-96.png` | 96×96 | Android standard |
| `icon-128.png` | 128×128 | Chrome Web Store |
| `icon-144.png` | 144×144 | Windows tiles |
| `icon-152.png` | 152×152 | iPad |
| `icon-192.png` | 192×192 | Android home screen |
| `icon-384.png` | 384×384 | Android splash |
| `icon-512.png` | 512×512 | PWA maskable |

---

## Icon Library

This project uses [Lucide Icons](https://lucide.dev) as inline SVG — no external dependency required.

| Icon | Usage |
|---|---|
| `clock` | Time Clock navigation, clock-in/out |
| `layout-dashboard` | Dashboard navigation |
| `users` | Interns navigation, user profiles |
| `mail` | Messages navigation |
| `megaphone` | Announcements/Board navigation |
| `settings` | Admin navigation |
| `log-out` | Logout button |
| `log-in` | Login page submit |

---

## Environment Variables

Copy `.env.example` to `.env` (for reference only — this is a static site):

```
VITE_SUPABASE_URL=https://ntbqdkfxcnditgdxdipb.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

> **Note:** Since this is a vanilla static HTML project, credentials live in `config.js`. For a production app with sensitive data, consider moving to a Vite/React build that reads from `.env` via `import.meta.env`.

---

## Project Structure

```
the-interns-hub/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions auto-deploy
├── supabase/
│   └── schema.sql              # Full database schema + RLS policies
├── index.html                  # Login page + Time Clock
├── dashboard.html              # Dashboard / overview
├── interns.html                # Intern directory
├── messages.html               # Direct messaging
├── announcements.html          # Announcement board
├── admin.html                  # Admin panel
├── chat.html                   # Chat view
├── config.js                   # Shared config: Supabase, nav, utilities
├── style.css                   # Shared base styles
├── sw.js                       # Service worker (PWA offline)
├── manifest.json               # Web App Manifest (PWA)
├── build.js                    # Build script → /dist
├── package.json
├── .env.example
├── favicon.ico
├── apple-touch-icon.png
├── icon-[size].png             # PWA icons (72–512px)
└── README.md
```

---

## License

MIT — use freely for your organization's intern management.
