# Vercel Deployment Checklist — Big Brain Moves

**Status:** Ready to deploy. Follow these steps in order.

---

## ✅ Step 1: Get Your Secrets

Generate these **before** deployment:

### JWT_SECRET (32+ random characters)
```bash
openssl rand -base64 32
# Example output: FhXc7pQ2wL9mNz3JyRkVxQ7bS+T4uP8vWqL1mJ5nK=
```

### CRON_SECRET (32+ random characters)
```bash
openssl rand -base64 32
# Same format as JWT_SECRET
```

### GEMINI_API_KEY
1. Go to https://ai.google.dev
2. Sign in with Google account
3. Click "Get API Key"
4. Create new API key
5. Copy the key

### RESEND_API_KEY
1. Go to https://resend.com
2. Sign up (free)
3. Go to **API Keys** section
4. Create new key
5. Copy the key

### DATABASE_URL (PostgreSQL)
**Option A: Vercel Postgres (Recommended)**
1. In Vercel Dashboard: **Storage → Create Database → Postgres**
2. Name it `bbm` (or similar)
3. Copy connection string (labeled `POSTGRES_URL_NONPOOLING`)

**Option B: External PostgreSQL**
- Use AWS RDS, Railway, Neon, or similar
- Format: `postgresql://user:password@host:port/dbname`

---

## ✅ Step 2: Initialize Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel (opens browser)
vercel login

# You'll see:
# ✔ Email confirmed
# ✔ Logged in
```

---

## ✅ Step 3: Link Project to Vercel

```bash
# From /bbm-app directory
cd /home/bbm/.openclaw/workspace/bbm-app

# Link project (creates .vercel folder)
vercel link

# Choose:
# "Set up and deploy" → YES
# "Which scope should contain your new Project?" → Your account
# "Link to existing project?" → NO
# "What's your project's name?" → big-brain-moves
# "In which directory is your code?" → ./
# "Want to modify vercel.json?" → NO
```

---

## ✅ Step 4: Add Environment Variables

In Vercel Dashboard:
1. Go to https://vercel.com/dashboard
2. Click your **big-brain-moves** project
3. Go to **Settings → Environment Variables**
4. Add these 5 variables:

| Key | Value | Notes |
|-----|-------|-------|
| `DATABASE_URL` | `postgresql://...` | From Vercel Postgres or your DB |
| `JWT_SECRET` | Your random string | From Step 1 |
| `CRON_SECRET` | Your random string | From Step 1 |
| `GEMINI_API_KEY` | Your Google API key | From Step 1 |
| `RESEND_API_KEY` | Your Resend key | From Step 1 |

**Add each, then click "Save".**

---

## ✅ Step 5: Deploy

```bash
# From bbm-app directory
vercel deploy --prod

# You'll see:
# ✔ Deployed to https://big-brain-moves.vercel.app

# Copy the URL
```

---

## ✅ Step 6: Run Database Migrations

After deployment, set up your database:

```bash
# Pull your env vars from Vercel
vercel env pull

# Run Prisma migrations
npx prisma migrate deploy

# Or if this is first time:
npx prisma db push
```

---

## ✅ Step 7: Test Endpoints

Replace `https://big-brain-moves.vercel.app` with your actual URL:

### Test Signup
```bash
curl -X POST https://big-brain-moves.vercel.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"Test1234!",
    "name":"Test User"
  }'

# Expected response:
# {"message":"User created successfully","token":"...","user":{...}}
```

### Test PDF Generation
```bash
curl -X POST https://big-brain-moves.vercel.app/api/generate-pdf \
  -H "Content-Type: application/json" \
  -d '{
    "topics":["Dieting","Date Ideas","Time Management"],
    "newsletter":{
      "title":"Big Brain Moves Daily Newsletter",
      "date":"March 9, 2026",
      "sections":{...}
    }
  }' \
  --output newsletter.pdf

# Check if PDF generated
file newsletter.pdf
```

### Test Email Send
```bash
curl -X POST https://big-brain-moves.vercel.app/api/newsletter/send \
  -H "Content-Type: application/json" \
  -d '{
    "email":"your-email@example.com",
    "name":"Your Name",
    "topics":["Dieting","Date Ideas"]
  }'

# Check your email inbox
```

---

## ✅ Step 8: Verify Cron Job

In Vercel Dashboard:
1. Go to **Settings → Crons**
2. You should see:
   ```
   /api/cron/daily-newsletter
   Schedule: 0 8 * * * (Daily at 8 AM UTC)
   ```

3. Click **Test** to trigger manually
4. Check **Executions** tab for logs

---

## ✅ Step 9: Add Custom Domain (Optional)

1. In Vercel Dashboard: **Settings → Domains**
2. Add your domain (e.g., `bigbrainmoves.com`)
3. Follow DNS instructions (CNAME or A records)
4. Wait ~5 minutes for DNS to propagate

---

## 🚨 Troubleshooting

### Deployment Failed
```bash
# Check logs
vercel logs https://big-brain-moves.vercel.app

# Rebuild
vercel deploy --prod
```

### Database Connection Error
```bash
# Verify DATABASE_URL is set
vercel env pull
cat .env.local | grep DATABASE_URL

# If missing, add it manually in Vercel Dashboard
```

### Email Not Sending
1. Verify `RESEND_API_KEY` is correct
2. Check Resend dashboard for errors
3. Confirm sender domain authorized in Resend

### Cron Not Running
1. Check that `CRON_SECRET` is set in Vercel env
2. View Cron Executions in Vercel Dashboard
3. Check Function Logs for errors

---

## ✅ You're Live!

Your app is now running on Vercel:
- **Frontend:** https://big-brain-moves.vercel.app
- **API:** https://big-brain-moves.vercel.app/api/*
- **Daily Cron:** Runs at 8 AM UTC daily

**Next steps:**
1. Create a few test users
2. Verify emails arrive
3. Monitor cron job executions
4. Share URL with beta users

---

## Cost After Launch

- **Vercel:** $0-20/month (free tier covers you)
- **Resend:** $20/month (startup plan, 1k emails)
- **PostgreSQL:** $15/month (managed)
- **Total:** ~$35/month

---

## Support

Stuck? Check:
- Vercel logs: `vercel logs --tail`
- Function errors: Vercel Dashboard → Function Logs
- Database issues: Prisma Studio (`npx prisma studio`)

Good luck! 🚀
