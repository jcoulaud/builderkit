# Domain Finder MCP Server

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

MCP server that checks domain name availability. Backend for the domain-finder plugin.

## Tools

| Tool | Description | Limit |
|------|-------------|-------|
| `check_domains` | Check multiple domains at once | Up to 50 |
| `check_single_domain` | Check a single domain | 1 |

### Response format

```json
{
  "domain": "example.com",
  "available": false,
  "status": "registered",
  "registrar": "GoDaddy",
  "expires": "2025-12-01"
}
```

Status values: `available`, `registered`, `unknown`

## Architecture

```
Claude Code → MCP Server → Cloudflare Worker → RDAP/DNS
```

The MCP server is a thin wrapper. The heavy lifting (RDAP lookups, DNS fallback, caching) happens in the Cloudflare Worker.

## License

MIT
