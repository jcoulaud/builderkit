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
        name: 'check_domains',
        description: 'Check if domain names are available for registration. Returns availability status, registrar info for taken domains, and expiration dates. Use this to verify domain availability before suggesting names to users.',
        inputSchema: {
          type: 'object',
          properties: {
            domains: {
              type: 'array',
              items: { type: 'string' },
              description: 'List of domain names to check (e.g., ["myapp.com", "myapp.io", "myapp.dev"]). Max 50 domains per request.'
            }
          },
          required: ['domains']
        }
      },
      {
        name: 'check_single_domain',
        description: 'Check if a single domain name is available for registration.',
        inputSchema: {
          type: 'object',
          properties: {
            domain: {
              type: 'string',
              description: 'Domain name to check (e.g., "example.com")'
            }
          },
          required: ['domain']
        }
      }
    ]
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'check_domains') {
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

  if (name === 'check_single_domain') {
    const domain = args?.domain;

    if (!domain || typeof domain !== 'string') {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ error: 'Please provide a domain to check' })
          }
        ]
      };
    }

    try {
      const response = await fetch(`${API_URL}/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domains: [domain] })
      });

      const data = await response.json();
      const result = data.results?.[0] || { error: 'No result returned' };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2)
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
