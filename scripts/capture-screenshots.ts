/**
 * Captures screenshots of every live project / client site.
 *
 *   npm run screenshots              # all targets
 *   npm run screenshots -- aisynx    # only the given slugs
 *
 * For each target it writes into public/projects/<slug>/:
 *   cover.webp   1440×900 viewport (desktop, above the fold)
 *   full.webp    full page, capped height (used by the scroll-on-hover frames)
 *   mobile.webp  390×844 viewport
 *
 * Requires Playwright's Chromium: `npx playwright install chromium`.
 * Failures are logged and skipped; the site falls back to a generated cover.
 */
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { chromium, type Browser } from 'playwright';
import sharp from 'sharp';

type Target = { slug: string; url: string; full?: boolean; wait?: number };

const TARGETS: Target[] = [
  { slug: 'aisynx', url: 'https://aisynx.in', full: true },
  { slug: 'artis-build', url: 'https://artisbuild.co.in/', full: true },
  { slug: 'last-chance', url: 'https://wearlastchance.com/', full: true },
  { slug: 'le-roland-sandse', url: 'https://lerolandsandse.com/', full: true },
  { slug: 'felancci', url: 'https://felancciperfumes.com/', full: true },
  { slug: 'coredotr', url: 'https://coredotr.in/', full: true, wait: 9000 },
  { slug: 'blend-clothing', url: 'https://blendfashion.vercel.app/', full: true, wait: 6000 },
  { slug: 'pinet-chat', url: 'https://pinet-real-time-chating-app-client.vercel.app/' },
  { slug: '3d-model-viewer', url: 'https://3-d-viewer-website.vercel.app/' },
  { slug: 'servicehub', url: 'https://service-booking-app-3pkc.vercel.app/' },
  { slug: 'pinet-banking', url: 'https://nabeelkk.github.io/Pinet-banking/' },
  { slug: 'weathernow', url: 'https://nabeelkk.github.io/Weather-App/' },
  { slug: 'pinetchatbot', url: 'https://chatbotapp-nu.vercel.app/' },
];

const OUT = path.resolve('public/projects');
const MAX_FULL_HEIGHT = 5400; // CSS px; keeps files small and below WebP limits

async function capture(browser: Browser, t: Target) {
  const dir = path.join(OUT, t.slug);
  await mkdir(dir, { recursive: true });

  const desktop = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
  });
  const page = await desktop.newPage();
  await page.goto(t.url, { waitUntil: 'networkidle', timeout: 45_000 }).catch(() => {
    /* networkidle can time out on sites with long-polling; continue with what loaded */
  });
  await page.waitForTimeout(t.wait ?? 2500);

  const cover = await page.screenshot({ type: 'png', timeout: 90_000, animations: 'disabled' });
  // Reject blank captures (e.g. sites that hide content behind a loader in headless mode).
  const stats = await sharp(cover).stats();
  if (stats.channels.every((c) => c.stdev < 3)) throw new Error('page rendered blank');
  await sharp(cover).webp({ quality: 78 }).toFile(path.join(dir, 'cover.webp'));

  if (t.full) {
    // Scroll through the page so lazy content and scroll-triggered sections render.
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.8;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 180));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(1200);
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    const full = await page.screenshot({
      type: 'png',
      timeout: 90_000,
      animations: 'disabled',
      fullPage: true,
      clip: { x: 0, y: 0, width: 1440, height: Math.min(height, MAX_FULL_HEIGHT) },
    });
    await sharp(full)
      .resize({ width: 1200 })
      .webp({ quality: 72 })
      .toFile(path.join(dir, 'full.webp'));
  }
  await desktop.close();

  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    reducedMotion: 'reduce',
  });
  const m = await mobile.newPage();
  await m.goto(t.url, { waitUntil: 'networkidle', timeout: 45_000 }).catch(() => {});
  await m.waitForTimeout(t.wait ?? 2000);
  const shot = await m.screenshot({ type: 'png', timeout: 90_000, animations: 'disabled' });
  await sharp(shot).webp({ quality: 78 }).toFile(path.join(dir, 'mobile.webp'));
  await mobile.close();
}

async function main() {
  const only = process.argv.slice(2);
  const targets = only.length ? TARGETS.filter((t) => only.includes(t.slug)) : TARGETS;
  const browser = await chromium.launch();
  const failed: string[] = [];
  for (const t of targets) {
    try {
      await capture(browser, t);
      console.log(`✓ ${t.slug}`);
    } catch (err) {
      failed.push(t.slug);
      console.error(`✗ ${t.slug}: ${(err as Error).message.split('\n')[0]}`);
    }
  }
  await browser.close();
  if (failed.length) console.log(`\nFailed: ${failed.join(', ')}`);
}

void main();
