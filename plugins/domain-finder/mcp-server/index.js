#!/usr/bin/env node

/**
 * Domain Finder MCP Server
 *
 * Minimal MCP implementation without SDK dependencies.
 * Implements JSON-RPC 2.0 over stdio for the Model Context Protocol.
 */

import * as readline from 'readline';

const API_URL = process.env.DOMAIN_FINDER_API_URL || 'https://domain-finder-api.j-coulaud.workers.dev';

// Tools definition
const TOOLS = [
  {
    name: 'check_domains',
    description: 'Check availability of multiple domains. Returns JSON with available/taken arrays.',
    inputSchema: {
      type: 'object',
      properties: {
        domains: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of domain names to check (max 50)'
        }
      },
      required: ['domains']
    }
  },
  {
    name: 'check_single_domain',
    description: 'Check if a single domain is available.',
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
];

// Send JSON-RPC response
function send(response) {
  const json = JSON.stringify(response);
  process.stdout.write(json + '\n');
}

// Send success response
function sendResult(id, result) {
  send({ jsonrpc: '2.0', id, result });
}

// Send error response
function sendError(id, code, message) {
  send({ jsonrpc: '2.0', id, error: { code, message } });
}

// Handle check_domains tool
async function checkDomains(domains) {
  if (!domains || !Array.isArray(domains) || domains.length === 0) {
    return { error: 'Please provide an array of domains to check' };
  }

  try {
    const response = await fetch(`${API_URL}/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domains })
    });

    const data = await response.json();
    const results = data.results || [];

    const available = results.filter(r => r.available).map(r => r.domain);
    const taken = results.filter(r => !r.available && !r.error).map(r => r.domain);
    const errors = results.filter(r => r.error).map(r => ({ domain: r.domain, error: r.error }));

    return { available, taken, errors };
  } catch (error) {
    return { error: `API request failed: ${error.message}` };
  }
}

// Handle check_single_domain tool
async function checkSingleDomain(domain) {
  if (!domain || typeof domain !== 'string') {
    return { error: 'Please provide a domain to check' };
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
      return { error: 'No result returned from API' };
    }

    if (result.error) {
      return { domain, available: false, error: result.error };
    }

    return {
      domain,
      available: result.available,
      registrar: result.registrar || null
    };
  } catch (error) {
    return { error: `API request failed: ${error.message}` };
  }
}

// Handle incoming JSON-RPC messages
async function handleMessage(message) {
  const { id, method, params } = message;

  switch (method) {
    case 'initialize':
      return sendResult(id, {
        protocolVersion: '2025-11-25',
        capabilities: { tools: {} },
        serverInfo: { name: 'domain-finder', version: '1.0.0' }
      });

    case 'notifications/initialized':
      // No response needed for notifications
      return;

    case 'tools/list':
      return sendResult(id, { tools: TOOLS });

    case 'tools/call': {
      const { name, arguments: args } = params || {};
      let result;

      if (name === 'check_domains') {
        result = await checkDomains(args?.domains);
      } else if (name === 'check_single_domain') {
        result = await checkSingleDomain(args?.domain);
      } else {
        return sendError(id, -32601, `Unknown tool: ${name}`);
      }

      return sendResult(id, {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
      });
    }

    default:
      return sendError(id, -32601, `Method not found: ${method}`);
  }
}

// Main: read JSON-RPC from stdin
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', async (line) => {
  if (!line.trim()) return;

  try {
    const message = JSON.parse(line);
    await handleMessage(message);
  } catch (error) {
    sendError(null, -32700, `Parse error: ${error.message}`);
  }
});

process.stderr.write('Domain Finder MCP server running\n');
