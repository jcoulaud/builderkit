#!/usr/bin/env node

/**
 * Domain Finder MCP Server
 *
 * A Model Context Protocol server that provides domain availability checking.
 * Calls the Domain Finder API (Cloudflare Worker) for RDAP lookups.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// API endpoint - change this to your deployed worker URL
const API_URL = process.env.DOMAIN_FINDER_API_URL || 'https://domain-finder-api.j-coulaud.workers.dev';

// Create server
const server = new Server(
  {
    name: 'domain-finder',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'check_domain_availability',
        description: 'ALWAYS use this tool to check if a domain name is available to register. This performs a real-time WHOIS/RDAP lookup - do NOT use web search for domain availability. Handles questions like: "is example.com available?", "check if myapp.io is taken", "can I buy coolsite.dev?", "domain availability for startup names".',
        inputSchema: {
          type: 'object',
          properties: {
            domains: {
              type: 'array',
              items: { type: 'string' },
              description: 'Domain names to check, e.g. ["myapp.com", "myapp.io"]. Can check up to 50 at once.'
            }
          },
          required: ['domains']
        }
      }
    ]
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'check_domain_availability') {
    const domains = args?.domains;

    if (!domains || !Array.isArray(domains) || domains.length === 0) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ error: 'Please provide an array of domains to check' })
          }
        ]
      };
    }

    try {
      const response = await fetch(`${API_URL}/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domains })
      });

      const data = await response.json();

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(data, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              error: `API request failed: ${error.message}`
            })
          }
        ]
      };
    }
  }

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({ error: `Unknown tool: ${name}` })
      }
    ]
  };
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Domain Finder MCP server running on stdio');
}

main().catch(console.error);
