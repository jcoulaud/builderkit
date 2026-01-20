# Domain Finder

Check domain availability directly in Claude. Works with both **Claude Desktop** and **Claude Code**.

When brainstorming with Claude, it checks if domains are actually available before suggesting them. No more "oh that's taken" moments.

## Install

### Claude Desktop

Add this to your Claude Desktop config file:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

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

Restart Claude Desktop and you're done.

### Claude Code

```
/plugin marketplace add jcoulaud/builderkit
/plugin install domain-finder@builderkit
```

## Usage

### Just ask naturally

Mention domains in conversation and Claude will check availability:

> "I'm building a habit tracker called Streakly, what domain should I get?"

> "Is example.io available?"

> "Brainstorm domain names for a fitness app"

Claude will check availability automatically.

### Claude Code slash commands

If using Claude Code, you can also use the slash commands:

```
/domain-finder:brainstorm fitness app for busy professionals
/domain-finder:check mycoolapp.io
```

### Output

| Domain | Status | Register |
|--------|--------|----------|
| fitbusy.io | ✓ Available | [Namecheap](https://namecheap.com) · [Porkbun](https://porkbun.com) |
| quickfit.app | ✓ Available | [Namecheap](https://namecheap.com) · [Porkbun](https://porkbun.com) |
| busyfit.com | ✗ Taken | Expires 2026-08 |

## Supported TLDs

.com, .io, .dev, .app, .ai, .co, .net, .org, .xyz, and 1000+ more.

## How it works

Uses RDAP (official registry protocol) with DNS and WHOIS fallbacks. All lookups happen through a Cloudflare Worker - fast and reliable.

## License

MIT - Do whatever you want with it.
