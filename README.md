# Builderkit - Claude plugins for builders

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Plugins for [Claude Desktop](https://claude.ai/download) and [Claude Code](https://claude.ai/code).

Built things I needed, sharing them here. More plugins coming as I build more stuff.

## Contents

- [Domain Finder](#domain-finder) - Check domain availability while brainstorming with Claude

---

## Domain Finder

[![npm version](https://img.shields.io/npm/v/@jcoulaud/domain-finder-mcp.svg)](https://www.npmjs.com/package/@jcoulaud/domain-finder-mcp)

When brainstorming project ideas with Claude, I got tired of checking if domains were available manually. So I built this - Claude now checks availability automatically when suggesting domain names.

### Install

#### Claude Code

```
/plugin marketplace add jcoulaud/builderkit
/plugin install domain-finder@builderkit
```

#### Claude Desktop

Add to your config:

- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "domain-finder": {
      "command": "npx",
      "args": ["-y", "@jcoulaud/domain-finder-mcp"]
    }
  }
}
```

Then restart Claude Desktop.

### Use it

Just ask Claude naturally:
> "I'm building a habit tracker, what domains are available?"

Or use slash commands in Claude Code:
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
