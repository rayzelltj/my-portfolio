"""Turn a portrait + person mask into a compact particle file for the web.

Usage: python3 portrait-points.py <photo> <mask.png> <out.bin> [grid_width]

Output layout (little-endian):
  uint16 width, uint16 height, uint32 count
  then `count` records of 7 x uint8: x, y, brightness, edge, r, g, b
Only the points survive, so no photo pixels or EXIF/GPS data are published.
"""
import struct
import sys

import numpy as np
from PIL import Image, ImageFilter, ImageOps

photo_path, mask_path, out_path = sys.argv[1:4]
grid_w = int(sys.argv[4]) if len(sys.argv) > 4 else 150

color = ImageOps.exif_transpose(Image.open(photo_path)).convert("RGB")
photo = color.convert("L")
mask = Image.open(mask_path).convert("L").resize(photo.size)

# Head-and-shoulders crop (fractions of the full frame).
W, H = photo.size
box = (int(W * 0.04), int(H * 0.11), int(W * 0.96), int(H * 0.95))
photo, mask, color = photo.crop(box), mask.crop(box), color.crop(box)

grid_h = round(grid_w * photo.height / photo.width)
assert grid_w <= 255 and grid_h <= 255, "grid must fit in uint8"
lum = np.asarray(photo.resize((grid_w, grid_h), Image.LANCZOS), dtype=np.float32) / 255
rgb = np.asarray(color.resize((grid_w, grid_h), Image.LANCZOS), dtype=np.uint8)
alpha = np.asarray(mask.resize((grid_w, grid_h), Image.LANCZOS), dtype=np.float32) / 255
edges = np.asarray(
    photo.resize((grid_w * 2, grid_h * 2), Image.LANCZOS).filter(ImageFilter.FIND_EDGES).resize((grid_w, grid_h)),
    dtype=np.float32,
) / 255

# Stretch contrast inside the person only, so the face reads clearly.
inside = alpha > 0.5
lo, hi = np.percentile(lum[inside], [3, 99])
lum = np.clip((lum - lo) / (hi - lo), 0, 1)
edges = np.clip(edges / max(np.percentile(edges[inside], 98), 1e-6), 0, 1)

records = []
for y in range(grid_h):
    for x in range(grid_w):
        if alpha[y, x] > 0.5:
            r, g, b = rgb[y, x]
            records.append((x, y, int(lum[y, x] * 255), int(edges[y, x] * 255), r, g, b))

with open(out_path, "wb") as f:
    f.write(struct.pack("<HHI", grid_w, grid_h, len(records)))
    f.write(np.array(records, dtype=np.uint8).tobytes())
print(f"{len(records)} points on a {grid_w}x{grid_h} grid -> {out_path}")
