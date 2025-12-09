# Deployment Guide for Vercel

## Database Setup

This application requires a PostgreSQL database for production. SQLite (used locally) doesn't work on Vercel.

### Option 1: Vercel Postgres (Recommended - Easiest)

1. In your Vercel project dashboard, go to **Storage** tab
2. Click **Create Database** → Select **Postgres**
3. Choose a name and region
4. Click **Create**
5. Vercel will automatically add the `DATABASE_URL` environment variable

### Option 2: Supabase (Free PostgreSQL)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to **Settings** → **Database**
4. Copy the **Connection string** (URI format)
5. In Vercel: **Settings** → **Environment Variables**
6. Add `DATABASE_URL` with the connection string

### Option 3: Neon (Free PostgreSQL)

1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project
3. Copy the connection string
4. In Vercel: **Settings** → **Environment Variables**
5. Add `DATABASE_URL` with the connection string

## Environment Variables in Vercel

Add these in **Vercel Dashboard** → **Your Project** → **Settings** → **Environment Variables**:

1. **DATABASE_URL** - Your PostgreSQL connection string (required)
2. **TWILIO_ACCOUNT_SID** - (Optional) For SMS notifications
3. **TWILIO_AUTH_TOKEN** - (Optional) For SMS notifications
4. **TWILIO_PHONE_NUMBER** - (Optional) Your Twilio phone number
5. **ADMIN_PHONE_NUMBER** - (Optional) Your phone number to receive notifications

## After Setting Up Database

1. Push your code to GitHub (already done)
2. In Vercel, go to your project
3. Go to **Settings** → **Environment Variables**
4. Add `DATABASE_URL` with your PostgreSQL connection string
5. Redeploy your project
6. After deployment, run database migrations:
   - Go to Vercel project → **Deployments** → Click on the latest deployment → **View Function Logs**
   - Or use Vercel CLI: `vercel env pull` then `npx prisma db push`

## Database Migrations

After setting up the database, you need to create the tables:

**Option 1: Using Vercel CLI**
```bash
npx vercel env pull
npx prisma db push
```

**Option 2: Using Prisma Studio (if you have database access)**
- The tables will be created automatically on first use, or you can run migrations manually

## Troubleshooting

- **Build fails**: Make sure `DATABASE_URL` is set in Vercel environment variables
- **Database connection error**: Verify your PostgreSQL connection string is correct
- **Tables not found**: Run `npx prisma db push` to create tables

