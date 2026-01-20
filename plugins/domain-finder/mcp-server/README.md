# Domain Finder MCP Server

Internal MCP server for the domain-finder plugin. Used by Claude Code.

## Tools

| Tool | Description |
|------|-------------|
| `check_domains` | Check multiple domains at once (up to 50) |
| `check_single_domain` | Check a single domain |

## How it works

Uses RDAP (official registry protocol) with DNS fallbacks. All lookups happen through a Cloudflare Worker.

## License

MIT
