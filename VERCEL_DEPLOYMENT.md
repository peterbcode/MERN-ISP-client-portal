# Vercel Deployment Guide

This project is ready to deploy as a Next.js app on Vercel. API routes live under `app/api/**/route.js` and run as Vercel serverless functions.

## GitHub Status

Deploy from:

```text
https://github.com/peterbcode/MERN-ISP-client-portal.git
```

Vercel should be connected to the `main` branch. Every push to `main` can trigger a new deployment.

## Vercel Project Settings

Use these settings:

```text
Framework Preset: Next.js
Install Command: npm ci
Build Command: npm run build
Output Directory: .next
Node.js: 20.x or newer
```

These are already reflected in `vercel.json` and `package.json`.

## Required Environment Variables

Set these in Vercel Dashboard -> Project -> Settings -> Environment Variables.

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-host>/?retryWrites=true&w=majority
MONGODB_DBNAME=mern-isp-portal
JWT_SECRET=<long-random-secret-at-least-32-characters>
JWT_EXPIRE=7d
DEBUG_API_ERRORS=false
```

Do not set `NEXT_PUBLIC_API_URL` on Vercel unless you intentionally use a separate external API. In production, the app uses its own `/api` routes.

## Optional Environment Variables

```env
NEXT_PUBLIC_GA_ID=
NEWSLETTER_WEBHOOK_URL=
ADMIN_IP_ALLOWLIST=
ADMIN_MUTATIONS_ENABLED=false
ADMIN_ROLE_CHANGES_ENABLED=false
```

`NEWSLETTER_WEBHOOK_URL` can point to a Make/Zapier/CRM/Slack-style webhook. Newsletter signups are also stored in MongoDB when `MONGODB_URI` is configured.

## MongoDB Atlas Setup

1. Create or open a MongoDB Atlas project.
2. Create a cluster.
3. Create a database user with a strong password.
4. In Network Access, allow Vercel to connect. For a simple first deployment, use `0.0.0.0/0`; tighten this later if you use a controlled networking setup.
5. Copy the Drivers connection string.
6. URL-encode special characters in the password, especially `@`, `:`, `/`, `?`, `#`, and `%`.
7. Add the resulting URI as `MONGODB_URI` in Vercel.

If your Atlas URI does not include a database path after the host, keep `MONGODB_DBNAME=mern-isp-portal`.

## Local Development

Create `.env.local` from the example:

```bash
copy .env.example .env.local
```

Then set local values:

```env
MONGODB_URI=mongodb://localhost:27017/mern-isp-portal
MONGODB_DBNAME=mern-isp-portal
JWT_SECRET=local-development-secret-change-me
JWT_EXPIRE=7d
DEBUG_API_ERRORS=true
```

Run locally:

```bash
npm ci
npm run dev
```

## Final Checks Before Deploy

Run:

```bash
npm run lint
npm run build
git status --short --branch
```

Expected:

- Lint exits successfully. Existing warnings are acceptable for now.
- Build exits successfully.
- Git branch is clean and synced with `origin/main`.

