# Builderkit - Claude Code Plugins

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Plugins for [Claude Code](https://claude.ai/code).

Built for my own projects. Sharing what's useful.

## Contents

- [Domain Finder](#domain-finder) - Check domain availability while brainstorming

---

## Domain Finder

When brainstorming project ideas with Claude, I got tired of checking if domains were available manually. So I built this — Claude now checks availability automatically when suggesting domain names.

### Install

```
/plugin marketplace add jcoulaud/builderkit
/plugin install domain-finder@builderkit
```

### Use it

Just ask Claude naturally:

> "I'm building a habit tracker, what domains are available?"

Or use the slash commands:
```
/domain-finder:brainstorm crypto trading app
/domain-finder:check mycoolapp.io
```

**What you get:**
- 10+ available domain suggestions
- Smart TLD selection (.com, .io, .ai, .app, .dev, etc.)
- Recommendations with reasoning

[Full docs →](./plugins/domain-finder)

---

## License

MIT
