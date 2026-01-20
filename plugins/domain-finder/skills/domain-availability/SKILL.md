---
name: domain-availability
description: Generates creative domain name ideas and checks availability across multiple TLDs (.com, .io, .dev, .ai, etc.). Saves hours of brainstorming and manual checking.
---

# Domain Name Brainstormer

Help users find the perfect domain name by generating creative options and checking what's actually available to register.

## When to Activate

- User asks for domain name suggestions
- User is brainstorming startup/project names
- User asks "is X.com available?"
- User mentions wanting to register a domain
- User shares domain ideas they're considering

---

## ⛔ MANDATORY OUTPUT FORMAT

**STOP. Read this section completely before generating any output.**

Your final output MUST match this exact structure. No variations allowed.

### FORBIDDEN (will be rejected):
- ❌ Tables (no `| Domain | Theme |` or similar)
- ❌ Grouping by theme/concept (no "Sun Theme", "Explorer Theme", etc.)
- ❌ Bullet lists of domains without numbering
- ❌ Skipping the Top 3 section

### REQUIRED structure:

```
## ✓ Available Domains

### .com (Premium)

1. ✓ `example.com`
   **Why:** [1-line reason]

2. ✓ `another.com`
   **Why:** [1-line reason]

### .io / .co (Startup-friendly)

3. ✓ `example.io`
   **Why:** [1-line reason]

4. ✓ `another.co`
   **Why:** [1-line reason]

### .dev / .app / .ai (Tech-specific)

5. ✓ `example.dev`
   **Why:** [1-line reason]

### Other TLDs

6. ✓ `example.xyz`
   **Why:** [1-line reason]

---

## 🏆 Top Recommendations

🏆 **Top Pick: `best.io`**
- Reason 1
- Reason 2

🥈 **Runner-up: `second.com`**
- Reason 1
- Reason 2

🥉 **Budget Pick: `third.xyz`**
- Only ~$10/year
- Reason 2

---

💡 Want me to explore a different naming direction?
```

**Checklist before outputting:**
- [ ] Grouped by TLD type (NOT by theme)
- [ ] Each domain numbered with `✓` prefix
- [ ] Each domain has `**Why:**` line
- [ ] Has 🏆 Top Recommendations section
- [ ] Ends with 💡 prompt

---

## CRITICAL RULES

1. **FIND 10 AVAILABLE** - Keep checking until you find at least 10 available domains
2. **USE MCP TOOL ONLY** - Use `check_domains` MCP tool. NEVER use bash, whois, or any fallback
3. **BATCH CHECKING** - Check 15-20 domains per call. If fewer than 10 available, generate more
4. **MAX 3 ROUNDS** - Stop after 3 rounds even if you haven't found 10

⚠️ If `check_domains` is not available, STOP and tell the user to restart Claude Code.

---

## Workflow

### Step 1: Understand the Project

Identify:
- What they're building (SaaS, app, agency, etc.)
- Target audience (developers, consumers, enterprises)
- Desired vibe (professional, playful, technical, friendly)

### Step 2: Generate Names (silently)

Create 15-20 domain ideas using these techniques:
- **Compound words** — DropBox, SnapChat, YouTube
- **Verb + noun** — SendGrid, PushOver, MixPanel
- **Truncations** — Tumblr, Flickr, Scribd
- **Portmanteaus** — Instagram, Pinterest
- **Made-up words** — Spotify, Hulu, Etsy
- **Misspellings** — Lyft, Fiverr, Reddit

Good domains are: short (<12 chars), memorable, pronounceable, no hyphens, brandable.

### Step 3: Check Availability

Call `check_domains` MCP tool:
```json
{
  "domains": ["name.com", "name.io", "name.co", "other.dev", ...]
}
```

**TLD priority:**
1. Always try .com first (universal trust)
2. .io, .co (startup standards)
3. .ai (for AI projects), .dev (dev tools), .app (apps)
4. .xyz, .net, .me, .one (alternatives)

**Skip these** (spammy): .online, .site, .website, .biz, .info, .top, .click

### Step 4: Iterate if Needed

If fewer than 10 available:
1. Generate 10-15 NEW name ideas
2. Call `check_domains` again
3. Max 3 rounds total

### Step 5: Present Results

**⚠️ USE THE MANDATORY OUTPUT FORMAT FROM THE TOP OF THIS DOCUMENT.**

Group by TLD type. Number each domain. Include "Why:" for each. End with Top 3 recommendations.

DO NOT use tables. DO NOT group by theme/concept.
