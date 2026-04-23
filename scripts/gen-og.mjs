// Generate static OG image (1200x630) for gh-pages. Replaces the dynamic
// /opengraph-image route which relies on edge runtime.
import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "public", "og-image.png");

const html = `<!doctype html><html><head>
<meta charset="utf-8"/>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=DM+Serif+Display:ital@0;1&display=swap');
  html,body{margin:0;padding:0;width:1200px;height:630px;background:#1e2a2e;overflow:hidden;box-sizing:border-box;}
  body{
    position:relative;
    display:flex;flex-direction:column;justify-content:space-between;
    padding:54px 72px 62px;
    font-family:'Inter',system-ui,sans-serif;
    color:#f0e6d2;
    box-sizing:border-box;
  }
  .brand{font-family:'DM Serif Display',serif;font-size:38px;letter-spacing:-0.01em;line-height:1;}
  .meta{font-family:'Inter',monospace;font-size:13px;letter-spacing:.22em;text-transform:uppercase;color:#8897a2;margin-top:6px;}
  .hero{font-family:'DM Serif Display',serif;font-size:78px;line-height:1.0;letter-spacing:-0.022em;max-width:1060px;}
  .hero em{font-style:italic;color:#a8c8a0;}
  .sub{font-size:20px;line-height:1.45;color:#c9bfa8;max-width:820px;margin-top:20px;}
  svg{position:absolute;inset:0;pointer-events:none;}
</style>
</head><body>
  <svg width="1200" height="630" viewBox="0 0 1200 630">
    <g fill="none" stroke="rgba(168,200,160,0.28)" stroke-width="1">
      <path d="M 740 240 Q 900 260, 1060 330" />
      <path d="M 640 440 Q 840 360, 1030 520" />
      <path d="M 980 180 Q 1060 260, 1090 340" />
    </g>
    <g fill="#a8c8a0">
      <circle cx="740" cy="240" r="4" opacity="0.85"/>
      <circle cx="1060" cy="330" r="4" opacity="0.7"/>
      <circle cx="640" cy="440" r="3.5" opacity="0.65"/>
      <circle cx="1030" cy="520" r="3.5" opacity="0.6"/>
      <circle cx="980" cy="180" r="3" opacity="0.55"/>
      <circle cx="1090" cy="340" r="2.5" opacity="0.5"/>
    </g>
  </svg>

  <div>
    <div class="brand">Поле</div>
    <div class="meta">pole.app</div>
  </div>

  <div>
    <div class="hero">
      Инструмент для<br/>книги <em>длиной в год.</em>
    </div>
    <div class="sub">Пространство для длинного нон-фикшн. Источники, аргумент и черновики глав — в одном холсте.</div>
  </div>
</body></html>`;

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});
const page = await ctx.newPage();
await page.setContent(html, { waitUntil: "networkidle" });
await page.waitForTimeout(600);
await page.screenshot({ path: OUT, fullPage: false });
await browser.close();

console.log(`OG saved → ${OUT}`);
