# Domain Finder

Check domain availability directly in Claude Code.

When brainstorming with Claude, it checks if domains are actually available before suggesting them. No more "oh that's taken" moments.

## Install

```
/plugin marketplace add jcoulaud/builderkit
/plugin install domain-finder@builderkit
```

## Usage

### Brainstorm domains for your project

```
/domain-finder:brainstorm fitness app for busy professionals
```

Output:

| Domain | Status | Register |
|--------|--------|----------|
| fitbusy.io | ✓ Available | [Namecheap](https://namecheap.com) · [Porkbun](https://porkbun.com) |
| quickfit.app | ✓ Available | [Namecheap](https://namecheap.com) · [Porkbun](https://porkbun.com) |
| busyfit.com | ✗ Taken | Expires 2026-08 |

### Check a specific domain

```
/domain-finder:check mycoolapp.io
```

### Or just ask naturally

You don't need the command. Just mention domains in conversation:

> "I'm building a habit tracker called Streakly, what domain should I get?"

Claude will check availability automatically.

## Supported TLDs

.com, .io, .dev, .app, .ai, .co, .net, .org, .xyz, and 1000+ more.

## How it works

Uses RDAP (official registry protocol) with DNS and WHOIS fallbacks. All lookups happen through a Cloudflare Worker - fast and reliable.

## License

MIT - Do whatever you want with it.
