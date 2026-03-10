#!/usr/bin/env python3
"""
Generate PWA icons from SVG template
Creates: pwa-192x192.png, pwa-512x512.png, and maskable variants
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(size: int, maskable: bool = False) -> Image.Image:
    """Create a PWA icon with Big Brain Moves branding"""
    
    # Create image with dark background
    img = Image.new('RGBA', (size, size), color=(3, 7, 18, 255))  # #030712
    draw = ImageDraw.Draw(img)
    
    # Draw gradient circle (simulated with concentric circles)
    center = size // 2
    radius = int(size * 0.35)
    
    # Blue to cyan gradient effect (using stepped circles)
    colors = [
        (96, 165, 250),    # #60a5fa (blue)
        (59, 130, 246),    # #3b82f6
        (6, 182, 212),     # #06b6d4 (cyan)
    ]
    
    for i, color in enumerate(colors):
        r = radius - int((i * radius) / len(colors))
        if r > 0:
            draw.ellipse(
                [center - r, center - r, center + r, center + r],
                fill=color + (255,)
            )
    
    # Draw brain emoji (fallback: just use text)
    try:
        # Try to load a large font
        font_size = int(size * 0.5)
        font = ImageFont.load_default()  # Fallback
    except:
        font = ImageFont.load_default()
    
    # Draw brain text
    brain_text = "🧠"
    try:
        draw.text(
            (center, center),
            brain_text,
            fill=(255, 255, 255, 255),
            anchor="mm",
            font=font
        )
    except:
        # If emoji fails, draw circle
        draw.ellipse(
            [center - 20, center - 20, center + 20, center + 20],
            fill=(255, 255, 255, 255)
        )
    
    return img

def main():
    """Generate all required PWA icons"""
    output_dir = "public"
    
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    sizes = [192, 512]
    
    for size in sizes:
        print(f"📱 Generating {size}x{size} icon...")
        
        # Regular icon
        img = create_icon(size, maskable=False)
        img.save(f"{output_dir}/pwa-{size}x{size}.png", "PNG")
        print(f"   ✅ pwa-{size}x{size}.png")
        
        # Maskable icon
        img_maskable = create_icon(size, maskable=True)
        img_maskable.save(f"{output_dir}/pwa-{size}x{size}-maskable.png", "PNG")
        print(f"   ✅ pwa-{size}x{size}-maskable.png")
    
    # Generate favicon
    print("📱 Generating favicon...")
    favicon = create_icon(32, maskable=False)
    favicon.save(f"{output_dir}/favicon.ico", "ICO")
    print(f"   ✅ favicon.ico")
    
    print("\n✅ All PWA icons generated in public/")

if __name__ == "__main__":
    main()
