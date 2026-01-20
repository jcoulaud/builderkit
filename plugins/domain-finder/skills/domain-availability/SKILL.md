---
name: domain-availability
description: Generates creative domain name ideas and checks availability across multiple TLDs (.com, .io, .dev, .ai, etc.). Saves hours of brainstorming and manual checking.
---

# Domain Name Brainstormer

## When to Activate

- User asks for domain name suggestions
- User is brainstorming startup/project names
- User asks "is X.com available?"
- User mentions wanting to register a domain

---

## Rules

1. **USE MCP TOOL ONLY** - Use `check_domains` MCP tool. NEVER use bash, whois, dig
2. **FIND 10+ AVAILABLE** - Keep checking until you find at least 10
3. **SHOW ONLY 10-12** - Curate the best 10-12 in your response
4. **MAX 3 ROUNDS** - Stop after 3 rounds of checking

⚠️ If `check_domains` is unavailable, tell user to restart Claude Code.

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
Follow the EXACT FORMAT TEMPLATE below. No exceptions.

---

## EXACT FORMAT TEMPLATE

Copy this structure exactly. Use numbered lists and TLD groupings only.

```
## ✓ Available Domains

### .com (Premium)

1. ✓ `example.com`
   **Why:** Brief reason this name works

2. ✓ `another.com`
   **Why:** Brief reason this name works

### .io / .co (Startup-friendly)

3. ✓ `example.io`
   **Why:** Brief reason this name works

4. ✓ `another.co`
   **Why:** Brief reason this name works

### .dev / .app / .ai (Tech-specific)

5. ✓ `example.dev`
   **Why:** Brief reason this name works

6. ✓ `another.ai`
   **Why:** Brief reason this name works

### Other TLDs

7. ✓ `example.xyz`
   **Why:** Brief reason this name works

---

## 🏆 Top Recommendations

🏆 **Top Pick: `best.io`**
- Reason 1
- Reason 2

🥈 **Runner-up: `second.com`**
- Reason 1
- Reason 2

🥉 **Budget Pick: `third.xyz`**
- Reason 1
- Reason 2

---

💡 Want me to explore a different naming direction?
```

---

## ⛔ MANDATORY PRE-RESPONSE VERIFICATION

Before you write ANY output, you MUST verify your response passes ALL checks:

**Structure Check:**
- [ ] Domains grouped by TLD type (.com, .io/.co, .dev/.app/.ai, Other)
- [ ] Each domain is numbered (1, 2, 3, etc.)
- [ ] Each domain has ✓ prefix and backtick formatting
- [ ] Each domain has **Why:** explanation on next line
- [ ] Response ends with 🏆🥈🥉 Top Recommendations section
- [ ] Closing line asks about different naming direction

**Format Violation Check:**
- [ ] Response contains ZERO pipe characters for columnar layout
- [ ] Response contains ZERO horizontal alignment patterns
- [ ] Domains are NOT grouped by theme or concept
- [ ] All lists use numbers, not plain bullets

If ANY check fails, STOP and rewrite your response before outputting.

---

## ABSOLUTE FORMAT REQUIREMENTS

Your output format is FIXED and NON-NEGOTIABLE:

1. **Group domains by TLD type** - .com first, then .io/.co, then .dev/.app/.ai, then others
2. **Number every domain** - Sequential numbers (1, 2, 3...) across all groups
3. **Use the ✓ prefix** - Every domain line starts with the number, then ✓
4. **Include Why** - Every domain has a **Why:** line explaining the choice
5. **End with Top 3** - Always include 🏆🥈🥉 recommendations at the end

The ONLY acceptable output structure is numbered lists grouped by TLD. This is the format. There is no alternative.
