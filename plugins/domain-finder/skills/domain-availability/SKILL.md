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

<FORMAT_CONSTRAINT>
OUTPUT FORMAT IS LOCKED. You cannot use tables. You cannot use pipe characters (|).
Your output MUST be a numbered list grouped by TLD. This is non-negotiable.
</FORMAT_CONSTRAINT>

<FORBIDDEN_OUTPUT>
THE FOLLOWING OUTPUT PATTERNS ARE FORBIDDEN:

| Domain | Notes |          <-- FORBIDDEN: table with pipes
|--------|-------|          <-- FORBIDDEN: table separator
| x.com | desc |            <-- FORBIDDEN: table row

"Best Options" header        <-- FORBIDDEN: use TLD headers instead
"Other Available" header     <-- FORBIDDEN: use "### Other TLDs"
"My top picks would be..."   <-- FORBIDDEN: use "## Top Recommendations"
"My favorites:"              <-- FORBIDDEN: use structured Top 3 format
</FORBIDDEN_OUTPUT>

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

## STOP - MANDATORY CHECK BEFORE OUTPUT

Scan your response for these FORBIDDEN patterns. If found, DELETE and rewrite:

- Any pipe character `|` → DELETE THE TABLE, convert to numbered list
- "Best Options" or "Other Available" → DELETE, use TLD headers (.com, .io/.co, etc.)
- "My favorites" or "My top picks" → DELETE, use "## Top Recommendations"
- Any two-column layout → DELETE, use single-column numbered list

Your response MUST match this structure exactly:
```
## Available Domains
### .com (Premium)
1. `domain.com`
   **Why:** reason
### .io / .co (Startup-friendly)
2. `domain.io`
   **Why:** reason
[continue for .dev/.app/.ai and Other TLDs]
## Top Recommendations
**Top Pick: `x.com`** - reason
**Runner-up: `y.io`** - reason
**Budget Pick: `z.xyz`** - reason
```

FINAL CHECK: Does your response contain the character `|`? If YES, you have failed. Rewrite.
