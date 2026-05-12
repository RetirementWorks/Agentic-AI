// analyze_competitors.js
// Scrapes each competitor page, sends the text to OpenAI, and saves a structured
// analysis JSON that build_report.js will consume to generate the Word doc.
//
// Setup:
//   npm install openai @playwright/test
//   npx playwright install chromium
//   export OPENAI_API_KEY=sk-...
//
// Run:
//   node analyze_competitors.js

const { chromium } = require('@playwright/test');
const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');

const openai = new OpenAI({ apiKey: process.env.OPEN_AI_API });

const MODEL = process.env.OPENAI_MODEL || 'gpt-4o';

const BRAND = {
  name: 'Ember & Origin',
  tagline: 'Single-origin, small-batch, roasted with intention.',
  audience: 'Coffee enthusiasts who value origin, process, and sustainability.',
};

const COMPETITORS = [
  {
    name: 'Blue Bottle Coffee',
    pages: [
      { kind: 'homepage', url: 'https://bluebottlecoffee.com' },
      { kind: 'products', url: 'https://bluebottlecoffee.com/our-coffees' },
    ],
  },
  {
    name: 'Stumptown Coffee',
    pages: [
      { kind: 'homepage', url: 'https://www.stumptowncoffee.com' },
      { kind: 'about',    url: 'https://www.stumptowncoffee.com/pages/our-story' },
    ],
  },
  {
    name: 'Counter Culture Coffee',
    pages: [
      { kind: 'homepage',       url: 'https://counterculturecoffee.com' },
      { kind: 'sustainability', url: 'https://counterculturecoffee.com/pages/sustainability' },
    ],
  },
];

const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

async function scrapePage(browser, url) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: USER_AGENT,
    locale: 'en-US',
  });
  const page = await context.newPage();
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 });
    await page.waitForTimeout(4000);
    // Pull visible text only — strips scripts/styles/nav noise reasonably well
    const text = await page.evaluate(() => {
      const drop = ['script', 'style', 'noscript', 'svg'];
      drop.forEach(tag => document.querySelectorAll(tag).forEach(el => el.remove()));
      return document.body.innerText || '';
    });
    const title = await page.title();
    return { ok: true, title, text: text.replace(/\n{3,}/g, '\n\n').trim().slice(0, 18_000) };
  } catch (err) {
    return { ok: false, error: err.message };
  } finally {
    await context.close();
  }
}

async function scrapeAll() {
  const browser = await chromium.launch({ headless: true });
  const results = [];
  try {
    for (const comp of COMPETITORS) {
      const scraped = { name: comp.name, pages: [] };
      for (const p of comp.pages) {
        console.log(`Scraping ${comp.name} (${p.kind}) ${p.url}`);
        const r = await scrapePage(browser, p.url);
        scraped.pages.push({ kind: p.kind, url: p.url, ...r });
      }
      results.push(scraped);
    }
  } finally {
    await browser.close();
  }
  return results;
}

function buildPrompt(brand, scraped) {
  const competitorBlocks = scraped.map(c => {
    const pages = c.pages.map(p =>
      `--- ${c.name} :: ${p.kind} (${p.url}) ---\nTitle: ${p.title || 'N/A'}\n\n${p.ok ? p.text : `[scrape failed: ${p.error}]`}`
    ).join('\n\n');
    return pages;
  }).join('\n\n========\n\n');

  return `You are a brand strategist running a competitive teardown for a new artisan coffee roastery.

NEW BRAND
- Name: ${brand.name}
- Tagline: ${brand.tagline}
- Audience: ${brand.audience}

COMPETITORS (raw scraped homepage + one key page each)
${competitorBlocks}

TASK
Return a single JSON object with EXACTLY this shape:

{
  "executive_summary": "2-3 paragraph plain-English overview of the competitive landscape and the strategic opening for ${brand.name}.",
  "matrix": [
    {
      "competitor": "Blue Bottle Coffee",
      "positioning": "...",
      "core_message": "...",
      "product_differentiation": "...",
      "sustainability_claims": "...",
      "website_ux": "...",
      "gaps": "..."
    },
    { ... same shape for Stumptown ... },
    { ... same shape for Counter Culture ... }
  ],
  "key_takeaways": [
    { "label": "Short bold label.", "text": "One-sentence elaboration." }
    // 4-6 items
  ],
  "differentiation_strategies": [
    {
      "title": "Strategy 1 — ...",
      "rationale": "Why this works given competitor gaps.",
      "proof_artifact": "Concrete artifact/asset that makes the strategy credible."
    }
    // exactly 5 items
  ],
  "content_calendar": [
    {
      "week": "Week 1",
      "theme": "...",
      "blog": "...",
      "email": "...",
      "social": "..."
    }
    // exactly 4 items, focused on origin transparency, craft roasting, sustainability
  ],
  "next_steps": [
    "Action item 1.",
    "Action item 2."
    // 4-6 items
  ]
}

RULES
- Be specific, evidence-based, and reference what the scraped pages actually say.
- Avoid marketing-speak. Write the way a senior strategist talks to a founder.
- No preamble or commentary outside the JSON.
- Output VALID JSON. No trailing commas. No code fences.`;
}

async function analyze(scraped) {
  const prompt = buildPrompt(BRAND, scraped);
  console.log(`\nSending to OpenAI (${MODEL})...`);
  const completion = await openai.chat.completions.create({
    model: MODEL,
    response_format: { type: 'json_object' },
    temperature: 0.4,
    messages: [
      { role: 'system', content: 'You are a senior brand strategist. Return strict JSON.' },
      { role: 'user', content: prompt },
    ],
  });
  const raw = completion.choices[0].message.content;
  return JSON.parse(raw);
}

(async () => {
  if (!process.env.OPEN_AI_API) {
    console.error('Missing OPEN_AI_API env var.');
    process.exit(1);
  }
  const scraped = await scrapeAll();
  fs.writeFileSync('scraped_raw.json', JSON.stringify(scraped, null, 2));
  console.log('Saved scraped_raw.json');

  const analysis = await analyze(scraped);
  fs.writeFileSync('analysis.json', JSON.stringify(analysis, null, 2));
  console.log('Saved analysis.json');
  console.log('\nDone. Next: node build_report.js');
})();
