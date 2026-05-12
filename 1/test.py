"""
Sends a single prompt to the OpenAI Chat Completions API and prints the response.

Requirements:
    - openai package: pip install openai
    - OPEN_AI_API environment variable set to a valid OpenAI API key

Usage:
    python test.py
"""

from openai import OpenAI, AuthenticationError, RateLimitError, APIConnectionError
import os
import sys


def get_api_key() -> str:
    """Read the OpenAI API key from the environment."""
    
    if not key:
        print("Error: OPEN_AI_API environment variable is not set.", file=sys.stderr)
        sys.exit(1)
    return key


def ask(prompt: str) -> str:
    """Send a prompt to gpt-4o-mini and return the response text."""
    client = OpenAI(api_key=get_api_key())
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
    )
    return response.choices[0].message.content


PROMPT = "Explain AI in one sentence"


def main():
    try:
        answer = ask(PROMPT)
        print(answer)
    except AuthenticationError:
        print("Error: Invalid API key. Check your OPEN_AI_API environment variable.", file=sys.stderr)
        sys.exit(1)
    except RateLimitError:
        print("Error: Rate limit exceeded. Wait a moment and try again.", file=sys.stderr)
        sys.exit(1)
    except APIConnectionError:
        print("Error: Could not connect to the OpenAI API. Check your internet connection.", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()