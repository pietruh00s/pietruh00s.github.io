"""Render the 1200x630 link-preview image (assets/og.jpg). Needs Pillow and the fonts in tools/_cache."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
CACHE = ROOT / "tools" / "_cache"
W, H = 1200, 630
BG, TEXT, MUTED, ACCENT = (9, 12, 11), (238, 240, 242), (154, 161, 171), (53, 242, 167)


def font(name, size, weight, width=None):
    f = ImageFont.truetype(str(CACHE / name), size)
    f.set_variation_by_axes([weight] if width is None else [weight, width])  # Archivo axes: weight, width
    return f


def main():
    img = Image.new("RGB", (W, H), BG)

    # soft mint glow behind the text, like the hero shader
    glow = Image.new("L", (W, H), 0)
    ImageDraw.Draw(glow).ellipse((-200, 120, 700, 820), fill=70)
    glow = glow.filter(ImageFilter.GaussianBlur(160))
    img.paste(Image.new("RGB", (W, H), (20, 70, 52)), (0, 0), glow)

    # the hero cut-out, standing on the bottom edge, with a mint glow behind it like the hero shader
    halo = Image.new("L", (W, H), 0)
    ImageDraw.Draw(halo).ellipse((760, 40, 1240, 700), fill=90)
    img.paste(Image.new("RGB", (W, H), (30, 120, 88)), (0, 0), halo.filter(ImageFilter.GaussianBlur(90)))
    cut = Image.open(ROOT / "assets" / "img" / "me-cutout.webp").convert("RGBA")
    ch = H - 40
    cut = cut.resize((round(cut.width * ch / cut.height), ch), Image.LANCZOS)
    img.paste(cut, (W - cut.width - 30, H - ch), cut)

    d = ImageDraw.Draw(img)
    x = 72
    d.text((x, 150), "TECHNICAL ARTIST @ TEN SQUARE GAMES", font=font("JetBrainsMono.ttf", 22, 500), fill=MUTED)
    big = font("Archivo.ttf", 104, 800, 125)
    d.text((x, 200), "PIOTR", font=big, fill=TEXT)
    w = d.textlength("PIOTR", font=big)
    d.text((x + w, 200), "/", font=big, fill=ACCENT)
    d.text((x, 310), "OSIKA", font=big, fill=TEXT)
    d.text((x, 452), "Shaders · VFX · Tools · Unity", font=font("Archivo.ttf", 34, 500, 100), fill=(213, 217, 222))
    d.text((x, 540), "pietruh00s.github.io", font=font("JetBrainsMono.ttf", 22, 400), fill=ACCENT)

    img.save(ROOT / "assets" / "og.jpg", "JPEG", quality=88, optimize=True, progressive=True)


if __name__ == "__main__":
    main()
