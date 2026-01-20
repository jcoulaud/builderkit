# Domain Finder

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Check domain availability directly in Claude Code.

When brainstorming with Claude, it checks if domains are actually available before suggesting them. Saves the back-and-forth with registrars.

## Install

```
/plugin marketplace add jcoulaud/builderkit
/plugin install domain-finder@builderkit
```

## Usage

### Just ask naturally

Mention domains in conversation and Claude will check availability:

> "I'm building a habit tracker called Streakly, what domain should I get?"

> "Is example.io available?"

> "Brainstorm domain names for a crypto project"

### Slash commands

```
/domain-finder:brainstorm fitness app for busy professionals
/domain-finder:check mycoolapp.io
```

## What you get

- Generates creative domain ideas based on your project
- Checks availability across 1000+ TLDs
- Finds 10+ available options
- Groups results by TLD type
- Recommends top picks with reasoning

Prioritizes TLDs people trust (.com, .io, .co, .ai, .app, .dev). Skips the spammy ones.

## How it works

Uses RDAP (official registry protocol) with DNS fallback. All lookups go through a Cloudflare Worker — fast and reliable. No API keys needed.

## License

MIT
