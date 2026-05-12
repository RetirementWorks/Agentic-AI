# Creative Advertising Multi-Agent System — One-Page Explanation

**Assignment: Part B | Author: Alok Mehta**

---

## Role of Each Agent

### 1. Creative Director
Receives the raw campaign brief and produces 3–5 fully formed campaign ideas. Each idea
includes a campaign name, a one-line tagline, and a 2–3 sentence concept description.
The agent's instructions push it toward boldness and cultural specificity, so ideas are
tailored to the named market (in this case, Bali) rather than generic global copy.

### 2. Strategist
Takes the Creative Director's raw ideas and applies analytical judgment. It evaluates
every idea against three criteria — market fit, originality, and potential reach —
then selects the **top two** and articulates the reasoning for each selection. This
gate prevents weak concepts from moving forward and ensures the copy stage focuses
creative energy on the strongest strategic options.

### 3. Copywriter
Receives only the two approved campaigns and produces two tweets per campaign (four
total). The agent is constrained to ≤ 280 characters per tweet, 2–3 hashtags, and a
defined brand voice (eco-conscious, aspirational, travel-forward). Operating at the
end of the pipeline, it can write with confidence because creative and strategic
decisions are already resolved.

---

## Tools and Functions Used

| Component | Description |
|-----------|-------------|
| `openai-agents` SDK | Official OpenAI multi-agent framework (`pip install openai-agents`) |
| `Agent` class | Defines each agent with a `name`, `model`, and `instructions` string |
| `Runner.run()` | Asynchronous function that executes an agent given a string input |
| `result.final_output` | String property that holds the agent's completed response |
| `asyncio.run()` | Python standard library — runs the async pipeline from a sync entry point |

No custom tools (function-calling) were added. All three agents operate purely on
text instructions, which is sufficient for this ideation-and-copy workflow. Tool
augmentation (e.g., a web-search tool for trend data) could be added to the
Strategist in a production version.

---

## Why a Multi-Agent Approach Improves the Workflow

**Separation of concerns.** A single all-in-one prompt for "generate ideas, pick the
best two, and write tweets" produces mediocre results because the model must
simultaneously wear three hats. Splitting responsibilities lets each agent be
optimized with a tightly scoped instruction set that matches one cognitive mode:
divergent (Creative Director), evaluative (Strategist), and executional (Copywriter).

**Quality gates.** The Strategist acts as a checkpoint. Only campaigns that survive
strategic scrutiny reach the Copywriter, which prevents wasted copy work on ideas
that would never run.

**Auditability.** Because each stage produces a distinct, readable output, a human
reviewer can intervene between stages — approve the ideas before strategy, approve
strategy before copy — exactly as a real agency workflow would function.

**Scalability.** Additional agents (e.g., a Legal Reviewer, a Visual Concept Agent,
a Budget Estimator) can be inserted into the pipeline without rewriting existing
agents, making the architecture extensible.

---

## Sample Output

**Brief:** *"Launch a campaign for a new eco-friendly water bottle in Bali."*

---

**STAGE 1 — Creative Director (excerpt)**

> **1. Tides of Change**
> *Tagline:* "Drink clean. Leave clean."
> *Concept:* A campaign anchored in Bali's beach-cleanup culture, partnering with
> local Sungai Watch volunteers. Every bottle sold funds the removal of one pound of
> plastic from Balinese rivers, visualized through a real-time impact counter on the
> brand's website.
>
> **2. The Offering**
> *Tagline:* "Sacred water, sacred bottle."
> *Concept:* Draws on Balinese Hindu ritual — the daily canang sari offering —
> positioning the bottle as a vessel worthy of the island's spiritual relationship
> with water. Campaign imagery features sunrise ceremonies at Tirta Empul temple.

*(3 additional ideas generated — omitted for brevity)*

---

**STAGE 2 — Strategist (excerpt)**

> **Selected Campaign 1: Tides of Change**
> *Reason:* Strong market fit with Bali's established eco-tourism segment and viral
> potential through the measurable impact mechanic. Easily executable via existing
> NGO partnerships.
>
> **Selected Campaign 2: The Offering**
> *Reason:* Culturally differentiated from generic "green" messaging. The spiritual
> angle resonates with the dominant demographic of wellness-focused international
> visitors and is highly visual for Instagram and TikTok.

---

**STAGE 3 — Copywriter**

> **--- Tides of Change ---**
> Tweet 1: Every sip you take cleans up Bali's rivers. One bottle = 1 lb of plastic
> removed. The ocean is watching. 🌊 #TidesOfChange #EcoBottle #BaliClean
>
> Tweet 2: You came to Bali to find yourself — don't leave plastic behind. Drink
> different. #TidesOfChange #ZeroWaste #BaliLife

> **--- The Offering ---**
> Tweet 1: Bali doesn't just give you sunsets. It gives you a new relationship with
> water. Carry it wisely. 🙏 #TheOffering #SacredWater #EcoLiving
>
> Tweet 2: From Tirta Empul to your hands — water this pure deserves a bottle this
> clean. #TheOffering #BaliSpirit #SustainableTravel
