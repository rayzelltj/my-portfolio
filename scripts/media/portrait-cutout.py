"""Cut a portrait out of its background for the web: real photo pixels, soft mask edge,
a gentle grade (natural skin, shadows leaning toward the site's navy), no EXIF/GPS.

Usage: python3 portrait-cutout.py <photo> <mask.png> <out.webp> [width]
"""
import sys

import numpy as np
from PIL import Image, ImageEnhance, ImageFilter, ImageOps

photo_path, mask_path, out_path = sys.argv[1:4]
width = int(sys.argv[4]) if len(sys.argv) > 4 else 900
NAVY = np.array([10, 26, 58], dtype=np.float32)

photo = ImageOps.exif_transpose(Image.open(photo_path)).convert("RGB")
mask = Image.open(mask_path).convert("L").resize(photo.size)

W, H = photo.size
box = (int(W * 0.04), int(H * 0.11), int(W * 0.96), int(H * 0.95))  # head and shoulders
photo, mask = photo.crop(box), mask.crop(box)
height = round(width * photo.height / photo.width)
photo = photo.resize((width, height), Image.LANCZOS)
mask = mask.resize((width, height), Image.LANCZOS).filter(ImageFilter.GaussianBlur(1.2))

photo = ImageEnhance.Contrast(photo).enhance(1.05)
a = np.asarray(photo, dtype=np.float32)
lum = a.mean(axis=2, keepdims=True) / 255
a = a + (NAVY - a) * ((1 - lum) ** 3 * 0.3)  # only the deepest shadows pick up navy

out = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).convert("RGBA")
out.putalpha(mask)
out.save(out_path, "WEBP", quality=88, method=6)  # no exif= argument, so no metadata is written
print(f"cutout {width}x{height} -> {out_path}")
