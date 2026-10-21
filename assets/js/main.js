const PROJECTS = window.PROJECTS || [];
const PLATFORM = { ios: "iOS", android: "Android", switch: "Switch", xbox: "Xbox", playstation: "PlayStation", windows: "Windows", steam: "Steam" };
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, el = document) => el.querySelector(s);
const esc = (s = "") => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/* ---------- hero shader ---------- */
function initShader() {
  const canvas = $(".hero__gl");
  const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
  if (!gl) { canvas.style.background = "radial-gradient(circle at 70% 30%, #10382a, #0a0b0d 60%)"; return; }

  const vs = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0., 1.); }`;
  const fs = `
    precision mediump float;
    uniform vec2 r; uniform float t; uniform vec2 m;
    float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
      return mix(mix(h(i), h(i+vec2(1,0)), f.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), f.x), f.y); }
    float fbm(vec2 p){ float v = 0., a = .5; for(int i = 0; i < 5; i++){ v += a*n(p); p = p*2.03 + 1.7; a *= .5; } return v; }
    void main(){
      vec2 uv = gl_FragCoord.xy / r; vec2 p = (gl_FragCoord.xy - .5*r) / r.y;
      vec2 mm = (m - .5) * vec2(r.x/r.y, 1.);
      float tt = t * .06;
      vec2 q = vec2(fbm(p*1.6 + tt), fbm(p*1.6 - tt + 3.1));
      vec2 w = vec2(fbm(p*1.4 + 2.*q + vec2(1.7, 9.2) + tt*1.3), fbm(p*1.4 + 2.*q + vec2(8.3, 2.8) - tt));
      float f = fbm(p*1.2 + 2.4*w + .35*mm);
      float d = length(p - mm);
      vec3 base = vec3(.039, .043, .051);
      vec3 mint = vec3(.21, .95, .65);
      vec3 warm = vec3(1., .54, .24);
      vec3 col = base;
      col = mix(col, vec3(.05, .16, .13), smoothstep(.2, .8, f));
      col = mix(col, mint, .55 * smoothstep(.62, .95, f) * (.6 + .4*w.x));
      col = mix(col, warm, .38 * smoothstep(.7, 1., w.y) * smoothstep(.45, .9, f));
      col += .06 * mint * exp(-3.5*d);
      float lines = smoothstep(.48, .5, abs(fract(f*9.) - .5)) * .05;
      col += lines * mint;
      col *= .55 + .45*smoothstep(0., .7, uv.x);
      gl_FragColor = vec4(col, 1.);
    }`;
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, vs));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "p");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const uR = gl.getUniformLocation(prog, "r"), uT = gl.getUniformLocation(prog, "t"), uM = gl.getUniformLocation(prog, "m");

  const scale = 0.5; // render at half res – it's soft noise, nobody will notice
  const mouse = { x: .7, y: .6, tx: .7, ty: .6 };
  const resize = () => {
    canvas.width = Math.max(1, canvas.clientWidth * scale);
    canvas.height = Math.max(1, canvas.clientHeight * scale);
    gl.viewport(0, 0, canvas.width, canvas.height);
  };
  addEventListener("resize", resize); resize();
  addEventListener("pointermove", e => { mouse.tx = e.clientX / innerWidth; mouse.ty = 1 - e.clientY / innerHeight; }, { passive: true });

  const stats = $(".stats");
  let visible = true, frames = 0, last = performance.now(), start = last;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) requestAnimationFrame(loop); }).observe(canvas);

  function draw(now) {
    mouse.x += (mouse.tx - mouse.x) * .04; mouse.y += (mouse.ty - mouse.y) * .04;
    gl.uniform2f(uR, canvas.width, canvas.height);
    gl.uniform1f(uT, (now - start) / 1000 + 20);
    gl.uniform2f(uM, mouse.x, mouse.y);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  function loop(now) {
    if (!visible) return;
    draw(now);
    frames++;
    if (now - last > 500) {
      const fps = Math.round(frames * 1000 / (now - last));
      // background tabs get throttled – don't show those numbers
      if (fps >= 15) stats.textContent = `${fps} fps · ${(1000 / fps).toFixed(1)} ms`;
      frames = 0; last = now;
    }
    requestAnimationFrame(loop);
  }
  if (reduceMotion) { draw(start); stats.textContent = "paused"; }
  else requestAnimationFrame(loop);
}

/* ---------- project lists ---------- */
const platsHTML = p => p.platforms?.length
  ? `<ul class="plats" aria-label="Platforms">${p.platforms.map(k => `<li>${PLATFORM[k]}</li>`).join("")}</ul>` : "";
const metaLine = p => [p.studio, p.period].filter(Boolean).join(" · ");

function renderLists() {
  const featured = PROJECTS.filter(p => p.group === "featured");
  const other = PROJECTS.filter(p => p.group === "other");

  $('[data-group="featured"]').innerHTML = featured.map((p, i) => `
    <a class="card reveal" href="#p/${p.slug}" style="--d:${(i % 3) * .08}s">
      <div class="card__media"><img src="${p.imgs[0]}-sm.webp" srcset="${p.imgs[0]}-sm.webp 900w, ${p.imgs[0]}.webp 1920w" sizes="(max-width: 640px) 100vw, 60vw" alt="" loading="${i < 2 ? "eager" : "lazy"}"></div>
      ${p.stat ? `<span class="card__badge mono">${esc(p.stat)}</span>` : ""}
      <span class="card__go" aria-hidden="true">→</span>
      <div class="card__body">
        <div class="card__meta mono"><span>${esc(metaLine(p))}</span></div>
        <h3 class="card__title">${esc(p.title)} ${p.emoji}</h3>
        <p class="card__role">${esc(p.role)}</p>
        ${platsHTML(p)}
      </div>
    </a>`).join("");

  $('[data-group="other"]').innerHTML = other.map((p, i) => `
    <a class="tile reveal" href="#p/${p.slug}" style="--d:${(i % 4) * .06}s">
      <div class="tile__media"><img src="${p.imgs[0]}-sm.webp" alt="" loading="lazy"></div>
      <h3 class="tile__title">${esc(p.title)} ${p.emoji}</h3>
      <p class="tile__meta mono">${esc(p.role)}</p>
    </a>`).join("");
}

/* ---------- case study ---------- */
const dialog = $(".case");
const body = $(".case__body");
let current = null, returnFocus = null;

function caseHTML(p) {
  const list = p.bullets?.length ? `
    <h2>${p.slug === "house-fighters" ? "My role" : "What I did"}</h2>
    ${p.intro ? `<p class="case__summary">${esc(p.intro)}</p>` : ""}
    <ol class="case__list">${p.bullets.map(b => `<li>${b}</li>`).join("")}</ol>` : "";
  const about = p.about ? `
    <section class="case__about">
      <h2>About the game</h2>
      <p class="case__summary">${esc(p.about.lead)}</p>
      ${(p.about.paras || []).map(t => `<p>${esc(t)}</p>`).join("")}
      ${p.about.features ? `<div class="case__feats">${p.about.features.map(([t, d]) => `<div><b>${esc(t)}</b><p>${esc(d)}</p></div>`).join("")}</div>` : ""}
    </section>` : "";
  const videos = p.yt?.length ? `
    <h2>Videos</h2>
    <div class="videos">${p.yt.map(id => `
      <button class="yt" type="button" data-yt="${id}" aria-label="Play video">
        <img src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" alt="" loading="lazy">
      </button>`).join("")}</div>` : "";
  const gallery = p.imgs.length > 1 ? `
    <h2>Gallery</h2>
    <div class="gallery">${p.imgs.map((src, i) => `
      <button type="button" data-lb="${i}" aria-label="Open image ${i + 1} of ${p.imgs.length}">
        <img src="${src}-sm.webp" alt="" loading="lazy">
      </button>`).join("")}</div>` : "";

  return `
    <div class="case__hero"><img src="${p.imgs[0]}.webp" alt="${esc(p.title)} key art"></div>
    <div class="wrap">
      <header class="case__head">
        <p class="mono idx">${esc(metaLine(p) || "Project")}</p>
        <h1 id="case-title">${esc(p.title)} ${p.emoji}</h1>
        <p class="case__role mono">${esc(p.role)}</p>
      </header>
      <div class="case__cols">
        <div>
          <p class="case__summary">${esc(p.summary)}</p>
          ${list}
        </div>
        <dl class="case__info">
          ${p.studio ? `<div><dt class="mono">Studio</dt><dd>${esc(p.studio)}</dd></div>` : ""}
          ${p.period ? `<div><dt class="mono">When</dt><dd>${esc(p.period)}</dd></div>` : ""}
          <div><dt class="mono">Role</dt><dd>${esc(p.role)}</dd></div>
          ${p.platforms?.length ? `<div><dt class="mono">Platforms</dt><dd>${platsHTML(p)}</dd></div>` : ""}
          ${p.website ? `<div><a class="btn btn--ghost" href="${p.website}" target="_blank" rel="noopener">Website ↗</a></div>` : ""}
        </dl>
      </div>
      ${videos}
      ${gallery}
      ${about}
      <footer class="case__foot">
        <p>Do you want to know more? 🤙</p>
        <a class="btn btn--primary" href="mailto:piotr_osika@interia.eu?subject=${encodeURIComponent(p.title)}">Contact me</a>
      </footer>
    </div>`;
}

function openCase(slug) {
  const i = PROJECTS.findIndex(p => p.slug === slug);
  if (i < 0) return closeCase(true);
  current = PROJECTS[i];
  body.innerHTML = caseHTML(current);
  const prev = PROJECTS[(i - 1 + PROJECTS.length) % PROJECTS.length];
  const next = PROJECTS[(i + 1) % PROJECTS.length];
  $(".case__prev").href = `#p/${prev.slug}`; $(".case__prev").title = prev.title;
  $(".case__next").href = `#p/${next.slug}`; $(".case__next").title = next.title;
  document.title = `${current.title} – Piotr Osika`;
  if (!dialog.open) {
    returnFocus = document.activeElement;
    dialog.showModal();
    document.body.classList.add("locked");
  }
  dialog.scrollTop = 0;
  $(".case__close").focus({ preventScroll: true });
}

function closeCase(fromRoute) {
  if (dialog.open) dialog.close();
  document.body.classList.remove("locked");
  document.title = "Piotr Osika – Technical Artist";
  body.innerHTML = "";
  current = null;
  if (!fromRoute && location.hash.startsWith("#p/")) history.pushState("", "", location.pathname + location.search);
  returnFocus?.focus?.({ preventScroll: true });
}

function route() {
  const m = location.hash.match(/^#p\/([\w-]+)/);
  if (m) openCase(m[1]);
  else if (dialog.open) closeCase(true);
}

dialog.addEventListener("cancel", e => { e.preventDefault(); if (lightbox.hidden) closeCase(); });
$(".case__close").addEventListener("click", () => closeCase());
body.addEventListener("click", e => {
  const yt = e.target.closest("[data-yt]");
  if (yt) {
    yt.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${yt.dataset.yt}?autoplay=1&rel=0" title="YouTube video" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
    yt.removeAttribute("data-yt");
    return;
  }
  const lb = e.target.closest("[data-lb]");
  if (lb) openLightbox(+lb.dataset.lb);
});

/* ---------- lightbox ---------- */
const lightbox = $(".lightbox");
const lbImg = $("img", lightbox);
let lbIndex = 0;
function showLb(i) {
  const imgs = current.imgs;
  lbIndex = (i + imgs.length) % imgs.length;
  lbImg.src = `${imgs[lbIndex]}.webp`;
  lbImg.alt = `${current.title} – image ${lbIndex + 1}`;
  $(".lightbox__count").textContent = `${lbIndex + 1} / ${imgs.length}`;
}
function openLightbox(i) {
  showLb(i);
  dialog.append(lightbox); // keep it inside the modal's top layer
  lightbox.hidden = false;
  $(".lightbox__close").focus();
}
function closeLightbox() {
  lightbox.hidden = true;
  body.querySelector(`[data-lb="${lbIndex}"]`)?.focus({ preventScroll: true });
}
$(".lightbox__close").addEventListener("click", closeLightbox);
$(".lightbox__prev").addEventListener("click", () => showLb(lbIndex - 1));
$(".lightbox__next").addEventListener("click", () => showLb(lbIndex + 1));
lightbox.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });
addEventListener("keydown", e => {
  if (lightbox.hidden) return;
  if (e.key === "Escape") { e.preventDefault(); closeLightbox(); }
  if (e.key === "ArrowLeft") showLb(lbIndex - 1);
  if (e.key === "ArrowRight") showLb(lbIndex + 1);
});
let touchX = null;
lightbox.addEventListener("touchstart", e => { touchX = e.touches[0].clientX; }, { passive: true });
lightbox.addEventListener("touchend", e => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 40) showLb(lbIndex + (dx < 0 ? 1 : -1));
  touchX = null;
});

/* ---------- misc ---------- */
function initReveal() {
  const els = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) { els.forEach(el => el.classList.add("in")); return; }
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { rootMargin: "0px 0px -8% 0px" });
  els.forEach(el => io.observe(el));
}

function initNavSpy() {
  const links = [...document.querySelectorAll(".nav__links a")];
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    links.forEach(a => a.classList.toggle("is-active", a.getAttribute("href") === `#${e.target.id}`));
  }), { rootMargin: "-45% 0px -50% 0px" });
  document.querySelectorAll("main section[id]").forEach(s => io.observe(s));
}

document.querySelectorAll("[data-copy]").forEach(btn => btn.addEventListener("click", async () => {
  try { await navigator.clipboard.writeText(btn.dataset.copy); btn.textContent = "Copied ✓"; }
  catch { btn.textContent = "Select & copy"; }
  setTimeout(() => (btn.textContent = "Copy"), 1800);
}));
$(".year").textContent = new Date().getFullYear();

renderLists();
initReveal();
initNavSpy();
initShader();
addEventListener("hashchange", route);
route();
