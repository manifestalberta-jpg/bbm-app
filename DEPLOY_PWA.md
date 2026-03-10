# Deploy Big Brain Moves PWA — Quick Start

**One-command deployment to here.now with PWA support.**

---

## Prerequisites

- Node.js 18+ installed
- PWA icons generated (see below)
- All environment variables ready (optional for here.now)

---

## Step 1: Generate PWA Icons

```bash
cd /home/bbm/.openclaw/workspace/bbm-app

# Install dependencies
pip install Pillow

# Generate icons
python3 scripts/generate-pwa-icons.py

# Verify
ls -la public/pwa-*.png
# Should output: pwa-192x192.png, pwa-512x512.png, and maskable variants
```

---

## Step 2: Build & Deploy to here.now

### Option A: One-Line Deploy (Simplest)

```bash
npm run build && npm install -g here-cli && here deploy
```

**That's it!** Your PWA is live at `https://your-project.here.now.sh`

### Option B: Step-by-Step

```bash
# 1. Install dependencies
npm install

# 2. Build
npm run build

# 3. Install here CLI
npm install -g here-cli

# 4. Login (first time only)
here login

# 5. Deploy
here deploy

# 6. View live
# App is now at: https://your-project.here.now.sh
```

---

## Step 3: Test Installation

### **Android (Chrome)**
1. Open `https://your-project.here.now.sh`
2. Tap ⋯ menu (top right)
3. Tap **"Add to home screen"** or **"Install"**
4. ✅ App on home screen!

### **iOS (Safari)**
1. Open `https://your-project.here.now.sh` in Safari
2. Tap **Share** (⬆️ bottom)
3. Tap **"Add to Home Screen"**
4. Name: `Big Brain Moves`
5. Tap **"Add"**
6. ✅ App on home screen!

### **Desktop (Chrome/Edge)**
1. Open app
2. Click address bar install icon
3. Click **"Install"**
4. ✅ App installed!

---

## Step 4: Verify PWA Features

### Service Worker Active
1. Open DevTools (`F12`)
2. Go to **Application → Service Workers**
3. Should show `/sw.js` as **"activated and running"**

### Offline Mode
1. DevTools → **Network** tab
2. Check **Offline** checkbox
3. Reload page
4. App should still load from cache

### Install Prompt
1. Open app on Android Chrome
2. Should see **"📥 Add to Home Screen"** button
3. Click to install

---

## Step 5: Configure Environment (Optional)

If you need database/email features, create `.env.local`:

```bash
# Copy from .env.example
cp .env.example .env.local

# Edit with your keys:
# DATABASE_URL=postgresql://...
# RESEND_API_KEY=re_...
# GEMINI_API_KEY=gsk_...
# JWT_SECRET=your_secret_here
# CRON_SECRET=your_cron_secret_here
```

Then redeploy:
```bash
here deploy
```

---

## Complete File Checklist

Before deploying, verify these files exist:

```
public/
├── manifest.json              ✅ App metadata
├── sw.js                      ✅ Service worker
├── favicon.ico               ✅ Browser icon
├── pwa-192x192.png           ✅ Home screen icon
├── pwa-512x512.png           ✅ Splash screen
├── pwa-192x192-maskable.png  ✅ Icon variant
└── pwa-512x512-maskable.png  ✅ Splash variant

app/
├── page.tsx                   ✅ Dashboard with PWAInstall
└── layout.tsx                 ✅ PWA meta tags

components/
└── PWAInstall.tsx             ✅ Install prompt UI

next.config.js                 ✅ PWA configuration
package.json                   ✅ Dependencies (next-pwa)
```

---

## One-Command Deploy Script

Save this as `deploy.sh`:

```bash
#!/bin/bash
set -e

echo "🧠 Deploying Big Brain Moves PWA..."

# 1. Generate icons
echo "📱 Generating PWA icons..."
python3 scripts/generate-pwa-icons.py

# 2. Install dependencies
echo "📦 Installing dependencies..."
npm install

# 3. Build
echo "🔨 Building..."
npm run build

# 4. Deploy
echo "🚀 Deploying to here.now..."
npm install -g here-cli > /dev/null 2>&1
here deploy

echo "✅ Deployed! Visit your app at:"
echo "   https://your-project.here.now.sh"
```

Run it:
```bash
chmod +x deploy.sh
./deploy.sh
```

---

## Deployment URLs

After deploying to here.now:

| Resource | URL |
|----------|-----|
| **App** | https://your-project.here.now.sh |
| **Service Worker** | https://your-project.here.now.sh/sw.js |
| **Manifest** | https://your-project.here.now.sh/manifest.json |
| **Icons** | https://your-project.here.now.sh/pwa-*.png |

---

## Verify Deployment

```bash
# Check app loads
curl https://your-project.here.now.sh -I
# Should return 200 OK

# Check manifest
curl https://your-project.here.now.sh/manifest.json
# Should return valid JSON

# Check service worker
curl https://your-project.here.now.sh/sw.js
# Should return JavaScript code

# Check icons
curl https://your-project.here.now.sh/pwa-192x192.png -I
# Should return 200 OK with image/png content-type
```

---

## Troubleshooting

### Icon generation fails
```bash
# Install PIL for icon generation
pip install --upgrade Pillow

# Re-run generation
python3 scripts/generate-pwa-icons.py
```

### here CLI not found
```bash
npm install -g here-cli

# Or use npx
npx here deploy
```

### Service Worker not active
1. Check DevTools: **Application → Service Workers**
2. Verify `public/sw.js` is accessible
3. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

### Install button not showing
- **Only works on Android Chrome** (for now)
- iOS uses Safari's "Add to Home Screen" feature
- Check DevTools to verify manifest is valid

---

## Next: Add Custom Domain

To use your own domain instead of `here.now.sh`:

1. Configure DNS records with here.now
2. Update manifest.json with new URL
3. Redeploy: `here deploy`

See here.now docs: https://here.now.sh/docs

---

## Post-Deployment

### Monitor Installation
- Google Analytics: Track `beforeinstallprompt` events
- User feedback: Monitor install rates

### Update PWA
1. Update code
2. Rebuild: `npm run build`
3. Redeploy: `here deploy`
4. Users get new version automatically (service worker updates)

### Customize
- **Icons:** Replace `public/pwa-*.png`
- **Colors:** Edit `manifest.json` colors
- **Shortcuts:** Add more in manifest.json
- **Offline behavior:** Modify `public/sw.js`

---

## Success Checklist

- ✅ PWA icons generated
- ✅ App deployed to here.now
- ✅ Service Worker registered
- ✅ Offline mode works
- ✅ Install prompt shows (Android)
- ✅ App installable on home screen
- ✅ Dark theme displays correctly

---

## Support

**Stuck?** Check these resources:
- here.now Docs: https://here.now.sh/docs
- PWA Guide: https://web.dev/progressive-web-apps/
- Troubleshooting: See PWA_SETUP.md

**Now deploy your PWA! 🚀**
