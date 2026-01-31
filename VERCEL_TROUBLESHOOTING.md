# Vercel Deployment Troubleshooting

## Current Issue: Build Failures

Your deployments are failing. Here's how to fix them:

## Step 1: Check Build Logs in Vercel

1. Go to https://vercel.com/dashboard
2. Click on your `inventory-app` project
3. Click on the **failed deployment** (the one with the red X)
4. Look at the **"Build Logs"** section
5. **Copy the error message** - this will tell us exactly what's wrong

## Step 2: Verify Environment Variables

Go to your Vercel project → **Settings** → **Environment Variables**

Make sure ALL of these are set for **Production**, **Preview**, AND **Development**:

```
DATABASE_URL=postgresql://postgres.odyaqnrkyuqnejekddoe:ZTCgTDyxFuYYCeZu@aws-1-eu-central-1.pooler.supabase.com:5432/postgres

DIRECT_URL=postgresql://postgres.odyaqnrkyuqnejekddoe:ZTCgTDyxFuYYCeZu@aws-1-eu-central-1.pooler.supabase.com:5432/postgres

JWT_SECRET=super-secret-key

NEXTAUTH_URL=https://YOUR-VERCEL-URL.vercel.app
```

**Important:** Replace `YOUR-VERCEL-URL` with your actual Vercel deployment URL (e.g., `inventory-app-xyz.vercel.app`)

## Step 3: Common Build Errors & Solutions

### Error: "Cannot find module '@prisma/client'"
**Solution:** Already fixed with `postinstall` script. Redeploy.

### Error: "Environment variable not found: DATABASE_URL"
**Solution:** Add the environment variables in Vercel Settings (see Step 2)

### Error: "Prisma schema validation failed"
**Solution:** Make sure `DIRECT_URL` is set in environment variables

### Error: "Module not found" or "Cannot resolve"
**Solution:** Run locally: `npm install` then push again

### Error: "Build exceeded maximum duration"
**Solution:** Your build is taking too long. This is rare but can happen with large projects.

## Step 4: Force Redeploy

After adding environment variables:

1. Go to **Deployments** tab in Vercel
2. Click the **three dots (...)** on the latest deployment
3. Click **"Redeploy"**
4. Check "Use existing Build Cache" is **unchecked**
5. Click **"Redeploy"**

## Step 5: Test Locally First

Before deploying, always test the production build locally:

```bash
npm run build
npm start
```

If this works locally, the issue is with Vercel configuration.

## Step 6: Check Vercel Project Settings

Go to **Settings** → **General**:

- **Framework Preset:** Should be "Next.js"
- **Root Directory:** Should be `./`
- **Build Command:** Should be `npm run build` (default)
- **Output Directory:** Should be `.next` (default)
- **Install Command:** Should be `npm install` (default)

## Need More Help?

**Share the build logs with me:**
1. Copy the error from Vercel's build logs
2. Paste it here so I can help you fix the specific issue

**Or check Vercel's function logs:**
- If the build succeeds but you get runtime errors
- Go to your deployment → **Functions** tab
- Look for error messages
