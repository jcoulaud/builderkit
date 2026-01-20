# Builderkit

Plugins for [Claude Code](https://claude.ai/code).

## Plugins

### Domain Finder

Check domain availability while brainstorming with Claude. No more "oh that's taken" moments.

**Install:**
```
/install jcoulaud/builderkit/domain-finder
```

**Use it:**
```
/domain-finder:brainstorm crypto project tracker
/domain-finder:check mycoolapp.io
```

Or just ask naturally:
> "I'm building a habit tracker, what domains are available?"

**Features:**
- Finds 10+ available domains
- Smart TLD selection (prioritizes .com, .io, .co, then category-specific)
- Expert recommendations with reasoning

**Output:**
```
## ✓ Available Domains

1. ✓ `projectpulse.com`
   **Why:** Premium TLD, instant credibility

2. ✓ `projectpulse.io`
   **Why:** Tech-forward, startup-friendly

---

🏆 **Top Pick: `projectpulse.com`**
🥈 **Runner-up: `projectpulse.io`**
🥉 **Budget Pick: `trackr.xyz`**
```

[Full docs →](./plugins/domain-finder)

---

## License

MIT - Do whatever you want with it.
