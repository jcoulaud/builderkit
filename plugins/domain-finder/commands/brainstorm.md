---
description: Brainstorm domain name ideas and check availability
---

<FORMAT_CONSTRAINT>
OUTPUT FORMAT IS LOCKED. You cannot use tables. You cannot use pipe characters (|).
Your output MUST be a numbered list grouped by TLD. This is non-negotiable.
</FORMAT_CONSTRAINT>

Brainstorm creative domain names for: "$ARGUMENTS"

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
