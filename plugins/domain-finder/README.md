# Domain Finder

Check domain availability directly in Claude Code.

When brainstorming with Claude, it checks if domains are actually available before suggesting them. No more "oh that's taken" moments.

## Install

```
/install jcoulaud/builderkit/domain-finder
```

## Usage

### Just ask naturally

Mention domains in conversation and Claude will check availability:

> "I'm building a habit tracker called Streakly, what domain should I get?"

> "Is example.io available?"

> "Brainstorm domain names for a crypto project"

Claude will check availability automatically.

### Slash commands

```
/domain-finder:brainstorm fitness app for busy professionals
/domain-finder:check mycoolapp.io
```

## Features

- **Finds 10+ available domains** — Keeps checking until it finds enough options
- **Smart TLD selection** — Prioritizes .com, .io, .co, .app, then adds category-specific TLDs
- **Grouped by category** — Results organized by TLD type
- **Expert recommendations** — Top picks with reasoning

## Output

```
## ✓ Available Domains

### Traditional (.com, .co, .net)

1. ✓ `fitpulse.com`
   **Why:** Premium TLD, instant credibility

2. ✓ `fitpulse.co`
   **Why:** Modern .com alternative

### Tech (.io, .dev, .app)

3. ✓ `fitpulse.io`
   **Why:** Tech-forward, startup-friendly

4. ✓ `quickfit.app`
   **Why:** Perfect for mobile apps

---

## 🏆 Top Recommendations

🏆 **Top Pick: `fitpulse.com`**
- Premium .com domain
- Short and brandable

🥈 **Runner-up: `fitpulse.io`**
- Tech-native feel

🥉 **Budget Pick: `quickfit.xyz`**
- Affordable renewal
```

## Supported TLDs

1500+ TLDs supported including .com, .io, .dev, .app, .ai, .co, .xyz, .net, .org, .tech, .design, .store, .finance, .health, and many more.

## How it works

Uses RDAP (official registry protocol) with DNS fallback. All lookups happen through a Cloudflare Worker — fast and reliable.

## License

MIT - Do whatever you want with it.
