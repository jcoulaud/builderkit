---
description: Brainstorm domain name ideas and check availability
---

Brainstorm creative domain names for: "$ARGUMENTS"

---

## CRITICAL FORMAT RULES - READ FIRST

<format_rules>
You MUST follow these format rules. Violations are not acceptable.

NEVER USE TABLES. This means:
- NO pipe characters (|) for columns
- NO markdown table syntax
- NO horizontal alignment patterns
- NO column headers with dashes (|---|---|)

ALWAYS USE this exact structure:
- Numbered lists (1. 2. 3.) grouped by TLD type
- Each domain on its own line with checkmark prefix
- Each domain followed by **Why:** explanation

REQUIRED ENDING:
- Section titled "## Top Recommendations" with trophy emoji
- Three picks: Top Pick, Runner-up, Budget Pick with medal emojis
- Final line asking about different naming direction
</format_rules>

---

## WRONG FORMAT - DO NOT USE

<wrong_format>
NEVER output anything like this:

| Domain | Notes |
|--------|-------|
| example.com | Short and memorable |
| another.io | Tech-friendly |

My favorites:
- example.com - best overall
- another.io - runner up

This format is WRONG because:
1. Uses table with pipe characters
2. Groups by theme instead of TLD
3. Says "My favorites" instead of "Top Recommendations"
4. Missing trophy/medal emojis
5. Missing **Why:** explanations
</wrong_format>

---

## CORRECT FORMAT - USE THIS EXACTLY

<correct_format>
## Available Domains

### .com (Premium)

1. `example.com`
   **Why:** Brief reason this name works

2. `another.com`
   **Why:** Brief reason this name works

### .io / .co (Startup-friendly)

3. `startup.io`
   **Why:** Brief reason this name works

4. `venture.co`
   **Why:** Brief reason this name works

### .dev / .app / .ai (Tech-specific)

5. `builder.dev`
   **Why:** Brief reason this name works

6. `neural.ai`
   **Why:** Brief reason this name works

### Other TLDs

7. `creative.xyz`
   **Why:** Brief reason this name works

---

## Top Recommendations

**Top Pick: `best.io`**
- Reason 1
- Reason 2

**Runner-up: `second.com`**
- Reason 1
- Reason 2

**Budget Pick: `third.xyz`**
- Reason 1
- Reason 2

---

Want me to explore a different naming direction?
</correct_format>

---

## Rules

1. **USE MCP TOOL ONLY** - Use `check_domains` MCP tool. NEVER use bash, whois, dig
2. **FIND 10+ AVAILABLE** - Keep checking until you find at least 10
3. **SHOW ONLY 10-12** - Curate the best 10-12 in your response
4. **MAX 3 ROUNDS** - Stop after 3 rounds of checking

If `check_domains` is unavailable, tell user to wait ~10 seconds for the MCP server to connect, then try again.

---

## Workflow

### Step 1: Understand the Project
- What they're building
- Target audience
- Desired vibe

### Step 2: Generate 15-20 Names (silently)
Techniques: compound words, verb+noun, truncations, portmanteaus, made-up words, misspellings.
Good domains: short (<12 chars), memorable, pronounceable, no hyphens.

### Step 3: Check Availability
Call `check_domains` MCP tool with your list.

TLD priority: .com > .io/.co > .ai/.dev/.app > .xyz/.net/.me
Skip: .online, .site, .website, .biz, .info

### Step 4: Iterate if Needed
If <10 available, generate more names and check again. Max 3 rounds.

### Step 5: Format Response
Follow the CORRECT FORMAT shown above. Group by TLD, use numbered lists, include **Why:** for each, end with Top Recommendations section.

---

## Pre-Response Self-Check

Before outputting, verify:

1. Are domains grouped by TLD type (.com first, then .io/.co, then .dev/.app/.ai, then Other)?
2. Is every domain numbered sequentially (1, 2, 3...)?
3. Does every domain have a **Why:** explanation on the next line?
4. Does the response end with "## Top Recommendations" (NOT "My favorites")?
5. Are there three picks with Top Pick, Runner-up, and Budget Pick labels?
6. Is the final line "Want me to explore a different naming direction?"
7. Are there ZERO pipe characters (|) in the entire response?
8. Are there ZERO table structures anywhere?

If any answer is NO, rewrite before outputting.
