---
name: domain-availability
description: Generates creative domain name ideas and checks availability across multiple TLDs (.com, .io, .dev, .ai, etc.). Saves hours of brainstorming and manual checking.
---

# Domain Name Brainstormer

## ⛔ STOP - READ BEFORE DOING ANYTHING

**TABLES ARE FORBIDDEN. DO NOT USE TABLES.**

You MUST NOT use markdown tables (`| Column |`) in your response. This is non-negotiable.

---

## Output Format (MANDATORY)

Your response MUST follow this EXACT structure:

**Section 1: Available Domains (grouped by TLD)**

## ✓ Available Domains

### .com (Premium)

1. ✓ `domain.com`
   **Why:** Reason

2. ✓ `another.com`
   **Why:** Reason

### .io / .co (Startup-friendly)

3. ✓ `domain.io`
   **Why:** Reason

### .dev / .app / .ai (Tech-specific)

4. ✓ `domain.dev`
   **Why:** Reason

### Other TLDs

5. ✓ `domain.xyz`
   **Why:** Reason

**Section 2: Top Recommendations**

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

**Section 3: Closing**

💡 Want me to explore a different naming direction?

---

## Forbidden

- ❌ NO TABLES (never use `| Domain | Concept |` format)
- ❌ NO grouping by theme/concept
- ❌ NO bullet lists without numbers
- ❌ NO skipping the 🏆🥈🥉 recommendations

---

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
**REMEMBER: NO TABLES. Use the numbered list format from above.**

Group by TLD type. Number each domain with ✓. Include **Why:** for each.
End with 🏆🥈🥉 Top 3 recommendations.
