# Deployment Guide — Big Brain Moves

## Pre-Deployment Checklist

- [ ] All environment variables set in `.env.local`
- [ ] Database migrations run: `npx prisma migrate deploy`
- [ ] API endpoints tested locally
- [ ] Email service configured (Resend account + API key)
- [ ] Gemini API key obtained (Google Cloud Console)
- [ ] Cron secret generated (32+ random chars)
- [ ] JWT secret generated (32+ random chars)

## Option 1: Vercel (Recommended)

### 1. Prerequisites
- [ ] GitHub account with repo pushed
- [ ] Vercel account (free at vercel.com)

### 2. Deploy
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Or connect repo via Vercel dashboard
# https://vercel.com/new
```

### 3. Environment Variables
In Vercel Dashboard:
1. Go to **Settings → Environment Variables**
2. Add all variables from `.env.example`:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `GEMINI_API_KEY`
   - `RESEND_API_KEY`
   - `CRON_SECRET`

### 4. Database Setup
```bash
# Using Vercel Postgres (free tier available)
vercel env pull # Downloads env vars
npx prisma migrate deploy # Runs migrations
```

### 5. Cron Jobs
In `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cron/daily-newsletter",
    "schedule": "0 8 * * *"
  }]
}
```

Deploy:
```bash
vercel deploy --prod
```

Your app is live! Visit: `https://your-project.vercel.app`

---

## Option 2: here.now (Free, Simple)

### 1. Prerequisites
- [ ] here.now account (free at here.now)
- [ ] App built: `npm run build`

### 2. Deploy
```bash
# Install here CLI
npm install -g here-cli

# Login
here login

# Deploy
here deploy

# View app at: https://your-project.here.now.sh
```

### 3. Environment Variables
Create `.env.production` in project root with all vars from `.env.example`

### 4. Cron Jobs
For here.now, use external scheduler:
- **EasyCron** (free): easycron.com
- **GitHub Actions** (free)
- **AWS Lambda** (cheap)

Example with EasyCron:
1. Go to [easycron.com](https://www.easycron.com)
2. Add HTTP request:
   - **URL:** `https://your-project.here.now.sh/api/cron/daily-newsletter`
   - **Method:** POST
   - **Headers:** `Authorization: Bearer YOUR_CRON_SECRET`
3. Set cron: `0 8 * * *` (daily at 8 AM UTC)

---

## Option 3: Docker + Your Own Server

### 1. Create Dockerfile
```dockerfile
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

### 2. Build & Run
```bash
docker build -t bbm-app .
docker run -p 3000:3000 \
  -e DATABASE_URL="..." \
  -e RESEND_API_KEY="..." \
  bbm-app
```

### 3. Production Recommendations
- Use nginx as reverse proxy
- Enable SSL (Let's Encrypt)
- Set up monitoring (Sentry, Datadog)
- Use systemd or PM2 for auto-restart

---

## Post-Deployment

### 1. Verify Endpoints
```bash
# Test signup
curl -X POST https://your-app.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test1234"}'

# Test PDF generation
curl -X POST https://your-app.com/api/generate-pdf \
  -H "Content-Type: application/json" \
  -d '{"topics":["Dieting","Date Ideas"]}'
```

### 2. Set Up Email
1. Add sender domain to Resend
2. Test email sending
3. Set up unsubscribe links

### 3. Configure Cron
1. Set daily newsletter schedule
2. Test cron trigger manually
3. Monitor delivery logs

### 4. Monitor
- Check logs for errors
- Monitor API response times
- Track email delivery rates

---

## Troubleshooting

### Database connection fails
```bash
# Check DATABASE_URL format
# Correct: postgresql://user:pass@host:5432/dbname

# Verify migrations
npx prisma migrate status
npx prisma db push
```

### Email not sending
```bash
# Verify RESEND_API_KEY is set
# Check Resend dashboard for bounce rates
# Test with: GET /api/newsletter/send (dev only)
```

### Cron job not triggering
```bash
# Verify CRON_SECRET matches header
# Check cron job logs
# Test manually: curl -X POST https://your-app.com/api/cron/daily-newsletter \
    -H "Authorization: Bearer YOUR_CRON_SECRET"
```

### PDF generation fails
```bash
# Check PDFKit dependencies installed
npm ls pdfkit

# Verify font files available
# Check for memory/CPU limits on hosting
```

---

## Cost Estimates

| Service | Free Tier | Monthly Cost |
|---------|-----------|--------------|
| Vercel | 100GB bandwidth | $0-20 |
| here.now | Included | $0 |
| Resend | 100 emails/day | $20 (startup plan) |
| PostgreSQL | 5GB | $15-50 (managed) |
| Gemini | 15 req/min free | $0-5 |
| **Total** | ✅ Free with limits | **~$35-75** |

---

## Scaling

As you grow:
1. **Database:** Upgrade to managed PostgreSQL (Vercel Postgres, AWS RDS)
2. **Email:** Upgrade Resend plan for higher volume
3. **Images:** Cache Imagen3 output in S3
4. **Performance:** Enable Redis caching, CDN
5. **Monitoring:** Integrate Sentry, LogRocket

---

## Support

Stuck? Check:
- Vercel docs: https://vercel.com/docs
- Prisma docs: https://www.prisma.io/docs
- Resend docs: https://resend.com/docs
- Next.js docs: https://nextjs.org/docs

Happy deploying! 🚀
