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

## CRITICAL RULES

1. **FIND 10 AVAILABLE** - Keep checking until you find at least 10 available domains
2. **USE MCP TOOL ONLY** - You MUST use the `check_domains` MCP tool. NEVER use bash, whois, or any fallback
3. **BATCH CHECKING** - Check 15-20 domains per call. If fewer than 10 available, generate more and check again
4. **MAX 3 ROUNDS** - Stop after 3 rounds even if you haven't found 10

⚠️ If `check_domains` is not available, STOP and tell the user to restart Claude Code.

## TLD Guide

Focus on TLDs people actually use and trust:

### Tier 1 - Universal (always consider)
| TLD | Best For | Notes |
|-----|----------|-------|
| **.com** | Everything | Universal trust, always try first |
| **.io** | Tech, SaaS, startups | Very popular with developers |
| **.co** | Startups, brands | Great .com alternative |
| **.ai** | AI/ML products | Premium (~$80/yr) but worth it for AI |
| **.app** | Apps, SaaS | Google-owned, requires HTTPS |
| **.dev** | Developer tools | Google-owned, cheap, credible |

### Tier 2 - Popular alternatives
| TLD | Best For | Notes |
|-----|----------|-------|
| **.xyz** | Modern, web3, creative | Cheap (~$10/yr), used by Google (abc.xyz) |
| **.net** | Tech, networks | Classic fallback |
| **.org** | Non-profits, communities | Trusted, established |
| **.me** | Personal brands, portfolios | About.me made it popular |
| **.one** | Singular products, brands | Clean and short |
| **.so** | Tech startups | Short and trendy |

### Tier 3 - Niche but recognized
| TLD | Best For | Notes |
|-----|----------|-------|
| **.design** | Design agencies | Recognized in creative space |
| **.studio** | Creative studios | Good for agencies |
| **.tech** | Technology companies | Decent alternative |
| **.blog** | Blogs, content sites | Clear purpose |
| **.cloud** | Cloud services | Tech-specific |
| **.art** | Artists, galleries | Niche but fitting |
| **.shop** | E-commerce | Clear commerce intent |
| **.store** | E-commerce | Alternative to .shop |
| **.club** | Communities, memberships | Social/community projects |
| **.live** | Streaming, live events | Media/entertainment |
| **.tv** | Video, streaming | Media-focused |
| **.pro** | Professional services | Business-focused |
| **.ink** | Creative, writers | Unique option |
| **.fit** | Fitness, health | Health/fitness niche |
| **.health** | Healthcare | Medical/health niche |
| **.vip** | Premium brands | Exclusive feel |
| **.fun** | Entertainment, games | Playful projects |

**Skip these** (low trust, spammy): .online, .site, .website, .biz, .info, .top, .click, .link, .space, .world, .digital, .zone, .network, .systems

## TLD Selection Strategy

**For every project, prioritize in this order:**

1. **Always check .com first** - It's still king
2. **Add .io** - Standard for tech/startups
3. **Add .co** - Clean .com alternative
4. **Add project-specific TLDs based on type:**
   - AI project → .ai
   - Developer tool → .dev
   - Mobile app → .app
   - Creative agency → .design, .studio
   - E-commerce → .shop, .store
   - Content/blog → .blog, .me
   - Fitness/health → .fit, .health
   - Video/streaming → .tv, .live
   - Community → .club, .org
   - Personal brand → .me, .one

**Distribution per batch:**
- 60% Tier 1 TLDs (.com, .io, .co, .ai, .app, .dev)
- 30% Tier 2 TLDs (.xyz, .net, .me, .one, .so)
- 10% Tier 3 TLDs (only if relevant to project type)

## What Makes a Good Domain

✓ **Short** — Under 12 characters ideal, max 15
✓ **Memorable** — Easy to recall after hearing once
✓ **Pronounceable** — Can be said clearly over phone
✓ **No hyphens** — Hard to communicate verbally
✓ **Brandable** — Unique enough to build identity around
✓ **Intuitive spelling** — No confusion about how to write it

## Naming Techniques

- **Compound words** — DropBox, SnapChat, YouTube
- **Verb + noun** — SendGrid, PushOver, MixPanel
- **Truncations** — Tumblr, Flickr, Scribd
- **Portmanteaus** — Instagram (Instant + Telegram), Pinterest (Pin + Interest)
- **Made-up words** — Spotify, Hulu, Etsy
- **Misspellings** — Lyft, Fiverr, Reddit

## Workflow

### Step 1: Understand the Project

Identify:
- What they're building (SaaS, app, agency, etc.)
- Target audience (developers, consumers, enterprises)
- Desired vibe (professional, playful, technical, friendly)

### Step 2: Generate Names (silently)

Create 15-20 domain ideas:
- Try the same name across multiple TLDs (name.com, name.io, name.co)
- Mix naming techniques
- Keep them short and brandable

### Step 3: Check Availability

Call `check_domains` MCP tool with all domains:
```json
{
  "domains": ["name.com", "name.io", "name.co", "other.dev", ...]
}
```

### Step 4: Iterate if Needed

If fewer than 10 available:
1. Generate 10-15 NEW name ideas (different from before)
2. Call `check_domains` again
3. Max 3 rounds total

### Step 5: Present Results

Show only available domains, grouped logically:

```
## ✓ Available Domains

### .com (Premium)

1. ✓ `snippetbox.com`
   **Why:** Clear, memorable, .com = instant trust

2. ✓ `codeclip.com`
   **Why:** Short (8 chars), action-oriented

### .io / .co (Startup-friendly)

3. ✓ `snippet.io`
   **Why:** Ultra short, tech-native

4. ✓ `devpaste.co`
   **Why:** Developer-focused, clean

### .dev / .app (Tech-specific)

5. ✓ `codebox.dev`
   **Why:** Perfect TLD for dev tools

6. ✓ `sharecode.app`
   **Why:** Descriptive, mobile-friendly

---

## 🏆 Top Recommendations

🏆 **Top Pick: `snippet.io`**
- 7 characters, extremely short
- .io is trusted in tech
- Easy to type and remember

🥈 **Runner-up: `snippetbox.com`**
- .com = maximum credibility
- Descriptive and brandable

🥉 **Budget Pick: `codebox.xyz`**
- Only ~$10/year
- Modern feel

---

💡 Want me to explore a different naming direction?
```

## Output Rules

- **Only show available domains** — Skip taken ones entirely
- **Group by TLD type** — .com first, then .io/.co, then others
- **Number each domain** — Easy to reference
- **Include "Why:"** — 1-line reasoning for each
- **Top 3 recommendations** — With brief explanation
- **Offer to continue** — Different direction or more options
