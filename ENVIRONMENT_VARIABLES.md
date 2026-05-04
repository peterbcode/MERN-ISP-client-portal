# Environment Variables

Use `.env.example` as the template for local development and Vercel.

## Required For Production

### `MONGODB_URI`

MongoDB connection string. Use MongoDB Atlas on Vercel.

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-host>/?retryWrites=true&w=majority
```

If the password contains special characters, URL-encode them.

### `MONGODB_DBNAME`

Database name used when the URI does not include one.

```env
MONGODB_DBNAME=mern-isp-portal
```

### `JWT_SECRET`

Secret used to sign and verify login tokens. Use a long random value in production.

```env
JWT_SECRET=<long-random-secret-at-least-32-characters>
```

### `JWT_EXPIRE`

Token lifetime.

```env
JWT_EXPIRE=7d
```

## Optional

### `DEBUG_API_ERRORS`

Keep this disabled in production.

```env
DEBUG_API_ERRORS=false
```

### `NEXT_PUBLIC_API_URL`

Leave unset on Vercel unless the frontend must call a separate external API. The app defaults to `/api` in production.

### `NEXT_PUBLIC_GA_ID`

Optional Google Analytics ID.

### `NEWSLETTER_WEBHOOK_URL`

Optional webhook for newsletter signup notifications. Signups are stored in MongoDB when `MONGODB_URI` is configured.

### Admin Controls

```env
ADMIN_IP_ALLOWLIST=
ADMIN_MUTATIONS_ENABLED=false
ADMIN_ROLE_CHANGES_ENABLED=false
```

## Local `.env.local`

Example:

```env
MONGODB_URI=mongodb://localhost:27017/mern-isp-portal
MONGODB_DBNAME=mern-isp-portal
JWT_SECRET=local-development-secret-change-me
JWT_EXPIRE=7d
DEBUG_API_ERRORS=true
NEWSLETTER_WEBHOOK_URL=
```

Never commit `.env.local`.
