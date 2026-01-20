# Domain Finder MCP Server

[![npm version](https://img.shields.io/npm/v/@jcoulaud/domain-finder-mcp.svg)](https://www.npmjs.com/package/@jcoulaud/domain-finder-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

An MCP server that checks domain name availability. Works with **Claude Desktop** and **Claude Code**.

## Install

### Claude Code

```
/plugin marketplace add jcoulaud/builderkit
/plugin install domain-finder@builderkit
```

### Claude Desktop

Add to your config file:

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

Restart Claude Desktop and you're done.

## Usage

Just ask Claude naturally:

- "Is example.io available?"
- "I'm building a habit tracker called Streakly, what domain should I get?"
- "Brainstorm domain names for a fitness app"

Claude will check availability automatically.

## Tools

| Tool | Description |
|------|-------------|
| `check_domain_availability` | Check if domains are available (up to 50 at once) |

### Response format

Each domain check returns:

```json
{
  "domain": "example.com",
  "available": false,
  "status": "registered",
  "expires": "2025-12-01"
}
```

Possible `status` values:
- `available` - Domain is available for registration
- `registered` - Domain is taken
- `unknown` - Could not determine status (rare TLDs)

## Supported TLDs

.com, .io, .dev, .app, .ai, .co, .net, .org, .xyz, and 1000+ more.

## How it works

Uses RDAP (official registry protocol) with DNS fallbacks. All lookups happen through a Cloudflare Worker.

## License

MIT
