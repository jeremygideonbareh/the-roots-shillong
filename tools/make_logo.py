"""Lifts The Roots' white wordmark off the black tile on the MMUN 2026 partners poster (their highest-res public copy)."""
from PIL import Image, ImageFilter
im = Image.open('assets/ig/DdO-jsHymsp_01.jpg').convert('L')
box = (350, 655, 760, 840)
c = im.crop(box)
c = c.resize((c.width * 4, c.height * 4), Image.LANCZOS).filter(ImageFilter.GaussianBlur(1.6))
# soft threshold: black tile -> 0, white strokes -> 255
mask = c.point(lambda v: 0 if v < 70 else 255 if v > 180 else int((v - 70) / 110 * 255))
bbox = mask.getbbox(); mask = mask.crop(bbox)
for name, col in (('logo-ink', (45, 35, 48)), ('logo-light', (239, 232, 223))):
    out = Image.new('RGBA', mask.size, col + (0,)); out.putalpha(mask)
    out.save(f'public/img/{name}.png', optimize=True)
print(mask.size)
