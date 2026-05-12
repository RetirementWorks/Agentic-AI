"""
Creative Advertising Multi-Agent System
Assignment: Part B — OpenAI Agents SDK Pipeline
Author: RetirementWorks / Alok Mehta

Pipeline: Creative Director → Strategist → Copywriter

Install dependencies:
    pip install openai-agents

Set your API key:
    set OPENAI_API_KEY=your-key-here   (Windows)
    export OPENAI_API_KEY=your-key-here (Mac/Linux)
"""

import asyncio
import os
import sys
from agents import Agent, Runner

sys.stdout.reconfigure(encoding="utf-8")


# ---------------------------------------------------------------------------
# Agent Definitions
# ---------------------------------------------------------------------------

creative_director = Agent(
    name="Creative Director",
    model="gpt-4o-mini",
    instructions="""
You are a Creative Director at a world-class advertising agency.

Given a campaign brief, generate exactly 3 to 5 distinct and creative campaign ideas.

For each idea provide:
  - Campaign Name: a short, memorable title
  - Tagline: one punchy sentence that captures the essence
  - Concept: 2-3 sentences describing the core idea, visual theme, and target emotion

Number each idea clearly (1, 2, 3, ...). Be bold, original, and culturally relevant
to the specified market.
""",
)

strategist = Agent(
    name="Strategist",
    model="gpt-4o-mini",
    instructions="""
You are a Senior Marketing Strategist at a world-class advertising agency.

You will receive a list of campaign ideas from the Creative Director.
Your job is to:
  1. Briefly evaluate each idea on three criteria: market fit, originality, and
     potential reach/impact (1-2 sentences each).
  2. Select the TOP TWO campaign ideas.
  3. For each selected campaign explain WHY it was chosen — cover target audience
     alignment, competitive differentiation, and execution feasibility.

Format your response as:

EVALUATION
----------
[numbered evaluations of all ideas]

SELECTED CAMPAIGNS
------------------
Campaign 1: [Name]
Reason: [explanation]

Campaign 2: [Name]
Reason: [explanation]
""",
)

copywriter = Agent(
    name="Copywriter",
    model="gpt-4o-mini",
    instructions="""
You are a Social Media Copywriter specializing in viral, purpose-driven content.

You will receive two selected campaign ideas. For EACH campaign write exactly
2 tweets that:
  - Are under 280 characters each (strictly enforced)
  - Include 2-3 relevant hashtags
  - Open with a hook (question, bold claim, or vivid image)
  - End with a clear call-to-action or emotional close
  - Match an eco-conscious, aspirational, travel-forward brand voice

Format your response as:

--- [Campaign Name] ---
Tweet 1: [text]
Tweet 2: [text]

--- [Campaign Name] ---
Tweet 1: [text]
Tweet 2: [text]
"""
)


# ---------------------------------------------------------------------------
# Pipeline Runner
# ---------------------------------------------------------------------------

async def run_pipeline(campaign_brief: str) -> dict:
    """
    Execute the three-agent creative pipeline sequentially.
    Each agent's output feeds directly into the next agent's input.

    Returns a dict with the output from each stage.
    """

    separator = "=" * 65

    print(separator)
    print("  CREATIVE ADVERTISING MULTI-AGENT PIPELINE")
    print(separator)
    print(f"\n  Brief: {campaign_brief}\n")

    # ------------------------------------------------------------------
    # Stage 1 — Creative Director generates campaign ideas
    # ------------------------------------------------------------------
    print("-" * 65)
    print("  STAGE 1 | CREATIVE DIRECTOR — Generating Campaign Ideas")
    print("-" * 65)

    stage1_prompt = (
        f"Campaign brief: {campaign_brief}\n\n"
        "Generate 3-5 creative campaign ideas for this brief."
    )
    result1 = await Runner.run(creative_director, input=stage1_prompt)
    ideas: str = result1.final_output
    print(ideas)

    # ------------------------------------------------------------------
    # Stage 2 — Strategist selects the top two ideas
    # ------------------------------------------------------------------
    print("\n" + "-" * 65)
    print("  STAGE 2 | STRATEGIST — Selecting the Top Two Campaigns")
    print("-" * 65)

    stage2_prompt = (
        "Here are the campaign ideas from our Creative Director:\n\n"
        f"{ideas}\n\n"
        "Evaluate all ideas and select the top two. Explain your reasoning."
    )
    result2 = await Runner.run(strategist, input=stage2_prompt)
    selected: str = result2.final_output
    print(selected)

    # ------------------------------------------------------------------
    # Stage 3 — Copywriter writes promotional tweets
    # ------------------------------------------------------------------
    print("\n" + "-" * 65)
    print("  STAGE 3 | COPYWRITER — Writing Promotional Tweets")
    print("-" * 65)

    stage3_prompt = (
        "The Strategist has selected these two campaigns:\n\n"
        f"{selected}\n\n"
        "Write 2 tweets for each selected campaign."
    )
    result3 = await Runner.run(copywriter, input=stage3_prompt)
    tweets: str = result3.final_output
    print(tweets)

    print("\n" + separator)
    print("  PIPELINE COMPLETE")
    print(separator)

    return {
        "campaign_ideas": ideas,
        "selected_campaigns": selected,
        "tweets": tweets,
    }


# ---------------------------------------------------------------------------
# Entry Point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    api_key = os.getenv("OPEN_AI_API")
    if not api_key:
        raise EnvironmentError(
            "OPEN_AI_API environment variable is not set. "
            "Run: set OPEN_AI_API=your-key-here"
        )
    # The SDK reads OPENAI_API_KEY internally; map our var to it
    os.environ["OPENAI_API_KEY"] = api_key

    brief = "Launch a campaign for a new eco-friendly water bottle in Bali."
    asyncio.run(run_pipeline(brief))
