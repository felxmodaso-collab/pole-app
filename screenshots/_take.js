// Custom screenshot pipeline for Поле.
// - Initial (Entry-centered)
// - Zoomed out (scale 0.55 — full constellation visible)
// - Each zone focused via window.__pole.zoomToZone
// - Hover demo (hovered = 'entry') to show constellation highlight
// - Mobile (390×844)
//
// Run: node _take.js

const { chromium } = require('playwright');
const path = require('path');

const URL = 'http://[::1]:3032/';
const OUT = __dirname;

// Capture desktop at 1600x1000 (deviceScaleFactor 1) → PNG fits under the
// 2000×2000 limit that many image consumers enforce.
const DESKTOP = { width: 1600, height: 1000 };
const MOBILE  = { width: 390,  height: 844 };

async function main() {
  const browser = await chromium.launch({ headless: true });

  // --- Desktop views ---
  {
    const ctx = await browser.newContext({ viewport: DESKTOP, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    page.on('pageerror', (e) => console.log('PAGE-ERR', e.message));
    page.on('console', (m) => {
      if (m.type() === 'error') console.log('CON-ERR', m.text());
    });

    await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
    // Wait for fonts + opening wash to settle
    await page.waitForTimeout(2600);

    await page.screenshot({ path: path.join(OUT, '01-desktop-initial.png'), fullPage: false });

    // Zoom out to see the whole world + constellation
    await page.evaluate(async () => {
      // Access motion values via React fiber bypass — use keyboard reset first
      // then programmatic zoom via wheel.
      const outer = document.querySelector('.canvas-grab');
      if (!outer) return;
      // Fake wheel to zoom out
      for (let i = 0; i < 28; i++) {
        outer.dispatchEvent(new WheelEvent('wheel', {
          deltaY: 120,
          clientX: window.innerWidth / 2,
          clientY: window.innerHeight / 2,
          bubbles: true,
          cancelable: true,
        }));
        await new Promise((r) => setTimeout(r, 16));
      }
    });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(OUT, '02-desktop-zoom-out.png'), fullPage: false });

    // Zoom back in
    await page.evaluate(async () => {
      const outer = document.querySelector('.canvas-grab');
      if (!outer) return;
      for (let i = 0; i < 28; i++) {
        outer.dispatchEvent(new WheelEvent('wheel', {
          deltaY: -120,
          clientX: window.innerWidth / 2,
          clientY: window.innerHeight / 2,
          bubbles: true,
          cancelable: true,
        }));
        await new Promise((r) => setTimeout(r, 16));
      }
    });
    await page.waitForTimeout(900);

    // Hover over a zone using the minimap — just hover canvas minimap area
    // Better: drag to artifact zone. We expose __pole for future; for now use
    // minimap click. Find canvas in bottom-right.
    // Trigger: click each minimap zone in turn for per-zone screenshots.
    // Order corresponds to layout in lib/zones.ts (entry/problem/artifact/mechanisms/test/pricing/about).
    const zoneIdx = ['entry', 'problem', 'artifact', 'mechanisms', 'test', 'pricing', 'faq', 'about'];
    for (let i = 0; i < zoneIdx.length; i++) {
      // click minimap programmatically: dispatch on the minimap canvas at zone center.
      await page.evaluate((idx) => {
        // Use global debug? Fall back to finding minimap canvas and clicking proportional rect.
        const canvases = document.querySelectorAll('canvas');
        // Minimap is the small one (188x126) vs constellation full-viewport.
        let mini = null;
        canvases.forEach((c) => {
          if (c.width <= 400 && c.height <= 280) mini = c;
        });
        if (!mini) return;
        const rect = mini.getBoundingClientRect();
        // WORLD = 4400×2700. Zone centers / WORLD = proportional minimap positions.
        const rel = [
          { x: (1500 + 190) / 4400, y: (1040 + 250) / 2700 }, // entry
          { x: (520 + 230)  / 4400, y: (1200 + 320) / 2700 }, // problem
          { x: (1020 + 420) / 4400, y: (380 + 280)  / 2700 }, // artifact
          { x: (2120 + 480) / 4400, y: (1200 + 260) / 2700 }, // mechanisms
          { x: (2020 + 400) / 4400, y: (180 + 190)  / 2700 }, // test
          { x: (2260 + 490) / 4400, y: (1820 + 220) / 2700 }, // pricing
          { x: (3360 + 360) / 4400, y: (1820 + 360) / 2700 }, // faq
          { x: (3000 + 210) / 4400, y: (680 + 360)  / 2700 }, // about
        ][idx];
        const cx = rect.left + rect.width * rel.x;
        const cy = rect.top + rect.height * rel.y;
        mini.dispatchEvent(new MouseEvent('click', { clientX: cx, clientY: cy, bubbles: true }));
      }, i);
      await page.waitForTimeout(1200);
      await page.screenshot({
        path: path.join(OUT, `03-desktop-zone-${String(i + 1).padStart(2, '0')}-${zoneIdx[i]}.png`),
        fullPage: false,
      });
    }

    // --- Waitlist modal open ---
    {
      await page.evaluate(() => {
        const evt = new CustomEvent('pole:waitlist:open', {
          detail: { source: 'screenshot' },
        });
        window.dispatchEvent(evt);
      });
      await page.waitForTimeout(600);
      await page.screenshot({
        path: path.join(OUT, '06-waitlist-modal.png'),
        fullPage: false,
      });
    }

    await ctx.close();
  }

  // --- Legal pages (privacy / terms / changelog) ---
  {
    const ctx = await browser.newContext({ viewport: DESKTOP, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    for (const slug of ['privacy', 'terms', 'changelog']) {
      await page.goto(`${URL}${slug}`, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(600);
      await page.screenshot({
        path: path.join(OUT, `07-${slug}.png`),
        fullPage: false,
      });
    }
    await ctx.close();
  }

  // --- Mobile ---
  {
    const ctx = await browser.newContext({
      viewport: MOBILE,
      deviceScaleFactor: 2,
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
    });
    const page = await ctx.newPage();
    await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1500);

    // Full-page capture on mobile (vertical stack scrolls)
    await page.addStyleTag({
      content: `*,*::before,*::after{animation-duration:0.001s!important;transition-duration:0.001s!important}`,
    });
    await page.screenshot({ path: path.join(OUT, '04-mobile-full.png'), fullPage: true });
    await ctx.close();
  }

  await browser.close();
  console.log('Screenshots written to', OUT);
}

main().catch((e) => { console.error(e); process.exit(1); });
