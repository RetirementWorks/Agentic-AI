# Verde Kitchen — Brand Slash Command

A custom Claude Code slash command that encodes the complete Verde Kitchen brand identity and generates on-brand marketing content from a single prompt.

---

## Table of Contents

1. [What This Assignment Does](#what-this-assignment-does)
2. [What Is a Slash Command](#what-is-a-slash-command)
3. [The Brand: Verde Kitchen](#the-brand-verde-kitchen)
4. [The Slash Command](#the-slash-command)
5. [Setup & Installation](#setup--installation)
6. [How to Invoke the Command](#how-to-invoke-the-command)
7. [What the Command Does](#what-the-command-does)
8. [Outputs Generated](#outputs-generated)
9. [Brand Voice Consistency Analysis](#brand-voice-consistency-analysis)

---

## What This Assignment Does

This assignment demonstrates how to encode a business's brand identity into a reusable Claude Code slash command. Once created, the command acts as a persistent brand brief — any content request routed through it automatically inherits the correct voice, vocabulary, colours, and typography guidelines, without the user having to repeat those details each time.

Two outputs were generated to test the command:
1. A **marketing email** for a weekly menu drop
2. A **print/digital flyer** for new customer acquisition

Both outputs are documented in `results.md`. A brand consistency analysis answers the question: *do both pieces feel like they come from the same brand?*

---

## What Is a Slash Command

In Claude Code, a slash command is a reusable prompt stored as a Markdown file inside `.claude/commands/`. When you type `/command-name [arguments]` in a Claude Code session, Claude loads the file, substitutes `$ARGUMENTS` with whatever you typed after the command name, and runs the full prompt.

Slash commands can be:
- **Project-level** — stored in `.claude/commands/` inside a repo, available to anyone who clones it
- **User-level** — stored in `~/.claude/commands/`, available across all your projects

This command is project-level, stored at `.claude/commands/my-brand-verde-k.md`.

---

## The Brand: Verde Kitchen

| Element | Detail |
|---------|--------|
| Business | Verde Kitchen |
| Category | Plant-based meal prep service |
| Tagline | "Eat well. Live well. No effort required." |
| Primary colour | Forest Green `#2D5A27` |
| Secondary colour | Cream `#FAF3E0` |
| Accent colour | Terracotta `#C4704F` |
| Heading font | Josefin Sans |
| Body font | Source Sans Pro |
| Tone | Friendly, encouraging, health-conscious — like a supportive friend who happens to be a chef |
| Words to use | nourish, fresh, plant-powered, simple, wholesome, vibrant |
| Words to avoid | diet, restrict, guilty, cheat meal, processed, artificial |

---

## The Slash Command

**File:** `.claude/commands/my-brand-verde-k.md`

The command file contains:
- Full brand identity (name, tagline, mission)
- Visual identity table (colours + fonts) formatted for designer handoff
- Voice guidelines (tone description, vocabulary rules)
- A task instruction that injects `$ARGUMENTS` so the user controls what content type is generated

The command is intentionally generic about content type — it does not hardcode "write an email." Instead the user passes the content type as the argument, making the command reusable for emails, flyers, social posts, product descriptions, and more.

---

## Setup & Installation

### Step 1 — Install Claude Code

If you do not have Claude Code installed, install it globally via npm:

```bash
npm install -g @anthropic-ai/claude-code
```

Then authenticate:

```bash
claude
```

Claude Code will prompt you to log in with your Anthropic account on first launch.

### Step 2 — Get the command file into the right place

**Option A — Clone this repo (command is already included)**

The slash command file is committed at `.claude/commands/my-brand-verde-k.md` in this repository. If you clone the repo and open Claude Code from inside it, the command is immediately available — no extra steps needed.

```bash
git clone https://github.com/RetirementWorks/Agentic-AI.git
cd Agentic-AI
claude
```

**Option B — Add it to your user-level commands (available across all projects)**

Copy the command file to your personal Claude commands folder so it works in any project:

- **Mac / Linux:** `~/.claude/commands/`
- **Windows:** `C:\Users\<YourName>\.claude\commands\`

```powershell
# Windows PowerShell
Copy-Item ".claude\commands\my-brand-verde-k.md" "$env:USERPROFILE\.claude\commands\"
```

```bash
# Mac / Linux
cp .claude/commands/my-brand-verde-k.md ~/.claude/commands/
```

After copying, the `/my-brand-verde-k` command will be available in every Claude Code session on your machine.

---

## How to Invoke the Command

Open a Claude Code session in the terminal and type `/my-brand-verde-k` followed by a description of the content you want:

```
/my-brand-verde-k a welcome email for new subscribers
```

```
/my-brand-verde-k a print flyer for new customer acquisition
```

```
/my-brand-verde-k three Instagram captions for this week's menu
```

```
/my-brand-verde-k a homepage hero headline and subhead
```

```
/my-brand-verde-k a subject line and preview text for a flash sale
```

The part after `/my-brand-verde-k` is the **argument** — it tells the command what type of content to produce. You can request any marketing format; the brand brief stays the same.

---

## What the Command Does

When you invoke `/my-brand-verde-k [content type]`, Claude Code:

1. **Loads** the file `.claude/commands/my-brand-verde-k.md`
2. **Substitutes** `$ARGUMENTS` in the file with whatever you typed after the command name
3. **Runs the full prompt**, which includes:
   - The Verde Kitchen business description and tagline
   - The complete visual identity (colours with hex codes, fonts with hierarchy)
   - The brand voice definition (tone, required vocabulary, banned vocabulary)
   - Your specific content request (injected via `$ARGUMENTS`)
4. **Generates** the requested content fully aligned to the brand — no need to re-explain the brand each time

The command is intentionally format-agnostic. It does not hardcode "write an email." The user controls the output type through the argument, making the command reusable for any marketing content Verde Kitchen needs.

**What changes each run:** the content type (email, flyer, caption, etc.)
**What stays the same every run:** the brand identity, voice rules, colour palette, and vocabulary guidelines

---

## How to Use the Command

Open any Claude Code session inside this repository and type:

```
/my-brand-verde-k a welcome email for new subscribers
```

```
/my-brand-verde-k a print flyer for new customer acquisition
```

```
/my-brand-verde-k three Instagram captions for this week's menu
```

```
/my-brand-verde-k a homepage hero headline and subhead
```

Claude will load the full brand brief from the command file and generate the requested content in Verde Kitchen's voice.

---

## Outputs Generated

See `results.md` for the full text of both outputs.

| Output | Command Used |
|--------|-------------|
| Marketing email | `/my-brand-verde-k a marketing email for this week's menu drop` |
| Print/digital flyer | `/my-brand-verde-k a print and digital flyer for new customer acquisition` |

---

## Brand Voice Consistency Analysis

See `results.md` (Section 3) for the detailed analysis of whether both outputs feel like they come from the same brand voice and visual identity.

**Short answer:** Yes. Both pieces share the same vocabulary, emotional register, tagline usage, and structural confidence. The analysis documents the specific signals that confirm consistency and notes one area where a real production workflow might tighten alignment further.
