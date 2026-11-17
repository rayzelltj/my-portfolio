"""Bake a portrait into a small "cloud map" PNG that the browser turns into a dense point cloud.

Usage: python3 portrait-cloud.py <photo> <mask.png> <out_map.png> <out_inset.webp> [width]

The map is two panels side by side (no alpha channel: browsers premultiply alpha, which
would destroy data stored there).
  Left panel:  R = brightness after a dramatic contrast curve (where points cluster)
               G = depth (rounded volume from the silhouette, face pushed forward)
               B = person mask
  Right panel: R = edge strength (extra points along hair strands and features)
The inset is the small reference photo shown next to the cloud. Neither file carries EXIF/GPS.
"""
import sys

import numpy as np
from PIL import Image, ImageFilter, ImageOps
from scipy import ndimage

photo_path, mask_path, out_map, out_inset = sys.argv[1:5]
width = int(sys.argv[5]) if len(sys.argv) > 5 else 360

color = ImageOps.exif_transpose(Image.open(photo_path)).convert("RGB")
mask = Image.open(mask_path).convert("L").resize(color.size)

W, H = color.size
box = (int(W * 0.04), int(H * 0.11), int(W * 0.96), int(H * 0.95))  # head and shoulders
color, mask = color.crop(box), mask.crop(box)
height = round(width * color.height / color.width)

gray = np.asarray(color.convert("L").resize((width, height), Image.LANCZOS), dtype=np.float32) / 255
m = np.asarray(mask.resize((width, height), Image.LANCZOS), dtype=np.float32) / 255
inside = m > 0.5

# Dramatic, monochrome contrast: crush the shadows, keep highlights crisp.
lo, hi = np.percentile(gray[inside], [4, 99.5])
lum = np.clip((gray - lo) / (hi - lo), 0, 1)
lum = lum ** 1.12
# Local contrast (unsharp) so hair strands and features carry detail.
blur = ndimage.gaussian_filter(lum, 3)
lum = np.clip(lum + (lum - blur) * 0.45, 0, 1)
lum = ndimage.gaussian_filter(lum, 0.6)  # smooth skin tones; edges carry the detail

# Depth: a rounded volume from the silhouette (the frame's bottom edge counts as an edge so the
# chest doesn't bulge), plus a bump centred on the head so the face sits forward.
padded = np.pad(inside, ((0, 1), (0, 0)))
dist = ndimage.distance_transform_edt(padded)[:-1]
dome = np.sqrt(dist / max(dist.max(), 1))
rows = np.where(inside.any(axis=1))[0]
top = rows[0]
head_rows = inside[top : top + int(height * 0.42)]
ys, xs = np.nonzero(head_rows)
cy, cx = ys.mean() + top, xs.mean()
yy, xx = np.mgrid[0:height, 0:width]
head = np.exp(-(((xx - cx) / (width * 0.2)) ** 2 + ((yy - cy) / (height * 0.2)) ** 2))
depth = ndimage.gaussian_filter(dome, 4) * 0.45 + head * 0.45 + ndimage.gaussian_filter(lum, 2) * 0.1
depth = depth * inside
depth = depth / max(depth.max(), 1e-6)

# Edges: gradient magnitude of the photo, so strands and features get extra points.
gx, gy = ndimage.sobel(ndimage.gaussian_filter(gray, 0.8), 1), ndimage.sobel(ndimage.gaussian_filter(gray, 0.8), 0)
edge = np.hypot(gx, gy)
edge = np.clip(edge / max(np.percentile(edge[inside], 97), 1e-6), 0, 1)

left = np.stack([lum, depth, m], axis=-1)
right = np.stack([edge, np.zeros_like(edge), np.zeros_like(edge)], axis=-1)
panels = np.concatenate([left, right], axis=1)
Image.fromarray((panels * 255).astype(np.uint8), "RGB").save(out_map, optimize=True)

inset = color.resize((360, round(360 * color.height / color.width)), Image.LANCZOS)
inset.save(out_inset, "WEBP", quality=82)  # no exif= argument, so no metadata is written
print(f"map {width}x{height} -> {out_map}; inset -> {out_inset}")
