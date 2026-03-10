# 🧠 Big Brain Moves — Progressive Web App

Dark sleek Next.js **Progressive Web App (PWA)** for personalized daily newsletters. Installable on Android/iOS, works offline, with PDF generation, image AI, database, auth, and email delivery.

**📱 Install on home screen. Works offline. No app store needed.**

## ✅ Completed Features

### 📱 Progressive Web App (PWA)
- ✅ **Installable on Android home screen** (one-click "Add to Home Screen")
- ✅ **Installable on iOS home screen** (Safari "Add to Home Screen")
- ✅ **Works offline** (service worker + caching)
- ✅ **Standalone mode** (feels like native app, no browser UI)
- ✅ **Splash screens** (app launch animation)
- ✅ **App shortcuts** (quick access: Newsletter, Topics, Timetable)
- ✅ **Dark theme** (matches app design)

### Newsletter & Content
- ✅ Topic selection (11 categories: Dieting, Budgeting, Dating, etc.)
- ✅ **Real PDF generation** with PDFKit (professional formatting, multi-page)
- ✅ **Gemini Imagen3 integration** (image generation for sections)
- ✅ Interactive timetable with time management
- ✅ Dark theme UI (Tailwind CSS)

### Backend & Infrastructure
- ✅ **PostgreSQL database** with Prisma ORM (User, Newsletter, DeliveryLog models)
- ✅ **Authentication** (signup, login, JWT tokens, bcrypt hashing)
- ✅ **Email delivery** with Resend (HTML templates, transactional emails)
- ✅ **Cron job system** (daily newsletter scheduling)
- ✅ **Secure input handling** (DOMPurify, whitelist validation, no code execution)
- ✅ TypeScript strict mode enabled

## Tech Stack

- **Frontend:** Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend:** Next.js API routes, Node.js
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** JWT + bcryptjs
- **PDF:** PDFKit (professional formatting)
- **Images:** Gemini Imagen3 (generative AI)
- **Email:** Resend (transactional & bulk)
- **Hosting:** here.now (free) or Vercel

## Local Setup

```bash
cd bbm-app

# Install dependencies
npm install

# Create .env.local from .env.example
cp .env.example .env.local

# Set up PostgreSQL and update DATABASE_URL
# Then run migrations:
npx prisma migrate dev

# Run dev server
npm run dev

# Open http://localhost:3000
```

## Environment Variables

See `.env.example` for all required variables:

```
DATABASE_URL=postgresql://...
JWT_SECRET=...
GEMINI_API_KEY=...
RESEND_API_KEY=...
CRON_SECRET=...
```

## 🚀 Deploy PWA to here.now (One Command)

```bash
# 1. Generate PWA icons
python3 scripts/generate-pwa-icons.py

# 2. Deploy
npm run build && npm install -g here-cli && here deploy

# ✅ App is live! Visit: https://your-project.here.now.sh
```

**That's it!** Your PWA is deployed with:
- ✅ Service Worker for offline support
- ✅ Install prompt on Android Chrome
- ✅ iOS Safari install instructions
- ✅ Full functionality

For detailed PWA setup, see: [DEPLOY_PWA.md](./DEPLOY_PWA.md) | [PWA_SETUP.md](./PWA_SETUP.md)

---

## Production Build & Deployment

### Vercel (Recommended for Backend Features)

```bash
# 1. Generate icons
python3 scripts/generate-pwa-icons.py

# 2. Deploy
vercel deploy --prod

# ✅ PWA + Backend live on Vercel
```

Features on Vercel:
- PWA install support
- Database (Vercel Postgres)
- Email delivery (Resend)
- Cron jobs (daily newsletter)

### here.now (Free, Simple PWA Only)

```bash
# 1. Generate icons
python3 scripts/generate-pwa-icons.py

# 2. Deploy
npm run build && here deploy

# ✅ PWA live on here.now
```

Good for: PWA features, fast deployment, free hosting
Missing: Database persistence (requires external DB)

### Docker (Self-Hosted)

```bash
docker build -t bbm-app .
docker run -p 3000:3000 -e DATABASE_URL=... bbm-app
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` — Create new user
- `POST /api/auth/login` — Login & get JWT

### User
- `GET /api/user/preferences` — Get user preferences
- `POST /api/user/preferences` — Update preferences

### Newsletter
- `POST /api/generate-pdf` — Generate PDF from topics
- `POST /api/newsletter/send` — Send newsletter via email
- `GET /api/newsletter/send` — Test email (dev only)

### Cron
- `POST /api/cron/daily-newsletter` — Daily newsletter job (triggered by external scheduler)

## Database Schema

```prisma
User {
  id, email, password (hashed)
  topics, timezone, emailTime
  dailyDeliveryEnabled, createdAt
}

Newsletter {
  id, userId, topics, content (JSON)
  pdfUrl, generatedAt, sentAt
}

DeliveryLog {
  id, userId, status
  scheduledFor, deliveredAt
}
```

## Key Files

```
app/
├── page.tsx                          # Dashboard
├── layout.tsx                        # Root layout
├── globals.css                       # Dark theme
└── api/
    ├── auth/
    │   ├── signup/route.ts
    │   └── login/route.ts
    ├── user/
    │   └── preferences/route.ts
    ├── generate-pdf/route.ts
    ├── newsletter/
    │   └── send/route.ts
    └── cron/
        └── daily-newsletter/route.ts

components/
├── TopicSelector.tsx                # Topic selection UI
├── PDFViewer.tsx                    # PDF preview + download
└── Timetable.tsx                    # Time management

lib/
├── newsletter.ts                    # Content + sanitization
├── pdf-generator.ts                 # PDFKit wrapper
├── image-generator.ts               # Gemini Imagen3
└── email-service.ts                 # Resend integration

prisma/
└── schema.prisma                    # Database schema
```

## Security Features

- ✅ **Input Sanitization:** DOMPurify removes all HTML/scripts
- ✅ **Whitelist Validation:** Topics must be in APPROVED_TOPICS
- ✅ **Password Hashing:** bcryptjs with 10 rounds
- ✅ **JWT Auth:** Secure token-based authentication
- ✅ **No Code Execution:** Text inputs never evaluated
- ✅ **SQL Injection Protection:** Prisma parameterized queries
- ✅ **CORS & CSP:** Headers configured in Next.js

## Daily Newsletter Workflow

1. **Cron Job** → Triggers `/api/cron/daily-newsletter` at scheduled time
2. **User Fetch** → Retrieves all active users from DB
3. **Newsletter Generation** → Creates personalized content based on topics
4. **PDF Creation** → Generates PDF with PDFKit + Imagen3 images
5. **Email Send** → Delivers via Resend with HTML template
6. **Log Delivery** → Records in DeliveryLog table

## Cron Setup (External)

### Option 1: Vercel Crons
```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/daily-newsletter",
      "schedule": "0 8 * * *"
    }
  ]
}
```

### Option 2: EasyCron (Free)
1. Go to [easycron.com](https://www.easycron.com/)
2. Add cron: `https://your-app.com/api/cron/daily-newsletter`
3. Set header: `Authorization: Bearer YOUR_CRON_SECRET`
4. Schedule: Daily at 8 AM

### Option 3: GitHub Actions
```yaml
name: Daily Newsletter
on:
  schedule:
    - cron: '0 8 * * *'
jobs:
  send:
    runs-on: ubuntu-latest
    steps:
      - run: |
          curl -X POST https://your-app.com/api/cron/daily-newsletter \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

## Testing

```bash
# Run tests
npm test

# Test API endpoints
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test1234","name":"Test"}'

# Test newsletter generation
curl -X POST http://localhost:3000/api/generate-pdf \
  -H "Content-Type: application/json" \
  -d '{"topics":["Dieting","Date Ideas"]}'

# Test email send (dev only)
curl http://localhost:3000/api/newsletter/send
```

## Performance & Scaling

- **Rate Limiting:** 1 email/second in bulk sends to avoid Resend limits
- **Image Generation:** Max 5 images per batch with delays
- **PDF Caching:** Store PDFs in S3 (TODO)
- **Database Indexing:** Indexes on user email + newsletter date
- **Queue System:** Use Bull/RabbitMQ for large user bases (TODO)

## Monitoring & Logging

- All errors logged to console (integrate with Sentry/LogRocket for production)
- DeliveryLog table tracks email status
- API endpoints return structured error responses

## Future Enhancements

- [ ] S3 integration for PDF storage
- [ ] Analytics dashboard (open rates, engagement)
- [ ] User preferences UI (date, time, topics)
- [ ] Subscriber segmentation & A/B testing
- [ ] Dark mode in email templates
- [ ] Mobile app (React Native)
- [ ] Rate limiting (IP-based)
- [ ] Payment/subscription system

## Support

For issues or questions: support@bigbrainmoves.com

## Author

Big Brain Moves © 2026 — Smart living, automated.
