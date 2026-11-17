"""Prepare personal photos for the web: upright, square-cropped, consistently graded,
resized, and saved WITHOUT EXIF (strips GPS location and camera data).

Usage: python3 life-photos.py <out_dir> <photo>[:x_center] ...
  x_center is an optional 0..1 horizontal crop centre (default 0.5).
HEIC files must be converted to JPEG first (e.g. `sips -s format jpeg`).
Transparent PNG cutouts (from subject-cutout.swift) are padded to a square, keep their
transparency, and are saved as WebP.
"""
import os
import sys

import numpy as np
from PIL import Image, ImageEnhance, ImageOps

SIZE = 900
NAVY = np.array([10, 26, 58], dtype=np.float32)  # palette "trench": shadows lean toward it

def save_cutout(im, path):
    """Trim to the subject, pad to a square with transparency, grade, save as WebP."""
    im = im.crop(im.getchannel("A").getbbox())
    side = max(im.size)
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    canvas.paste(im, ((side - im.width) // 2, (side - im.height) // 2))
    canvas = canvas.resize((SIZE, SIZE), Image.LANCZOS)
    rgb = ImageEnhance.Contrast(canvas.convert("RGB")).enhance(1.06)
    out = rgb.convert("RGBA")
    out.putalpha(canvas.getchannel("A"))
    name = os.path.splitext(os.path.basename(path))[0].lower() + ".webp"
    out.save(os.path.join(out_dir, name), "WEBP", quality=84, method=6)  # no metadata written
    print("wrote", name)


out_dir = sys.argv[1]
os.makedirs(out_dir, exist_ok=True)

for arg in sys.argv[2:]:
    path, _, cx = arg.partition(":")
    cx = float(cx) if cx else 0.5
    src = ImageOps.exif_transpose(Image.open(path))
    if src.mode in ("RGBA", "LA") or "transparency" in src.info:
        save_cutout(src.convert("RGBA"), path)
        continue
    im = src.convert("RGB")
    side = min(im.size)
    left = int(np.clip(im.width * cx - side / 2, 0, im.width - side))
    top = (im.height - side) // 2
    im = im.crop((left, top, left + side, top + side)).resize((SIZE, SIZE), Image.LANCZOS)

    # Gentle, shared grade: a touch more contrast, shadows tinted toward the site's navy.
    im = ImageEnhance.Contrast(im).enhance(1.06)
    a = np.asarray(im, dtype=np.float32)
    lum = a.mean(axis=2, keepdims=True) / 255
    weight = (1 - lum) ** 3 * 0.35
    a = a + (NAVY - a) * weight

    name = os.path.splitext(os.path.basename(path))[0].lower() + ".jpg"
    Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).save(
        os.path.join(out_dir, name), "JPEG", quality=82, optimize=True, progressive=True
    )  # no exif= argument, so no metadata is written
    print("wrote", name)
