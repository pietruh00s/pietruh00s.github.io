"""Render the 1200x630 link-preview image (assets/og.jpg). Needs Pillow and the fonts in tools/_cache."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
CACHE = ROOT / "tools" / "_cache"
W, H = 1200, 630
BG, TEXT, MUTED, ACCENT = (10, 11, 13), (238, 240, 242), (154, 161, 171), (53, 242, 167)


def font(name, size, weight):
    f = ImageFont.truetype(str(CACHE / name), size)
    f.set_variation_by_axes([weight])
    return f


def main():
    img = Image.new("RGB", (W, H), BG)

    # soft mint glow behind the text, like the hero shader
    glow = Image.new("L", (W, H), 0)
    ImageDraw.Draw(glow).ellipse((-200, 120, 700, 820), fill=70)
    glow = glow.filter(ImageFilter.GaussianBlur(160))
    img.paste(Image.new("RGB", (W, H), (20, 70, 52)), (0, 0), glow)

    # portrait on the right, fading into the background on its left edge
    pw = 470
    photo = Image.open(CACHE / "me-hero.webp").convert("RGB")
    scale = max(pw / photo.width, H / photo.height)
    photo = photo.resize((round(photo.width * scale), round(photo.height * scale)), Image.LANCZOS)
    left = (photo.width - pw) * 0.62
    photo = photo.crop((round(left), 0, round(left) + pw, H))
    ramp = 160  # px of fade on the photo's left edge
    row = Image.new("L", (pw, 1))
    row.putdata([min(255, round(255 * (x / ramp) ** 1.4)) for x in range(pw)])
    fade = row.resize((pw, H))
    img.paste(photo, (W - pw, 0), fade)

    d = ImageDraw.Draw(img)
    x = 72
    d.text((x, 150), "TECHNICAL ARTIST @ TEN SQUARE GAMES", font=font("JetBrainsMono.ttf", 22, 500), fill=MUTED)
    big = font("SpaceGrotesk.ttf", 112, 700)
    d.text((x, 200), "PIOTR", font=big, fill=TEXT)
    w = d.textlength("PIOTR", font=big)
    d.text((x + w, 200), "/", font=big, fill=ACCENT)
    d.text((x, 310), "OSIKA", font=big, fill=TEXT)
    d.text((x, 452), "Shaders · VFX · Tools · Unity", font=font("SpaceGrotesk.ttf", 36, 500), fill=(213, 217, 222))
    d.text((x, 540), "pietruh00s.github.io", font=font("JetBrainsMono.ttf", 22, 400), fill=ACCENT)

    img.save(ROOT / "assets" / "og.jpg", "JPEG", quality=88, optimize=True, progressive=True)


if __name__ == "__main__":
    main()
