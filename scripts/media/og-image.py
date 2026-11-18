"""Bake the 1200x630 social preview image (link cards on LinkedIn, Slack, iMessage).

Same look as the homepage hero: name in condensed type behind the portrait
cutout, on deep blue with a dotted "water" field.

Usage: python3 scripts/media/og-image.py <fonts_dir> <out.png>
  fonts_dir holds static instances: archivo-800-62.ttf, figtree-500.ttf
"""
import math
import sys

import numpy as np

from PIL import Image, ImageDraw, ImageFilter, ImageFont

W, H = 1200, 630
ABYSS = (4, 11, 28)
TRENCH = (10, 26, 58)
ICE = (227, 236, 255)
SILT = (129, 147, 184)
ACCENT = (215, 255, 61)

fonts, out = sys.argv[1], sys.argv[2]
display = ImageFont.truetype(f"{fonts}/archivo-800-62.ttf", 200)
body = ImageFont.truetype(f"{fonts}/figtree-500.ttf", 30)
small = ImageFont.truetype(f"{fonts}/figtree-500.ttf", 22)

# Background: abyss with a trench glow rising from the bottom.
img = Image.new("RGB", (W, H), ABYSS)
glow = Image.new("L", (W, H), 0)
ImageDraw.Draw(glow).ellipse((-300, 330, W + 300, H + 520), fill=255)
glow = glow.filter(ImageFilter.GaussianBlur(120))
img.paste(Image.new("RGB", (W, H), TRENCH), mask=glow)

# Dotted swell, like the particle field on the site.
dots = Image.new("RGBA", (W, H), (0, 0, 0, 0))
d = ImageDraw.Draw(dots)
for row in range(26):
    depth = row / 25
    y0 = 250 + depth**1.5 * 380
    for col in range(0, W + 12, 12):
        y = y0 + math.sin(col / 90 + row * 0.6) * (6 + 10 * depth)
        a = int(40 + 110 * depth)
        r = 1.1 + depth * 1.2
        d.ellipse((col - r, y - r, col + r, y + r), fill=(91, 140, 255, a))
img.paste(dots, mask=dots)
# One accent scan line through the field.
scan = Image.new("RGBA", (W, H), (0, 0, 0, 0))
sd = ImageDraw.Draw(scan)
for col in range(0, W, 6):
    y = 300 + math.sin(col / 90 + 1.2) * 8
    sd.ellipse((col - 1.3, y - 1.3, col + 1.3, y + 1.3), fill=(*ACCENT, 150))
img.paste(scan, mask=scan)

# Name, centered, behind the portrait.
draw = ImageDraw.Draw(img)
name = "RAYZELL TJANDRA"
box = draw.textbbox((0, 0), name, font=display)
tw = box[2] - box[0]
scale = 1100 / tw
display = ImageFont.truetype(f"{fonts}/archivo-800-62.ttf", int(200 * scale))
box = draw.textbbox((0, 0), name, font=display)
tw = box[2] - box[0]
draw.text(((W - tw) / 2 - box[0], 70 - box[1]), name, font=display, fill=ICE)

# Portrait cutout, fading out at the bottom.
p = Image.open("public/media/portrait-cutout.webp").convert("RGBA")
p = p.crop(p.getbbox())
ph = 560
p = p.resize((int(p.width * ph / p.height), ph), Image.LANCZOS)
fade = Image.new("L", p.size, 255)
fd = ImageDraw.Draw(fade)
for y in range(p.height):
    t = max(0.0, (y - p.height * 0.72) / (p.height * 0.28))
    fd.line((0, y, p.width, y), fill=int(255 * (1 - t) ** 1.6))
# Soften the straight crop edges at the shoulders too.
side = Image.new("L", p.size, 255)
sdraw = ImageDraw.Draw(side)
edge = p.width * 0.16
for x in range(p.width):
    t = min(x, p.width - 1 - x) / edge
    sdraw.line((x, 0, x, p.height), fill=int(255 * min(1.0, t) ** 1.4))
fade = Image.fromarray(np.minimum(np.array(fade), np.array(side)))
alpha = Image.composite(p.getchannel("A"), Image.new("L", p.size, 0), fade)
p.putalpha(alpha)
img.paste(p, ((W - p.width) // 2, H - p.height), p)

# Corner copy.
draw.text((48, H - 92), "I build software", font=body, fill=ICE)
draw.text((48, H - 56), "people rely on.", font=body, fill=ICE)
label = "Software engineer · UBC"
lb = draw.textbbox((0, 0), label, font=small)
draw.text((W - 48 - (lb[2] - lb[0]), H - 50), label, font=small, fill=SILT)
draw.ellipse((W - 48 - (lb[2] - lb[0]) - 20, H - 41, W - 48 - (lb[2] - lb[0]) - 10, H - 31), fill=ACCENT)

img.save(out, optimize=True)
print("wrote", out)
