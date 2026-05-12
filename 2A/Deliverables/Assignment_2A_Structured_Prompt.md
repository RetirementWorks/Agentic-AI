# Assignment 2A — Structured Prompt (Reverse-Engineered)

**Pattern:** Context → Instructions → Input → Output
**Tool:** Claude Cowork with the **Data Plugin**
**Source brief:** *Week 2 Assignment.pdf — Part A: AI Data Analyst with Claude Cowork*

---

## 1. Context

You are Claude Cowork acting as an **AI Data Analyst** for a consumer Software-as-a-Service (SaaS) company. The leadership team has supplied a single dataset (`saas_monthly_metrics.xlsx`) covering monthly performance across multiple regions and subscription plans. Leadership wants a clear, executive-ready read on:

- How the business is growing (subscribers, revenue, retention).
- Which segments (region × plan) are driving or dragging that growth.
- What operational signals (NPS, support tickets, marketing spend) deserve attention.
- A short, opinionated set of recommendations they can act on this quarter.

The audience for the final outputs is the **executive team** (CEO, CRO, CFO, CMO). They are time-poor, prefer visuals over tables, and want the "so what" called out.

The work must be performed inside **Claude Cowork** using the **Data plugin** so that all interim steps (data load, profiling, statistics, charting) are visible and reproducible.

---

## 2. Instructions

Carry out the following tasks in order, using the Data plugin's exploration, statistics, and visualization skills as needed:

1. **Exploratory Analysis & Statistical Summary**
   - Load and profile the dataset (shape, types, missing values, duplicates, date coverage).
   - For every numeric metric, compute **mean, median, standard deviation, min/max, and quartiles**.
   - Detect **outliers** using the 1.5 × IQR rule and explain whether each outlier is a data-quality issue or a legitimate business signal.

2. **Single-Page Dashboard**
   - Build a self-contained HTML dashboard that opens in any browser.
   - Include **KPI cards** (Total MRR, MRR growth, Active Subscribers, Churn Rate, NRR, NPS), **all 10 charts** below, and a short "Key takeaways" panel.
   - Visual style must be sharp, executive-grade (clean typography, brand palette, no clutter).

3. **10 Distinct Visualizations**
   Generate ten publication-quality charts that together tell the story of growth, retention, customer health and marketing efficiency. At minimum cover:
   1. Total MRR trend over time
   2. MRR by region (composition over time)
   3. MRR by plan (composition over time)
   4. Active subscribers by region
   5. New vs. churned subscribers with churn rate
   6. ARPU heatmap (plan × region)
   7. NRR distribution by plan
   8. NPS heatmap (region × plan)
   9. Marketing spend vs. new subscribers (with regression)
   10. Correlation matrix of operational + revenue metrics

4. **10-Slide Executive PowerPoint**
   Prepare a 10-slide deck (16:9, premium look, navy + ice-blue + teal palette) covering:
   1. Title slide with headline KPIs
   2. Dataset overview & schema
   3. Statistical summary (mean, median, outliers)
   4. Headline KPIs (6 large stat cards)
   5. MRR trend
   6. Region & plan composition
   7. Subscriber growth vs. churn
   8. ARPU & NRR (revenue quality)
   9. NPS & marketing efficiency (customer health)
   10. Key recommendations (5 prioritized actions)

5. **Quality bar**
   - All numbers must be reproducible from the dataset.
   - Charts must be readable at presentation size (no cropped axes, no overflow).
   - Run a fresh-eyes visual QA pass on the deck before declaring done.

6. **Capture screenshots** of each interim step of the analysis workflow so the reader can see how the answer was produced, not just the final output.

---

## 3. Input

**Primary data file:** `saas_monthly_metrics.xlsx` (also accepted as CSV).

**Schema (per the assignment Appendix):**

| Field | Definition |
|---|---|
| `month` | Month and year (e.g. *Jan-23*, *Jun-25*) |
| `region` | Geographic market — *North America, Europe, APAC, MENA* |
| `plan` | Subscription tier — *Basic, Pro, Business, Enterprise* |
| `new_subscribers` | Customers who subscribed during the month |
| `churned_subscribers` | Customers who cancelled during the month |
| `active_subscribers` | Active customers at month end |
| `arpu_usd` | Average Revenue Per User (USD) |
| `mrr_usd` | Monthly Recurring Revenue (USD) |
| `net_revenue_retention` | > 1.0 indicates expansion (upsell / upgrade) |
| `marketing_spend_usd` | Monthly marketing outlay |
| `support_tickets` | Tickets logged during the month |
| `nps_score` | Net Promoter Score, 0–100 |

Coverage observed: **480 rows · 30 months (Jan-2023 → Jun-2025) · 4 regions × 4 plans · 0 missing values · 0 duplicate keys**.

---

## 4. Output

Deliver the following artifacts to the user's outputs folder, with a short narrative summary in chat that links to each:

| # | Deliverable | File |
|---|---|---|
| 1 | Single-page executive dashboard (interactive HTML) | `SaaS_Executive_Dashboard.html` |
| 2 | 10 standalone chart PNGs | `charts/01_mrr_trend.png` … `charts/10_correlation_heatmap.png` |
| 3 | 10-slide executive PowerPoint | `SaaS_Executive_Briefing.pptx` |
| 4 | Statistical summary (mean, median, std, quartiles for every metric) | `statistical_summary.csv` |
| 5 | Outlier audit (1.5 × IQR fences + counts) | `outliers_summary.csv` |
| 6 | Headline KPIs (machine-readable) | `kpis.json` |
| 7 | At least 10 workflow screenshots showing interim steps | `workflow/screenshot_01.png` … `screenshot_10.png` |

The chat reply should:
- Be concise (no long postamble).
- Provide direct links to each file.
- Surface 4–6 headline numbers (Total MRR, growth %, active subs, churn rate, NRR, NPS).
- End with the top 3 recommendations.

---

## 5. Why this prompt works

- **Context** sets the persona (data analyst), the audience (executives) and the tooling (Claude Cowork + Data plugin) so Claude picks the right voice and toolkit.
- **Instructions** are explicit, numbered, and bound by acceptance criteria ("at minimum cover", "no overflow", "fresh-eyes QA"), which leaves Claude no room to skip steps or hand-wave.
- **Input** declares the data shape upfront so Claude validates it (rows / dates / regions / plans / nulls) before computing — this is what catches bad files early.
- **Output** specifies file names, formats, and where they land. That converts a fuzzy "give me a deck" into a contract Claude can be measured against.
