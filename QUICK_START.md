# 🚀 Quick Start — Big Brain Moves PWA

**Zero external dependencies. One command to deploy.**

---

## What You Get

✅ **Progressive Web App** — Install on Android/iOS home screen
✅ **Offline Support** — Works without internet
✅ **SQLite Database** — Local file, zero config
✅ **Dark Theme** — Sleek modern design
✅ **PDF Generator** — Download newsletters
✅ **Timetable** — 90-minute power blocks
✅ **Secure Inputs** — No code execution

---

## Deploy (One Command)

### Option 1: Automated Deploy Script

```bash
cd /home/bbm/.openclaw/workspace/bbm-app
chmod +x DEPLOY.sh
./DEPLOY.sh
```

**Done! App is live.**

### Option 2: Manual Deploy

```bash
cd /home/bbm/.openclaw/workspace/bbm-app

# 1. Generate icons
python3 scripts/generate-pwa-icons.py

# 2. Build
npm install
npm run build

# 3. Deploy to here.now
npm install -g here-cli
here deploy --public
```

---

## 📱 Install on Phone

### **Android (Chrome)**
1. Open: `https://your-project.here.now.sh`
2. Tap ⋯ menu (top right)
3. Tap **"Add to home screen"** or **"Install"**
4. ✅ App on home screen!

### **iOS (Safari)**
1. Open: `https://your-project.here.now.sh` in Safari
2. Tap **Share** (⬆️ at bottom)
3. Tap **"Add to Home Screen"**
4. Name: `Big Brain Moves`
5. Tap **"Add"**
6. ✅ App on home screen!

### **Desktop (Chrome/Edge)**
1. Open app
2. Click install icon (address bar)
3. Click **"Install"**
4. ✅ App installed!

---

## 💡 Local Development

```bash
cd /home/bbm/.openclaw/workspace/bbm-app

# Install
npm install

# Dev server (http://localhost:3000)
npm run dev

# Test PWA offline:
# 1. Open DevTools (F12)
# 2. Network tab → check "Offline"
# 3. Reload → should work from cache
```

---

## 📁 Project Structure

```
bbm-app/
├── public/
│   ├── manifest.json         # App metadata
│   ├── sw.js                 # Service worker (offline)
│   └── pwa-*.png             # Generated icons
│
├── app/
│   ├── page.tsx              # Dashboard
│   ├── layout.tsx            # PWA setup
│   └── api/                  # API routes
│
├── components/
│   ├── TopicSelector.tsx
│   ├── PDFViewer.tsx
│   ├── Timetable.tsx
│   └── PWAInstall.tsx        # Install prompt
│
├── lib/
│   ├── newsletter.ts
│   ├── pdf-generator.ts
│   └── email-service.ts
│
├── prisma/
│   ├── schema.prisma         # SQLite schema
│   └── dev.db                # Generated database
│
├── DEPLOY.sh                 # One-command deploy
├── QUICK_START.md            # This file
└── README.md                 # Full docs
```

---

## 🔒 No External Services Required

| Feature | Status |
|---------|--------|
| Database | ✅ SQLite (local file) |
| Auth | ✅ JWT + bcrypt |
| Hosting | ✅ here.now (free) |
| PWA | ✅ Service worker |
| Icons | ✅ Generated locally |
| PDF | ✅ PDFKit (local) |

**Zero external APIs.** Everything runs locally or on here.now.

---

## 🎯 Features

### 📰 Newsletter
- 11 topic categories
- PDF generation
- Dark theme
- Secure inputs (DOMPurify)

### ⏰ Timetable
- 90-minute power blocks
- Daily schedule
- Time management

### 📱 PWA
- Install to home screen
- Works offline
- Standalone mode
- App shortcuts

---

## 🚨 Troubleshooting

### Icons not generated
```bash
pip install Pillow
python3 scripts/generate-pwa-icons.py
```

### here CLI not found
```bash
npm install -g here-cli
```

### App not building
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Database issues
```bash
npx prisma generate
npx prisma db push
```

---

## 🌐 After Deployment

Your PWA is now live at: `https://your-project.here.now.sh`

**Next steps:**
1. Test install on phone
2. Test offline mode
3. Test all features
4. Share with users
5. Monitor usage

---

## 📖 Learn More

- **PWA Setup:** See `PWA_SETUP.md`
- **Full Docs:** See `README.md`
- **API Endpoints:** See README.md → "API Endpoints" section

---

## ✅ You're All Set!

Your Progressive Web App is ready to deploy.

**One command:**
```bash
cd /home/bbm/.openclaw/workspace/bbm-app && chmod +x DEPLOY.sh && ./DEPLOY.sh
```

**Then install on your phone. Enjoy! 🚀**
