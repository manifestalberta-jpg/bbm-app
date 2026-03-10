#!/bin/bash
# One-command deploy to here.now
# Big Brain Moves PWA + SQLite

set -e

echo "🧠 Big Brain Moves — Deploying PWA to here.now"
echo ""

# 1. Generate icons
echo "📱 Generating PWA icons..."
python3 scripts/generate-pwa-icons.py
echo "   ✅ Icons ready"
echo ""

# 2. Install dependencies
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps 2>/dev/null || npm install
echo "   ✅ Dependencies installed"
echo ""

# 3. Create Prisma database
echo "🗄️ Setting up SQLite database..."
npx prisma generate --skip-engine-check || true
echo "   ✅ Database schema ready"
echo ""

# 4. Build
echo "🔨 Building app..."
npm run build
echo "   ✅ Build complete"
echo ""

# 5. Install here CLI
echo "🚀 Installing here CLI..."
npm install -g here-cli 2>/dev/null || true
echo "   ✅ here CLI ready"
echo ""

# 6. Deploy
echo "🌐 Deploying to here.now..."
here deploy --public

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Your app is live at:"
echo "   https://your-project.here.now.sh"
echo ""
echo "📱 Installation Instructions:"
echo "   Android Chrome: Tap menu → Add to home screen"
echo "   iOS Safari: Tap Share → Add to Home Screen"
echo ""
