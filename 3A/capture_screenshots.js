// capture_screenshots.js
// Captures full-page screenshots of Ember & Origin competitors.
//
// Setup (one-time):
//   npm init -y
//   npm install -D @playwright/test
//   npx playwright install chromium
//
// Run:
//   node capture_screenshots.js

const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const TARGETS = [
  { url: 'https://bluebottlecoffee.com',                          file: 'bluebottle_home.png' },
  { url: 'https://bluebottlecoffee.com/our-coffees',              file: 'bluebottle_coffees.png' },
  { url: 'https://www.stumptowncoffee.com',                       file: 'stumptown_home.png' },
  { url: 'https://www.stumptowncoffee.com/pages/our-story',       file: 'stumptown_about.png' },
  { url: 'https://counterculturecoffee.com',                      file: 'counterculture_home.png' },
  { url: 'https://counterculturecoffee.com/pages/sustainability', file: 'counterculture_sustainability.png' },
];

const OUT_DIR = path.join(__dirname, 'screenshots');
const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

async function captureOne(browser, { url, file }) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: USER_AGENT,
    locale: 'en-US',
  });
  const page = await context.newPage();
  const outPath = path.join(OUT_DIR, file);

  try {
    console.log(`→ ${url}`);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 });
    // Settle delay for lazy-loaded hero images and JS-rendered content
    await page.waitForTimeout(4000);

    // Dismiss obvious cookie banners if present (best-effort, non-fatal)
    for (const selector of [
      'button:has-text("Accept")',
      'button:has-text("Accept all")',
      'button:has-text("I agree")',
      'button[aria-label*="accept" i]',
    ]) {
      try {
        const btn = await page.$(selector);
        if (btn) { await btn.click({ timeout: 1500 }); break; }
      } catch (_) { /* ignore */ }
    }

    await page.screenshot({ path: outPath, fullPage: true });
    console.log(`  ✓ saved ${file}`);
  } catch (err) {
    console.error(`  ✗ failed ${url}: ${err.message}`);
  } finally {
    await context.close();
  }
}

(async () => {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  try {
    for (const target of TARGETS) {
      await captureOne(browser, target);
    }
  } finally {
    await browser.close();
  }
  console.log(`\nDone. Screenshots in: ${OUT_DIR}`);
})();
