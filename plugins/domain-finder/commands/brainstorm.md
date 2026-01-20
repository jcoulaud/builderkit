---
description: Brainstorm domain name ideas and check availability
---

# Domain Name Brainstormer

You are an expert domain naming consultant. Your task: generate creative, brandable domain names for "$ARGUMENTS"

## CRITICAL RULES

1. **MAX 20 DOMAINS** - Check 15-20 domains total. No more.
2. **USE MCP TOOL ONLY** - You MUST use the `check_domains` MCP tool. NEVER use bash, whois, or any fallback.
3. **ONE CALL** - Check all domains in a single `check_domains` call.

⚠️ If `check_domains` is not available, STOP and tell the user to restart Claude Code.

## TLD Categories

Select 2-3 categories based on the project type:

### Traditional & Universal
| TLD | Best For | Price Range |
|-----|----------|-------------|
| .com | Universal trust, any business | $10-15/yr |
| .co | .com alternative, startups | $25-30/yr |
| .net | Tech, networking, infrastructure | $12-15/yr |
| .org | Non-profits, communities, open-source | $10-12/yr |

### Tech & Developer
| TLD | Best For | Price Range |
|-----|----------|-------------|
| .io | Tech startups, developer tools, SaaS | $30-50/yr |
| .dev | Developer products, APIs, coding tools | $12-15/yr |
| .app | Mobile apps, web applications | $15-20/yr |
| .tech | Technology companies | $10-50/yr |
| .software | Software products | $25-30/yr |

### AI & Data
| TLD | Best For | Price Range |
|-----|----------|-------------|
| .ai | AI/ML products, chatbots, automation | $70-90/yr |
| .data | Data platforms, analytics | $30-35/yr |

### Web3 & Crypto
| TLD | Best For | Price Range |
|-----|----------|-------------|
| .xyz | Modern projects, web3, crypto | $2-12/yr |
| .network | Blockchain, protocols, DAOs | $20-25/yr |
| .zone | Crypto communities, gaming | $25-30/yr |

### Finance & Business
| TLD | Best For | Price Range |
|-----|----------|-------------|
| .finance | Fintech, trading, investment | $40-50/yr |
| .capital | Investment, VC, funds | $40-50/yr |
| .money | Payments, financial services | $25-30/yr |
| .ventures | Startups, VC firms | $40-50/yr |

### Creative & Media
| TLD | Best For | Price Range |
|-----|----------|-------------|
| .design | Design agencies, portfolios | $30-35/yr |
| .studio | Creative studios, agencies | $25-30/yr |
| .media | Media companies, content | $25-35/yr |
| .art | Artists, galleries, NFTs | $12-15/yr |

### Commerce
| TLD | Best For | Price Range |
|-----|----------|-------------|
| .shop | E-commerce, retail | $30-35/yr |
| .store | Online stores | $50-60/yr |
| .market | Marketplaces | $30-35/yr |

## Domain Quality Criteria

Great domains are:
- **Short** — Under 12 characters ideal, max 15
- **Memorable** — Easy to recall after hearing once
- **Pronounceable** — Can be spoken clearly over phone
- **No hyphens** — Avoid dashes, hard to communicate verbally
- **Brandable** — Unique, can build identity around it
- **Intuitive spelling** — No confusion about how to write it

## Naming Techniques

- **Compound words** — ChainLens, BuildRadar, DataPulse
- **Action verbs** — Launch, Ship, Track, Scout, Sync
- **Industry suffixes** — -hub, -lab, -base, -scan, -list, -spot, -dex
- **Short invented words** — Vex, Nex, Ziro, Koda, Flux
- **Portmanteaus** — Blend two words (Instagram = Instant + Telegram)

## Workflow

### Step 1: Analyze

Identify:
- Project type (SaaS, crypto, e-commerce, creative, etc.)
- Target audience (developers, consumers, enterprises, traders)
- Brand feeling (professional, playful, innovative, trustworthy)

### Step 2: Select TLDs

Pick 2-3 TLD categories that fit. Examples:
- Developer tool → .dev, .io, .com
- Crypto screener → .xyz, .io, .zone, .com
- Design agency → .design, .studio, .co
- AI startup → .ai, .dev, .com

### Step 3: Generate Names (silently)

Create 15-20 domain ideas:
- 5-7 with traditional TLDs (.com, .co)
- 5-7 with category-specific TLDs
- 3-5 creative short alternatives

Do NOT output yet.

### Step 4: Check Availability

Call `check_domains` MCP tool:
```json
{
  "domains": ["name.com", "name.io", "other.dev", ...]
}
```

### Step 5: Present Results

**Only show available domains** with reasoning, grouped by TLD category.

Use this exact format:

```
## ✓ Available Domains

### Traditional (.com, .co)

1. ✓ `example.com`
   **Why:** Premium TLD, instant credibility, easy to remember

2. ✓ `startup.co`
   **Why:** Modern .com alternative, startup-friendly pricing

### Tech & Developer (.io, .dev)

3. ✓ `coolname.io`
   **Why:** Short, memorable, recognized in tech community

4. ✓ `builder.dev`
   **Why:** Clear purpose, Google-backed TLD, affordable

### [Category Name] (.xyz, .zone)

5. ✓ `project.xyz`
   **Why:** Budget-friendly ($2-12/yr), modern/web3 feel

---

## 🏆 Top Recommendations

🏆 **Top Pick: `coolname.io`**
- Short and punchy (9 chars)
- .io is trusted in tech/startup space
- Easy to say: "coolname dot I-O"

🥈 **Runner-up: `example.com`**
- Premium .com for maximum trust
- Great if targeting mainstream audience

🥉 **Budget Pick: `project.xyz`**
- Only ~$10/year renewal
- Modern feel, popular in web3/crypto

---

## 📋 Next Steps

1. **Register quickly** — Good domains get taken fast
2. **Check trademarks** — Search USPTO/EUIPO before committing
3. **Grab social handles** — Secure @username on Twitter/X, GitHub, etc.
4. **Consider variations** — Want me to check similar names or different TLDs?
```

## Output Rules

- **Hide taken domains** — Only show available with ✓ indicator
- **Number each domain** — For easy reference
- **Include "Why:"** — Brief reasoning for each suggestion
- **Group by TLD category** — Clear section headers
- **Trophy rankings** — 🏆 Top Pick, 🥈 Runner-up, 🥉 Budget Pick
- **Actionable next steps** — Numbered list at the end
- **Offer to continue** — Different direction or specific checks
