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
        description: 'Check domain availability. IMPORTANT: Output is already formatted as markdown tables - display it EXACTLY as returned, do not reformat or add text.',
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
        description: 'Check if a single domain is available. Display the output directly.',
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

      // Format results as a markdown table
      const results = data.results || [];
      const available = results.filter(r => r.available);
      const taken = results.filter(r => !r.available && !r.error);
      const errors = results.filter(r => r.error);

      let output = '';

      if (available.length > 0) {
        output += `**✓ Available (${available.length})**\n\n`;
        output += '| Domain |\n|--------|\n';
        for (const d of available) {
          output += `| ${d.domain} |\n`;
        }
        output += '\n';
      }

      if (taken.length > 0) {
        output += `**✗ Taken (${taken.length})**\n\n`;
        output += '| Domain | Registrar |\n|--------|----------|\n';
        for (const d of taken) {
          const registrar = d.registrar || 'Unknown';
          output += `| ${d.domain} | ${registrar} |\n`;
        }
        output += '\n';
      }

      if (errors.length > 0) {
        output += `**⚠ Errors (${errors.length})**\n\n`;
        for (const d of errors) {
          output += `- ${d.domain}: ${d.error}\n`;
        }
        output += '\n';
      }

      if (available.length === 0 && taken.length === 0 && errors.length === 0) {
        output = 'No results returned from API.';
      }

      return {
        content: [
          {
            type: 'text',
            text: output
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
      const result = data.results?.[0];

      if (!result) {
        return {
          content: [{ type: 'text', text: 'No result returned from API.' }]
        };
      }

      let output = '';
      if (result.error) {
        output = `⚠ Error checking ${domain}: ${result.error}`;
      } else if (result.available) {
        output = `✓ **${domain}** is available`;
      } else {
        const registrar = result.registrar || 'Unknown';
        output = `✗ **${domain}** is taken (${registrar})`;
      }

      return {
        content: [{ type: 'text', text: output }]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `⚠ API request failed: ${error.message}`
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
