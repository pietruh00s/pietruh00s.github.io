# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: recruiters, art directors and lead technical artists at game studios evaluating Piotr Osika as a candidate for a full-time Technical Artist role. They arrive from a CV, a LinkedIn profile or a shared link, usually comparing several candidates, and need to judge quickly what he has shipped, what he personally did on each title, and whether his technical depth matches the role.

Freelance or B2B clients are not the primary audience; the site does not need to sell services.

## Product Purpose

A personal portfolio site for Piotr Osika, Technical Artist (Unity). It shows shipped games and older work with his concrete contribution to each, his experience, education and skills, and gives a reviewer a fast route to the next step.

Success means a reviewer (all three count equally):
- opens case studies and assesses his craft (what he did, not just the game's marketing copy);
- downloads the CV (PDF);
- reaches out via LinkedIn.

Email contact stays available but is not a primary success action.

## Positioning

A Technical Artist who covers the whole range between art and engineering, backed by shipped commercial titles across mobile, PC and consoles. All four strengths are first-class and should be visible, none subordinated to the others:

- shaders and VFX (HLSL, Shader Graph, VFX Graph, custom lighting, post-processing);
- tools and pipeline (C# Unity editor tools, workflow automation, migrations to URP and Unity 6, Unreal → Unity asset transfer);
- optimization (mobile, desktop, VR and console budgets: LODs, texture/memory budgets, mesh decimation, profiling);
- art direction and product ownership (defining a title's graphic style; Product Owner and game designer at Revulo Games, originator of House Fighters).

What a neighbouring portfolio cannot claim: commercial real-time graphics work since 2014, five studios, co-founder of Revulo Games, an M.Sc. in Civil Engineering (applied maths, structural logic), and a title (Minigolf Adventure) with 400,000+ copies sold.

## Operating Context

- Reviewers read on desktop during hiring screens and on phones from LinkedIn/messaging links; both must work.
- Links get shared on LinkedIn and messengers, so the link preview (og image/title/description) is part of the product.
- The site is maintained by Piotr himself: project content lives in `tools/projects.src.json`, regenerated into `assets/js/data.js` by `tools/build_assets.py`; the link-preview image is rendered by `tools/make_og.py`. Hosted on GitHub Pages at https://pietruh00s.github.io (repo `pietruh00s/pietruh00s.github.io`, served from the repo root).
- Content language: English.

## Capabilities and Constraints

- Static site: plain HTML/CSS/JS, no build step for the page itself, no backend.
- Case studies open as shareable deep links (`#p/<slug>`); each can hold a summary, a "What I did" list, an "About the game" block, YouTube videos, a gallery with lightbox, and breakdowns (before/after slider, silent video loop, captioned image).
- CSS/JS links carry a `?v=` query that must be bumped on change, because GitHub Pages lets browsers cache assets for 10 minutes.
- Undecided: whether a custom domain will be used; whether the old Webflow site (piotrosika.webflow.io) gets a redirect.

## Brand Commitments

- Name and wordmark: "PIOTR/OSIKA".
- Headline identity carried over from the original site: hero title "Technical Artist" with the roles line "Tech / VFX / Enviro / 3D / UI" and "If there's anything graphics-related to do in Unity – I'm in!".
- Voice: first person, casual and upbeat, plain English ("I've got your back when it comes to all graphic things in your project").

## Evidence on Hand

- Shipped/featured titles with screenshots, videos and role descriptions: Trophy Hunter, Real Boxing 3, Super Box Delivery, Minigolf Adventure, House Fighters: Total Mess, Maze Blaze, Evil Lands; older work: Cyber Pool, three Virtual Walk apps, Misc Projects, LEGO Batmobile, Ruczaj-Zaborze concepts 1–2, Blender renders (`tools/projects.src.json`, `assets/img/`).
- Résumé PDF: `assets/Piotr-Osika-Resume.pdf` (public; contains his phone number).
- Facts from the résumé: roles and dates at Ten Square Games, Vivid Games, Revulo Games, Rage Quit Games, Digital Walk & Anim Design; education at Tadeusz Kościuszko University of Technology; location Kraków / Wrocław.
- "What I did" for Super Box Delivery, Maze Blaze, Cyber Pool and Evil Lands is currently studio-level wording from the résumé, not project-specific; to be refined by Piotr.
- Absent and not to be fabricated: shader/VFX breakdown material (before/after pairs, loops, graphs) — the breakdown feature is built but empty until Piotr provides assets; testimonials or references; Medal Hunter project materials; metrics beyond those already sourced (400,000+ copies; Real Boxing 3 soft-launch figures; Trophy Hunter launch facts).

## Product Principles

1. Contribution over marketing: every project states what Piotr personally did; game descriptions support, never replace, that.
2. Fast judgement: a reviewer should grasp role, seniority and strengths within one screen, and reach a case study, the CV or LinkedIn in one click from anywhere.
3. Show the craft: where material exists, prefer evidence of technique (breakdowns, videos, before/after) over finished screenshots alone.
4. Only sourced facts: claims, numbers and dates come from Piotr, his résumé or cited public sources.
5. Easy to maintain: content changes happen in one data file plus a rebuild, without touching layout code.
