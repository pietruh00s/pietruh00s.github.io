# Piotr Osika – portfolio

Static portfolio site, served by GitHub Pages from the `docs/` folder.

- `docs/` – the website (plain HTML/CSS/JS, no build step)
- `tools/projects.src.json` – project content (titles, descriptions, images, YouTube IDs)
- `tools/build_assets.py` – downloads/converts images to WebP and regenerates `docs/assets/js/data.js`

Local preview:

```bash
python -m http.server 5173 -d docs
```
