# Piotr Osika – portfolio

Static portfolio site served by GitHub Pages at https://pietruh00s.github.io

- `index.html`, `assets/` – the website (plain HTML/CSS/JS, no build step)
- `tools/projects.src.json` – project content (titles, descriptions, images, YouTube IDs)
- `tools/build_assets.py` – downloads/converts images to WebP and regenerates `assets/js/data.js` (needs ffmpeg and `pip install pillow`)

Bump the `?v=` query on the CSS/JS links in `index.html` after changing them, so browsers fetch the new files.

Local preview:

```bash
python -m http.server 5173
```
