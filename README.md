<<<<<<< HEAD
# Muhammed Nabeel KK: Portfolio

Personal portfolio of **Muhammed Nabeel KK**, Full-Stack Developer and founder of [AISYNX](https://aisynx.in). Live at **https://nabeelkk.store**.

A statically exported Next.js site with a dark, editorial "engineered precision" design: pinned horizontal project scroll, scroll-scrubbed text, an interactive WebGL hero, page transitions and case-study pages for every major project.

## Stack

- **Next.js 16** (App Router, `output: 'export'`) + **TypeScript** (strict)
- **Tailwind CSS v4** with design tokens as CSS variables (`src/styles/globals.css`)
- **Framer Motion** for component motion, page transitions and layout animations
- **GSAP + ScrollTrigger** for the pinned horizontal scroll, timeline drawing and scrubbed text
- **Lenis** smooth scrolling, driven by the GSAP ticker
- **React Three Fiber + drei** for the hero particle sphere (lazy-loaded on capable desktops only)
- **EmailJS** for the contact form
- `next/font` (Inter Tight, Instrument Serif, JetBrains Mono), `lucide-react`, `react-icons`

## Scripts

```bash
npm install          # install dependencies
npm run dev          # dev server at http://localhost:3000
npm run build        # static export to ./out
npm start            # serve ./out locally (http://localhost:3000)
npm run lint         # ESLint (zero warnings allowed)
npm run typecheck    # TypeScript
npm run format       # Prettier
npm run screenshots  # re-capture live-site screenshots with Playwright
```

## Running locally

1. Use Node 20.9+ (Node 22 recommended).
2. `cp .env.example .env.local` and fill in the EmailJS values (Public key, Service ID, Template ID). The contact form shows a friendly error with a direct email link if they're missing.
3. `npm install && npm run dev`

## Updating content

Everything lives in `src/data/*.ts`. See **[CONTENT_GUIDE.md](CONTENT_GUIDE.md)** for adding projects, images, case studies and client sites.

## Deploying

### GitHub Pages (workflow included)

1. Push to the `main` branch of a GitHub repository.
2. In **Settings → Pages**, set **Source** to **GitHub Actions**.
3. In **Settings → Secrets and variables → Actions → Variables**, add:
   - `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`
   - `NEXT_PUBLIC_EMAILJS_SERVICE_ID`
   - `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`
4. Custom domain: `public/CNAME` contains `nabeelkk.store`. Point DNS at GitHub Pages (`A` records to `185.199.108.153`, `185.199.109.153`, `185.199.110.153` and `185.199.111.153`, or a `CNAME` for `www` to `<user>.github.io`), then enable **Enforce HTTPS**.
5. Without a custom domain (for example `https://nabeelkk.github.io/portfolio/`), also set the variable `NEXT_PUBLIC_BASE_PATH=/portfolio` and delete `public/CNAME`.

`.github/workflows/deploy.yml` lints, builds and publishes `out/` on every push to `main`.

### Vercel

Import the repository; no configuration is needed (Vercel detects Next.js and the static export). Add the three `NEXT_PUBLIC_EMAILJS_*` environment variables in the project settings.

## Project structure

```
src/
  app/            layout, home page, /projects/[slug], 404, sitemap, robots, OG image
  components/
    layout/       Navbar, Footer, Preloader, SmoothScroll, PageTransition, Cursor, Grain
    sections/     Hero, TechMarquee, About, Experience, FeaturedProjects, Studio,
                  ClientWebsites, MoreProjects, Skills, Services, Education, Contact, CaseStudy
    ui/           Button, Magnetic, TiltCard, SectionHeading, Tag, SplitText, Counter,
                  BrowserFrame, ScrollShot, SmartImage, GeneratedCover, Lightbox, …
    three/        HeroScene (R3F)
  data/           all content (typed)
  lib/            utils, hooks, animations, gsap, scroll, media.server (build-time images)
public/           images, project screenshots, résumé, icons, CNAME
scripts/          capture-screenshots.ts
```

## Accessibility and motion

- `prefers-reduced-motion` turns off smooth scroll, the preloader, parallax, pinning, the 3D scene and the custom cursor; content appears with simple fades.
- The custom cursor only runs on fine pointers and never blocks clicks or hides focus rings.
- Touch devices get the full animation set: hover effects play automatically when an element reaches the middle of the screen (`TouchActivator` + the `group-act:` variant, opt in with `data-activate`), cards tilt with scroll, and the 3D hero and pinned horizontal work scroll run at every size. The horizontal scroll falls back to a vertical list on very short screens (`hs` variant, under 600px tall).
- The site has a skip link, visible focus rings, semantic landmarks, labelled icon buttons and an accessible lightbox.
=======
# portfolio
responsive portfolio


https://nabeelkk.github.io/portfolio/
>>>>>>> 5def941da74afdd29d9fb7c9b121f8d90424f3e3
