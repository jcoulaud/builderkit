# Builderkit - Claude Code plugins for builders

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Plugins for [Claude Code](https://claude.ai/code).

Built things I needed, sharing them here. More plugins coming as I build more stuff.

## Contents

- [Domain Finder](#domain-finder) - Check domain availability while brainstorming with Claude

---

## Domain Finder

When brainstorming project ideas with Claude, I got tired of checking if domains were available manually. So I built this - Claude now checks availability automatically when suggesting domain names.

### Install

```
/plugin marketplace add jcoulaud/builderkit
/plugin install domain-finder@builderkit
```

### Use it

Just ask Claude naturally:
> "I'm building a habit tracker, what domains are available?"

Or use slash commands:
```
/domain-finder:brainstorm project management app for designers
/domain-finder:check mycoolapp.io
```

[Full documentation →](./plugins/domain-finder)

### Output

| Domain | Status | Register |
|--------|--------|----------|
| designflow.io | ✓ Available | [Namecheap](https://namecheap.com) · [Porkbun](https://porkbun.com) |
| projectcanvas.dev | ✓ Available | [Namecheap](https://namecheap.com) · [Porkbun](https://porkbun.com) |
| designerpm.com | ✗ Taken | Expires 2026-05 |

---

## Ideas? Issues?

[Open an issue](https://github.com/jcoulaud/builderkit/issues) or submit a PR.

## License

MIT - Do whatever you want with it.
