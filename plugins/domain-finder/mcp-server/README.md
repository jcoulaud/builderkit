# Domain Finder MCP Server

An MCP server that checks domain name availability. Works with **Claude Desktop** and **Claude Code**.

## Claude Desktop

Add to your config file:

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

## Usage

Just ask Claude naturally:

- "Is example.io available?"
- "I'm building a habit tracker called Streakly, what domain should I get?"
- "Brainstorm domain names for a fitness app"

Claude will check availability automatically.

## Tools

This server provides two tools:

- `check_domains` - Check multiple domains at once (up to 50)
- `check_single_domain` - Check a single domain

## Supported TLDs

.com, .io, .dev, .app, .ai, .co, .net, .org, .xyz, and 1000+ more.

## How it works

Uses RDAP (official registry protocol) with DNS fallbacks. All lookups happen through a Cloudflare Worker.

## License

MIT
