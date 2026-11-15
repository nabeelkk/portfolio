# Content guide

All site content lives in typed files under `src/data/`. You never need to touch a component to update text, projects, links or images.

| File | What it controls |
|---|---|
| `profile.ts` | Name, title, contact links, hero copy, summary, About counters (`stats`), AISYNX details |
| `experience.ts` | Experience timeline (newest first) |
| `projects.ts` | Featured projects, More Work grid, case studies, client websites |
| `skills.ts` | Skills bento grid and the tech marquee rows |
| `services.ts` | "What I do" rows, AISYNX service chips, the 5-step process and client wordmarks |
| `education.ts` | Education cards |

After editing, run `npm run dev` to preview, then `npm run build` to check that everything compiles.

## Placeholders

Any value of `"TODO"` (for example `period: 'TODO'` in `experience.ts`) is **hidden in the UI**. Replace it with real text and it appears automatically.

## Projects (`src/data/projects.ts`)

Each entry is a `Project` (types in `src/data/types.ts`). The important fields:

- `slug`: URL and image folder name (`/projects/<slug>/`, `public/projects/<slug>/`)
- `featuredOrder`: set a number to show it in **Selected Work** (lower comes first). Leave it out to put the project in **More Work**.
- `filter`: `'fullstack' | 'frontend' | 'clones'`, used by the More Work filter buttons
- `status`: `'live' | 'in-development' | 'completed'`, which drives the status badge
- `kind`: `'own-company' | 'aisynx-product' | 'client' | 'personal'`, which drives the type badge
- `links.live` / `links.github`: a button is shown only when its URL is set
- `builtSoFar` / `planned`: for in-development products, shown separately on the case-study page
- `modules`: ERP module names, which animate as a "system scope" grid
- `statusNote`: a short honest status line shown under the image
- `caseStudy`: when present, a `/projects/<slug>/` page is generated and "Case study →" buttons appear

### Adding a project

1. Copy an existing entry in `projects.ts` and change the fields.
2. Create `public/projects/<slug>/` and add images (see below).
3. Run `npm run build`.

### Removing a project

Delete its entry from `projects.ts` (and optionally its `public/projects/<slug>/` folder).

## Images

Images are resolved **at build time**, so a missing file never shows as a broken image. When a project has no images, a generated cover is used instead (dark card, grid, name, stack chips).

For each project, these files in `public/projects/<slug>/` are picked up automatically:

| File | Used for |
|---|---|
| `cover.webp` | Main card / case-study image (a real screenshot) |
| `mobile.webp` | Mobile screenshot (crossfades on hover, appears in the gallery) |
| `full.webp` | Tall full-page screenshot (scroll-on-hover frames) |
| `1.webp`, `2.webp`, … | Extra gallery images, in numeric order |

You can also list images explicitly in the project's `images` array, for example design concepts:

```ts
img('remora', 'remora-mobile.webp', 'Remora mobile app design concept', 850, 1850, { concept: true, variant: 'mobile' }),
```

- `concept: true` adds the "Design concept · sample data" label. **Use it for any mock-up that isn't a real production screenshot.**
- `variant: 'mobile'` marks the image that crossfades in on hover.
- Width and height must be the real pixel size (they prevent layout shift).

Tips: use WebP, about 1600–2000px wide for desktop shots (`cwebp -q 80 in.png -o out.webp`).

### Re-capturing screenshots of live sites

```bash
npx playwright install chromium   # once
npm run screenshots               # all targets
npm run screenshots -- aisynx     # just one
```

Targets are listed at the top of `scripts/capture-screenshots.ts`. Blank captures (sites that hide content behind a loader) are rejected automatically.

## Client websites

Edit the `clientSites` array at the bottom of `projects.ts`. Each client's image comes from its `image` field, or from `public/projects/<slug>/cover.webp` and `full.webp`. A tall `full.webp` enables the scroll-on-hover effect.

## Résumé

Replace `public/Muhammed_Nabeel_KK_Resume.pdf` (keep the file name, or update `profile.resume`).

## Honesty rules (keep these)

- Label design concepts as concepts, and keep "In development" on products that aren't shipped.
- Don't use AISYNX marketing stats (client counts, countries, retention) in this portfolio. Only claims that are true for you personally.
