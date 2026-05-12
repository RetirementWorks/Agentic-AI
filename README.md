# Ember & Origin — Competitive Analysis Pipeline

A fully automated system that researches your competitors, analyzes them with AI, and produces a polished Word document report — all with a single command.

---

## Table of Contents

1. [What This System Does](#what-this-system-does)
2. [How It Was Built](#how-it-was-built)
3. [System Architecture](#system-architecture)
4. [File Reference](#file-reference)
5. [Setup](#setup)
6. [How to Run](#how-to-run)
7. [What to Expect](#what-to-expect)
8. [Output Files](#output-files)
9. [Configuration & Customization](#configuration--customization)
10. [Troubleshooting](#troubleshooting)

---

## What This System Does

This pipeline performs a full competitive analysis for **Ember & Origin**, a new artisan coffee roastery, against three established competitors:

- Blue Bottle Coffee
- Stumptown Coffee
- Counter Culture Coffee

It automatically:
1. **Captures full-page screenshots** of each competitor's website
2. **Scrapes the visible text** from each competitor's homepage and one key page
3. **Sends the scraped content to OpenAI GPT-4o** with a structured prompt asking for a brand strategist's analysis
4. **Renders a formatted Word document** from the AI's response, including a comparison matrix, differentiation strategies, a content calendar, and recommended next steps

No manual research. No copy-pasting. One command does it all.

---

## How It Was Built

This system was designed and built as a three-stage pipeline using AI-assisted development:

### The Idea
The goal was to automate a competitive teardown — something that would normally take a brand strategist several hours — into a repeatable, one-click process. The brand in focus is **Ember & Origin**, a fictional single-origin coffee roastery used as a case study.

### The Tools Chosen
- **Playwright** — a browser automation library that can open real websites, wait for them to fully load, dismiss cookie banners, and extract clean text or screenshots. It's the same tool used for end-to-end testing of web apps, repurposed here for scraping.
- **OpenAI GPT-4o** — the AI model that receives the scraped competitor text and returns a structured JSON analysis. The prompt was carefully engineered to enforce a specific JSON schema so the downstream report builder always gets predictable data.
- **docx** — a Node.js library for generating Microsoft Word documents programmatically. It handles headings, tables, bullet points, fonts, colors, and page layout entirely in code.

### The Development Process
The pipeline was built in three independent scripts, each responsible for one stage:
1. `capture_screenshots.js` was written first to validate that Playwright could reliably load and screenshot competitor sites, handling edge cases like cookie banners.
2. `analyze_competitors.js` was built next, combining the Playwright scraper with an OpenAI call. The prompt was structured to return strict JSON matching a predefined schema, so the report builder would never need to guess field names.
3. `build_report.js` was built last, consuming the JSON and producing a branded Word document with tables, styled headings, and a content calendar.
4. Finally, `main.js` was added as an orchestrator — a single entry point that runs all three scripts in sequence, validates the API key upfront, and stops with a clear error message if any step fails.

---

## System Architecture

```
main.js  (orchestrator — run this)
   │
   ├── 1. capture_screenshots.js
   │         │
   │         └── Playwright (headless Chrome)
   │                  └── screenshots/*.png  (6 files)
   │
   ├── 2. analyze_competitors.js
   │         │
   │         ├── Playwright (headless Chrome)
   │         │        └── scraped_raw.json  (raw text from 6 pages)
   │         │
   │         └── OpenAI GPT-4o
   │                  └── analysis.json  (structured analysis)
   │
   └── 3. build_report.js
             │
             └── docx library
                      └── Ember_and_Origin_Competitive_Analysis.docx
```

Each stage runs sequentially. If one fails, the pipeline stops and reports which step failed.

---

## File Reference

| File | Purpose |
|------|---------|
| `main.js` | Single entry point — runs all three scripts in order |
| `capture_screenshots.js` | Opens each competitor URL in a headless browser and saves a full-page PNG |
| `analyze_competitors.js` | Scrapes page text and sends it to OpenAI; writes `analysis.json` |
| `build_report.js` | Reads `analysis.json` and renders the Word document |
| `analysis.json` | AI-generated structured analysis (created at runtime) |
| `scraped_raw.json` | Raw scraped text for debugging (created at runtime) |
| `results.txt` | Log of the last pipeline run with all intermediate steps |
| `Ember_and_Origin_Competitive_Analysis.docx` | Final output report (created at runtime) |
| `screenshots/` | Folder containing 6 full-page PNG screenshots (created at runtime) |

---

## Setup

### Prerequisites

- [Node.js](https://nodejs.org) v18 or later
- An OpenAI API key stored in an environment variable called `OPEN_AI_API`

### Install Dependencies

Run these commands once in the project folder:

```powershell
npm init -y
npm install openai @playwright/test docx
npx playwright install chromium
```

### Set Your API Key

**Windows PowerShell (current session only):**
```powershell
$env:OPEN_AI_API = "sk-..."
```

**Windows — permanent (System Environment Variables):**
1. Open Start → search "Environment Variables"
2. Click "Edit the system environment variables"
3. Under "User variables", click New
4. Variable name: `OPEN_AI_API`
5. Variable value: your key

---

## How to Run

Once setup is complete, run the entire pipeline with a single command:

```powershell
node main.js
```

That's it. `main.js` handles everything else automatically.

### Running Individual Steps

You can also run each step on its own if needed:

```powershell
# Screenshots only
node capture_screenshots.js

# Scrape + AI analysis only (requires OPEN_AI_API to be set)
node analyze_competitors.js

# Build Word doc only (requires analysis.json to already exist)
node build_report.js
```

---

## What to Expect

The full pipeline takes **3–5 minutes**. Here is what you will see:

```
=== Running capture_screenshots.js ===
→ https://bluebottlecoffee.com
  ✓ saved bluebottle_home.png
→ https://bluebottlecoffee.com/our-coffees
  ✓ saved bluebottle_coffees.png
→ https://www.stumptowncoffee.com
  ✓ saved stumptown_home.png
→ https://www.stumptowncoffee.com/pages/our-story
  ✓ saved stumptown_about.png
→ https://counterculturecoffee.com
  ✓ saved counterculture_home.png
→ https://counterculturecoffee.com/pages/sustainability
  ✓ saved counterculture_sustainability.png
Done. Screenshots in: .\screenshots

=== Running analyze_competitors.js ===
Scraping Blue Bottle Coffee (homepage) https://bluebottlecoffee.com
Scraping Blue Bottle Coffee (products) https://bluebottlecoffee.com/our-coffees
Scraping Stumptown Coffee (homepage) https://www.stumptowncoffee.com
Scraping Stumptown Coffee (about) https://www.stumptowncoffee.com/pages/our-story
Scraping Counter Culture Coffee (homepage) https://counterculturecoffee.com
Scraping Counter Culture Coffee (sustainability) https://counterculturecoffee.com/pages/sustainability
Saved scraped_raw.json
Sending to OpenAI (gpt-4o)...
Saved analysis.json

=== Running build_report.js ===
Wrote: ./Ember_and_Origin_Competitive_Analysis.docx

Pipeline complete.
```

### Timing Breakdown

| Step | Typical Duration |
|------|-----------------|
| Screenshots (6 pages) | ~1–2 minutes |
| Scraping (6 pages) | ~1–2 minutes |
| OpenAI analysis | ~30–60 seconds |
| Word doc generation | ~2 seconds |

---

## Output Files

After a successful run you will have:

### `screenshots/` folder
Six full-page PNG screenshots of each competitor page — useful visual evidence for the report or presentation.

### `scraped_raw.json`
The raw text extracted from each page before it was sent to OpenAI. Useful for debugging if the analysis seems off — you can see exactly what the AI was working from.

### `analysis.json`
The structured JSON returned by GPT-4o. Contains:
- `executive_summary` — 2–3 paragraph overview of the competitive landscape
- `matrix` — per-competitor breakdown across 6 dimensions
- `key_takeaways` — 4–6 bold strategic insights
- `differentiation_strategies` — 5 specific strategies for Ember & Origin
- `content_calendar` — 4-week blog/email/social plan
- `next_steps` — 4–6 concrete action items

### `Ember_and_Origin_Competitive_Analysis.docx`
The final Word document. Open it in Microsoft Word or Google Docs. It includes:
- Branded cover with Ember & Origin colors
- Executive summary
- Full comparison matrix table
- Key takeaways
- Differentiation strategies with proof artifacts
- 4-week content calendar table
- Recommended next steps

---

## Configuration & Customization

### Change the AI Model

By default the system uses `gpt-4o`. To use a cheaper/faster model:

```powershell
$env:OPENAI_MODEL = "gpt-4o-mini"
node main.js
```

### Change the Brand

Edit the `BRAND` constant at the top of `analyze_competitors.js`:

```js
const BRAND = {
  name: 'Your Brand Name',
  tagline: 'Your tagline.',
  audience: 'Description of your target audience.',
};
```

### Change the Competitors

Edit the `COMPETITORS` array in `analyze_competitors.js`. Each entry needs a name and an array of pages (each with a `kind` label and a `url`):

```js
const COMPETITORS = [
  {
    name: 'Competitor Name',
    pages: [
      { kind: 'homepage', url: 'https://example.com' },
      { kind: 'about',    url: 'https://example.com/about' },
    ],
  },
];
```

### Change Output Location

```powershell
$env:OUT_DIR = "./output"
node main.js
```

---

## Troubleshooting

| Problem | Likely Cause | Fix |
|---------|-------------|-----|
| `Missing OPEN_AI_API environment variable` | API key not set | Set `$env:OPEN_AI_API = "sk-..."` in your terminal |
| `Missing analysis.json` | Step 2 was skipped or failed | Run `node analyze_competitors.js` first |
| A screenshot shows a blank or partial page | Site loaded slowly | Increase the `waitForTimeout` value in `capture_screenshots.js` |
| OpenAI returns invalid JSON | Rare model drift | Re-run `node analyze_competitors.js` — the format flag makes this unlikely |
| `Cannot find module` error | Dependencies not installed | Run `npm install openai @playwright/test docx` |
| Playwright browser not found | Chromium not installed | Run `npx playwright install chromium` |
