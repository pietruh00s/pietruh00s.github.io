# Piotr Osika – portfolio

Static portfolio site served by GitHub Pages at https://pietruh00s.github.io

- `index.html`, `assets/` – the website (plain HTML/CSS/JS, no build step)
- `tools/projects.src.json` – project content (titles, descriptions, images, YouTube IDs)
- `tools/build_assets.py` – downloads/converts images to WebP and regenerates `assets/js/data.js` (needs ffmpeg and `pip install pillow`)

Bump the `?v=` query on the CSS/JS links in `index.html` after changing them, so browsers fetch the new files.

## Breakdowns (shader / VFX showcases)

Add a `breakdowns` list to a project in `tools/projects.src.json`, put the files under `assets/breakdowns/<slug>/`, then run `python tools/build_assets.py`:

```json
"breakdowns": [
  { "type": "compare", "before": "assets/breakdowns/minigolf-adventure/grass-off.webp",
    "after": "assets/breakdowns/minigolf-adventure/grass-on.webp",
    "beforeLabel": "Default", "afterLabel": "Custom shader", "ratio": "16 / 9",
    "title": "Stylized vegetation shader", "text": "Wind, ball interaction and color variation in a single pass." },
  { "type": "video", "src": "assets/breakdowns/minigolf-adventure/force-field.mp4",
    "poster": "assets/breakdowns/minigolf-adventure/force-field.webp",
    "title": "Force field VFX", "text": "Shader Graph + particle system, under 0.2 ms on Switch." },
  { "type": "image", "src": "assets/breakdowns/minigolf-adventure/graph.webp", "title": "Shader graph overview" }
]
```

- `compare` – before/after slider; both images should be the same size.
- `video` – plays as a silent loop (keep it short, H.264 MP4, ideally under ~5 MB).
- `image` – a single image with a caption.

Local preview:

```bash
python -m http.server 5173
```
