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

## CRITICAL RULES

1. **USE MCP TOOL ONLY** - Use `check_domains` MCP tool. NEVER use bash, whois, dig, or any CLI fallback
2. **FIND 10+ AVAILABLE** - Keep checking until you find at least 10 available domains
3. **SHOW ONLY 10-12** - Display only the best 10-12 domains in your response, curated across TLD categories
4. **BATCH CHECKING** - Check 15-20 domains per call. If fewer than 10 available, generate more
5. **MAX 3 ROUNDS** - Stop after 3 rounds even if you haven't found 10

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

---

## ⛔ OUTPUT FORMAT - READ THIS LAST BEFORE RESPONDING

**You MUST format your response EXACTLY as shown below. This is not optional.**

### ❌ FORBIDDEN - Your response will be rejected if you use:

- Tables of any kind (`| Domain | Status |` etc.)
- Grouping by theme/concept ("Nature Theme:", "Tech Theme:", etc.)
- Bullet lists without numbers
- Missing the Top 3 Recommendations section

### ✅ REQUIRED - Format your response EXACTLY like this:

## ✓ Available Domains

### .com (Premium)

1. ✓ `firstdomain.com`
   **Why:** One sentence explaining why this domain works

2. ✓ `seconddomain.com`
   **Why:** One sentence explaining why this domain works

### .io / .co (Startup-friendly)

3. ✓ `example.io`
   **Why:** One sentence explaining why this domain works

4. ✓ `another.co`
   **Why:** One sentence explaining why this domain works

### .dev / .app / .ai (Tech-specific)

5. ✓ `example.dev`
   **Why:** One sentence explaining why this domain works

### Other TLDs

6. ✓ `example.xyz`
   **Why:** One sentence explaining why this domain works

---

## 🏆 Top Recommendations

🏆 **Top Pick: `best.io`**
- First reason this is the top pick
- Second reason

🥈 **Runner-up: `second.com`**
- First reason
- Second reason

🥉 **Budget Pick: `third.xyz`**
- Only ~$10/year
- Other benefit

---

💡 Want me to explore a different naming direction?

### FINAL CHECKLIST - Verify before responding:

- [ ] Showing only 10-12 best domains (not all available ones)
- [ ] Domains grouped by TLD type (.com, .io/.co, .dev/.app/.ai, Other)
- [ ] Each domain numbered sequentially with `✓` prefix
- [ ] Each domain has a `**Why:**` line underneath
- [ ] Response includes 🏆 Top Recommendations section with Top Pick, Runner-up, Budget Pick
- [ ] Response ends with 💡 prompt
- [ ] NO TABLES anywhere in response
- [ ] NO grouping by theme or concept
