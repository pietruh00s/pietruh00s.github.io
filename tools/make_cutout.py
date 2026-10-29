"""Cut Piotr out of the hero photo (alpha from a person-segmentation model) -> assets/img/me-cutout.webp.
Needs: pip install "rembg[cpu]" pillow (first run downloads the u2net_human_seg model, ~170 MB)."""
from pathlib import Path
from PIL import Image, ImageFilter
from rembg import new_session, remove

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "tools" / "_cache" / "me-hero.webp"
OUT = ROOT / "assets" / "img" / "me-cutout.webp"

im = Image.open(SRC).convert("RGB")
cut = remove(im, session=new_session("u2net_human_seg"), alpha_matting=True,
             alpha_matting_foreground_threshold=240, alpha_matting_background_threshold=12, alpha_matting_erode_size=8)
cut.putalpha(cut.getchannel("A").filter(ImageFilter.MinFilter(3)))  # erode 1px: drops the light fringe left by the white blinds
cut = cut.crop(cut.getchannel("A").getbbox())
cut.thumbnail((1400, 1400), Image.LANCZOS)
cut.save(OUT, "WEBP", quality=86, method=6)
print(OUT, cut.size, OUT.stat().st_size // 1024, "KB")
