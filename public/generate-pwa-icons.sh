#!/bin/bash
# Generate PWA icons from SVG template
# Requires: ImageMagick (convert command)

# Create base SVG icon
cat > /tmp/bbm-icon.svg << 'EOF'
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <!-- Dark background -->
  <rect width="512" height="512" fill="#030712"/>
  
  <!-- Gradient circle -->
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#60a5fa;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#06b6d4;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Brain icon (emoji style) -->
  <circle cx="256" cy="256" r="200" fill="url(#grad)"/>
  
  <!-- Brain outline -->
  <text x="256" y="330" font-size="200" font-family="Arial, sans-serif" fill="white" text-anchor="middle" dominant-baseline="middle">🧠</text>
</svg>
EOF

# Generate 192x192
convert -background none -size 512x512 /tmp/bbm-icon.svg -resize 192x192 public/pwa-192x192.png
convert -background none -size 512x512 /tmp/bbm-icon.svg -resize 192x192 public/pwa-192x192-maskable.png

# Generate 512x512
convert -background none -size 512x512 /tmp/bbm-icon.svg public/pwa-512x512.png
convert -background none -size 512x512 /tmp/bbm-icon.svg public/pwa-512x512-maskable.png

# Generate favicon
convert -background none -size 512x512 /tmp/bbm-icon.svg -resize 32x32 public/favicon.ico

echo "✅ PWA icons generated in public/"
