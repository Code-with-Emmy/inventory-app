# How to Deploy to Vercel via GitHub

This guide will help you push your inventory app to GitHub and deploy it on Vercel.

## Prerequisite: GitHub Account

Ensure you have a [GitHub account](https://github.com/).

## Step 1: Commit Your Code

Your project already has Git initialized. You need to save your current changes.

1.  **Stage all files:**

    ```bash
    git add .
    ```

2.  **Commit changes:**
    ```bash
    git commit -m "Initial commit of stock inventory app"
    ```

## Step 1.5: Configure GitHub Account (If needed)

If this is a new computer or you want to use a specific GitHub account for this project:

1.  **Set your username and email for this project only:**

    ```bash
    git config user.name "YourGitHubName"
    git config user.email "your.email@example.com"
    ```

    _(Run these commands in the terminal inside your project folder)_

2.  **Authentication:**
    When you push code later, Git will ask for your credentials.
    - If using **HTTPS** (recommended for beginners), it will prompt for your GitHub username and password (or Personal Access Token).
    - To check if you are already logged in as a different user: `git config user.name`

## Step 2: Create a GitHub Repository

1.  Go to [github.com/new](https://github.com/new).
2.  Name your repository (e.g., `inventory-app`).
3.  Choose **Public** or **Private** (Private is recommended for internal tools).
4.  **Do not** check "Initialize with README" or .gitignore (you already have them).
5.  Click **Create repository**.

## Step 3: Push to GitHub

Copy the commands provided by GitHub under "…or push an existing repository from the command line". They will look like this:

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/inventory-app.git
git push -u origin main
```

_(Replace `YOUR_USERNAME` with your actual GitHub username)_

## Step 4: Deploy on Vercel

1.  Go to [vercel.com](https://vercel.com) and log in.
2.  Click **"Add New..."** -> **"Project"**.
3.  Select **"Import"** next to your `inventory-app` repository.
4.  **Configure Project:**
    - **Framework Preset:** Next.js (should be auto-detected).
    - **Root Directory:** `./` (default).
    - **Environment Variables:**
      - Open your local `.env` file.
      - Copy the keys and values (e.g., `DATABASE_URL`, `NEXTAUTH_SECRET`, etc.) into the Vercel Environment Variables section.
5.  Click **Deploy**.

## Database Note (Important)

If you are using a local SQLite database (`file:./dev.db`), **it will not work on Vercel** because Vercel file systems are read-only/ephemeral.

- **Solution**: You need a hosted PostgreSQL database (e.g., Vercel Postgres, Neon, or Supabase).
- **Update Connection**: Change `DATABASE_URL` in Vercel to point to your hosted database.
- **Run Migrations**: You might need to run `npx prisma db push` against the _remote_ database url from your local machine to set up the schema.
