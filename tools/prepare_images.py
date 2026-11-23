"""Turns the raw Instagram frames in assets/ig into web images: public/img/<id>.webp (<=1800px) and public/img/t/<id>.webp (760px)."""
import glob, os
from PIL import Image
os.makedirs('public/img/t', exist_ok=True)
for f in sorted(glob.glob('assets/ig/*.jpg')):
    i = os.path.basename(f)[:-4]
    im = Image.open(f).convert('RGB')
    big = im.copy(); big.thumbnail((1800, 1800), Image.LANCZOS)
    big.save(f'public/img/{i}.webp', quality=80, method=6)
    t = im.copy(); t.thumbnail((760, 760 * 2), Image.LANCZOS)
    if t.width > 760: t = t.resize((760, int(t.height * 760 / t.width)), Image.LANCZOS)
    t.save(f'public/img/t/{i}.webp', quality=74, method=6)
    print(i, im.size)
