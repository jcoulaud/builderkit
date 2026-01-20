---
name: domain-availability
description: Generates creative domain name ideas and checks availability across multiple TLDs (.com, .io, .dev, .ai, etc.). Saves hours of brainstorming and manual checking.
---

# Domain Name Brainstormer

## When to Activate

- User asks for domain name suggestions or ideas
- User asks "is X.com available?" or similar availability checks
- User mentions wanting to register or buy a domain
- User explicitly requests help finding an available domain for their project

---

<format_rules>
CRITICAL - READ BEFORE RESPONDING:

1. OUTPUT = Numbered list grouped by TLD type
2. NEVER use tables, pipes, or columns
3. Group order: .com > .io/.co > .dev/.app/.ai > Other TLDs
4. Every domain gets a **Why:** explanation on the next line
5. End with Top 3 recommendations (Top Pick, Runner-up, Budget Pick)
</format_rules>

---

## Rules

1. **USE MCP TOOL ONLY** - Use `check_domains` MCP tool. NEVER use bash, whois, dig
2. **FIND 10+ AVAILABLE** - Keep checking until you find at least 10
3. **SHOW ONLY 10-12** - Curate the best 10-12 in your response
4. **MAX 3 ROUNDS** - Stop after 3 rounds of checking

If `check_domains` is unavailable, tell the user to wait a moment and try again.

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
Follow the CORRECT FORMAT below. No exceptions.

---

## Format Examples

<wrong_format>
DO NOT OUTPUT THIS - Tables are forbidden:

| Domain | TLD | Why |
|--------|-----|-----|
| spark.com | .com | Short and punchy |
| blaze.io | .io | Tech-friendly |
| nova.dev | .dev | Developer appeal |

**My favorites:**
- spark.com - Great brand potential
- blaze.io - Memorable and modern

This is WRONG because:
- Uses table with pipe characters
- Ends with "My favorites" instead of Top 3 format
- Does not group by TLD type
- Does not use numbered list
</wrong_format>

<correct_format>
## Available Domains

### .com (Premium)

1. `spark.com`
   **Why:** Short, punchy, universal brand appeal

2. `nova.com`
   **Why:** Memorable, conveys innovation

### .io / .co (Startup-friendly)

3. `blaze.io`
   **Why:** Tech-friendly, energetic feel

4. `pulse.co`
   **Why:** Dynamic, suggests real-time activity

### .dev / .app / .ai (Tech-specific)

5. `stack.dev`
   **Why:** Developer-focused, clear purpose

6. `neural.ai`
   **Why:** AI branding, technical credibility

### Other TLDs

7. `orbit.xyz`
   **Why:** Modern, affordable alternative

---

## Top Recommendations

**Top Pick: `spark.com`**
- Universal brand appeal
- Easy to spell and remember

**Runner-up: `blaze.io`**
- Strong tech associations
- Available at reasonable price

**Budget Pick: `orbit.xyz`**
- Modern feel
- Low registration cost

---

Want me to explore a different naming direction?
</correct_format>

---

## Pre-Response Verification

Before outputting, answer these questions. ALL must be YES:

1. Are domains grouped by TLD type (.com, then .io/.co, then .dev/.app/.ai, then Other)? YES/NO
2. Is every domain numbered sequentially (1, 2, 3...)? YES/NO
3. Does every domain have a **Why:** explanation on the next line? YES/NO
4. Does the response end with Top Pick, Runner-up, and Budget Pick? YES/NO
5. Is the response FREE of pipe characters (|) and table formatting? YES/NO
6. Is the response FREE of "My favorites" or similar informal endings? YES/NO

If ANY answer is NO, rewrite before outputting.
