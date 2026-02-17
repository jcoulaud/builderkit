/**
 * Domain Finder MCP Server - Cloudflare Worker
 *
 * Stateless MCP server that checks domain availability using:
 * 1. RDAP (primary) - official registry protocol, supplemented with known ccTLD servers
 * 2. DNS fallback - for TLDs without RDAP
 * 3. whois.vu API fallback - free JSON WHOIS lookup with broad ccTLD coverage
 * 4. whois.com fallback - last-resort HTML scraping
 */

import { createMcpHandler } from 'agents/mcp';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { parse } from 'tldts';
import { z } from 'zod';

// Types
interface DomainResult {
  domain: string;
  available: boolean;
  registrar?: string;
  expires?: string;
  method?: 'rdap' | 'dns' | 'whoisvu' | 'whois';
  error?: string;
}

interface IanaBootstrap {
  version: string;
  services: [string[], string[]][];
}

interface DnsResponse {
  Status: number;
  Answer?: { name: string; type: number; TTL: number; data: string }[];
}

interface RdapResponse {
  objectClassName?: string;
  handle?: string;
  ldhName?: string;
  entities?: RdapEntity[];
  events?: RdapEvent[];
}

interface RdapEntity {
  objectClassName?: string;
  handle?: string;
  roles?: string[];
  vcardArray?: [string, VCardProperty[]];
}

type VCardProperty = [string, Record<string, string>, string, string];

interface RdapEvent {
  eventAction: string;
  eventDate: string;
}

// Constants
const IANA_BOOTSTRAP_URL = 'https://data.iana.org/rdap/dns.json';
const DOH_URL = 'https://cloudflare-dns.com/dns-query';
const WHOISVU_URL = 'https://api.whois.vu';
const FETCH_TIMEOUT = 10000;

// Supplementary RDAP servers for ccTLDs missing from IANA bootstrap.
// Only includes endpoints verified to return correct results.
const SUPPLEMENTARY_RDAP: Record<string, string> = {
  ch: 'https://rdap.nic.ch/',
  li: 'https://rdap.nic.ch/',
};

// Utility functions
function categorizeError(err: unknown): string {
  if (err instanceof Error) {
    if (err.name === 'AbortError') return 'Request timed out';
    if (err.message.includes('fetch failed') || err.message.includes('network')) return 'Network error';
    return err.message;
  }
  return 'Unknown error';
}

async function fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

function validateDomain(input: string): { valid: boolean; error?: string; sanitized?: string } {
  if (!input || typeof input !== 'string') {
    return { valid: false, error: 'Domain is required' };
  }
  const domain = input.trim().toLowerCase().replace(/^https?:\/\//, '').split(/[/:]/)[0];
  if (!domain) return { valid: false, error: 'Domain is empty' };

  const parsed = parse(domain);
  if (parsed.isIp) return { valid: false, error: 'IP addresses are not allowed' };
  if (!parsed.domain || !parsed.publicSuffix) return { valid: false, error: 'Invalid domain' };

  return { valid: true, sanitized: parsed.domain };
}

function parseBootstrap(bootstrap: IanaBootstrap): Map<string, string> {
  const tldToServer = new Map<string, string>();
  for (const [tlds, urls] of bootstrap.services) {
    if (urls.length > 0) {
      const rdapUrl = urls[0];
      for (const tld of tlds) {
        tldToServer.set(tld.toLowerCase(), rdapUrl);
      }
    }
  }
  return tldToServer;
}

function getTld(domain: string): string {
  const parts = domain.toLowerCase().split('.');
  return parts[parts.length - 1];
}

// Domain checking functions
async function checkDomainDns(domain: string): Promise<DomainResult> {
  try {
    const [nsResponse, aResponse] = await Promise.all([
      fetchWithTimeout(`${DOH_URL}?name=${encodeURIComponent(domain)}&type=NS`, {
        headers: { Accept: 'application/dns-json' },
      }),
      fetchWithTimeout(`${DOH_URL}?name=${encodeURIComponent(domain)}&type=A`, {
        headers: { Accept: 'application/dns-json' },
      }),
    ]);

    const nsData: DnsResponse | null = nsResponse.ok ? await nsResponse.json() : null;
    const aData: DnsResponse | null = aResponse.ok ? await aResponse.json() : null;

    // DNS can only confirm a domain is TAKEN (has records).
    // NXDOMAIN (status 3) means "no DNS records" NOT "domain is unregistered".
    // Registered but parked/inactive domains often have no DNS records.
    if (nsData?.Status === 0 && nsData.Answer?.length) {
      return { domain, available: false, method: 'dns' };
    }
    if (aData?.Status === 0 && aData.Answer?.length) {
      return { domain, available: false, method: 'dns' };
    }

    // Cannot determine availability from DNS alone - fall through to WHOIS
    return { domain, available: false, method: 'dns', error: 'DNS cannot confirm availability' };
  } catch (err) {
    return { domain, available: false, method: 'dns', error: `DNS: ${categorizeError(err)}` };
  }
}

async function checkDomainWhoisVu(domain: string): Promise<DomainResult> {
  try {
    const response = await fetchWithTimeout(
      `${WHOISVU_URL}/?q=${encodeURIComponent(domain)}`,
      { headers: { Accept: 'application/json' } }
    );

    if (!response.ok) {
      return { domain, available: false, method: 'whoisvu', error: `whois.vu: Server returned ${response.status}` };
    }

    const data = await response.json() as {
      available?: string;
      whois?: string;
    };

    if (data.available === 'yes') {
      return { domain, available: true, method: 'whoisvu' };
    }

    if (data.available === 'no') {
      let registrar: string | undefined;
      let expires: string | undefined;
      const whois = data.whois || '';
      const registrarMatch = whois.match(/registrar:\s*(.+)/i);
      if (registrarMatch) registrar = registrarMatch[1].trim();
      const expiresMatch = whois.match(/expir(?:y|ation|es)(?:\s*date)?:\s*(\S+)/i);
      if (expiresMatch) expires = expiresMatch[1].split('T')[0];
      return { domain, available: false, method: 'whoisvu', registrar, expires };
    }

    return { domain, available: false, method: 'whoisvu', error: 'whois.vu: Lookup inconclusive' };
  } catch (err) {
    return { domain, available: false, method: 'whoisvu', error: `whois.vu: ${categorizeError(err)}` };
  }
}

async function checkDomainWhois(domain: string): Promise<DomainResult> {
  try {
    const whoisUrl = `https://www.whois.com/whois/${encodeURIComponent(domain)}`;
    const response = await fetchWithTimeout(whoisUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; DomainFinder/1.0)' },
    });

    if (response.ok) {
      const html = await response.text();
      const lowerHtml = html.toLowerCase();

      const notFoundPatterns = [
        'no match for', 'not found', 'no data found', 'domain not found',
        'no entries found', 'is available for registration', 'status: free',
        'domain status: no object found', 'no information available',
        'is free', 'status: available', 'no such domain',
        'nothing found', 'no match', 'not registered',
        'available for registration', 'domain available',
      ];

      for (const pattern of notFoundPatterns) {
        if (lowerHtml.includes(pattern.toLowerCase())) {
          return { domain, available: true, method: 'whois' };
        }
      }

      const registeredPatterns = [
        'Creation Date:', 'Created Date:', 'Registration Date:',
        'Domain Name:', 'Registrar:', 'Registry Domain ID:',
        'Registered on:', 'Created on:', 'paid-till:',
        'Expiry Date:', 'Expiration Date:', 'Record created on',
      ];

      for (const pattern of registeredPatterns) {
        if (html.includes(pattern)) {
          const registrarMatch = html.match(/Registrar:\s*([^\n<]+)/i);
          const expiresMatch = html.match(/Expir(?:y|ation) Date:\s*(\d{4}-\d{2}-\d{2})/i);
          return {
            domain,
            available: false,
            method: 'whois',
            registrar: registrarMatch?.[1].trim(),
            expires: expiresMatch?.[1],
          };
        }
      }

      // For many ccTLDs, whois.com returns a valid page but with empty WHOIS data
      // when the domain is unregistered. Detect this by checking <pre> blocks.
      const preBlocks = html.match(/<pre[^>]*>([\s\S]*?)<\/pre>/gi);
      if (preBlocks) {
        const preText = preBlocks.map((b) => b.replace(/<[^>]+>/g, '').trim()).join('');
        if (preText.length === 0) {
          return { domain, available: true, method: 'whois' };
        }
      }
    }

    return { domain, available: false, method: 'whois', error: 'WHOIS lookup inconclusive' };
  } catch (err) {
    return { domain, available: false, method: 'whois', error: `WHOIS: ${categorizeError(err)}` };
  }
}

async function checkDomainRdap(
  domain: string,
  tldToServer: Map<string, string>
): Promise<DomainResult | null> {
  const tld = getTld(domain);
  const rdapServer = tldToServer.get(tld);
  if (!rdapServer) return null;

  const baseUrl = rdapServer.endsWith('/') ? rdapServer : `${rdapServer}/`;
  const rdapUrl = `${baseUrl}domain/${domain.toLowerCase()}`;

  try {
    const response = await fetchWithTimeout(rdapUrl, {
      headers: { Accept: 'application/rdap+json, application/json' },
    });

    if (response.status === 404) {
      return { domain, available: true, method: 'rdap' };
    }

    if (response.ok) {
      const data: RdapResponse = await response.json();
      let registrar: string | undefined;
      let expires: string | undefined;

      if (data.entities) {
        for (const entity of data.entities) {
          if (entity.roles?.includes('registrar')) {
            registrar = entity.vcardArray?.[1]?.find((v) => v[0] === 'fn')?.[3] || entity.handle || 'Unknown';
            break;
          }
        }
      }

      if (data.events) {
        const expirationEvent = data.events.find((e) => e.eventAction === 'expiration');
        if (expirationEvent?.eventDate) {
          expires = expirationEvent.eventDate.split('T')[0];
        }
      }

      return { domain, available: false, method: 'rdap', registrar, expires };
    }

    return { domain, available: false, method: 'rdap', error: `RDAP: Server returned ${response.status}` };
  } catch (err) {
    return { domain, available: false, method: 'rdap', error: `RDAP: ${categorizeError(err)}` };
  }
}

async function checkDomain(domain: string, tldToServer: Map<string, string>): Promise<DomainResult> {
  // 1. RDAP (primary) - official registry protocol
  const rdapResult = await checkDomainRdap(domain, tldToServer);
  if (rdapResult && !rdapResult.error) return rdapResult;

  // 2. DNS - can only confirm taken (has records), not available
  const dnsResult = await checkDomainDns(domain);
  if (!dnsResult.error) return dnsResult;

  // 3. whois.vu API - free JSON WHOIS lookup with broad ccTLD coverage
  const whoisVuResult = await checkDomainWhoisVu(domain);
  if (!whoisVuResult.error) return whoisVuResult;

  // 4. whois.com HTML scraping - last resort
  const whoisResult = await checkDomainWhois(domain);
  if (!whoisResult.error) return whoisResult;

  return {
    domain,
    available: false,
    error: `Could not determine availability (all methods inconclusive for .${getTld(domain)})`,
  };
}

async function getBootstrap(): Promise<Map<string, string>> {
  // Start with supplementary servers so IANA data takes priority when available
  const tldToServer = new Map<string, string>();
  for (const [tld, url] of Object.entries(SUPPLEMENTARY_RDAP)) {
    tldToServer.set(tld, url);
  }

  try {
    const response = await fetchWithTimeout(IANA_BOOTSTRAP_URL);
    if (response.ok) {
      const bootstrap: IanaBootstrap = await response.json();
      const ianaMap = parseBootstrap(bootstrap);
      // IANA entries override supplementary entries
      for (const [tld, url] of ianaMap) {
        tldToServer.set(tld, url);
      }
    }
  } catch {
    // Supplementary map still available as fallback
  }
  return tldToServer;
}

async function checkDomainsInternal(domains: string[]): Promise<DomainResult[]> {
  const tldToServer = await getBootstrap();

  const validatedDomains = domains.slice(0, 50).map((domain) => ({
    domain,
    validation: validateDomain(domain),
  }));

  return Promise.all(
    validatedDomains.map(async ({ domain, validation }) => {
      if (!validation.valid) {
        return { domain, available: false, error: validation.error } as DomainResult;
      }
      return checkDomain(validation.sanitized!, tldToServer);
    })
  );
}

// Create MCP Server
const server = new McpServer({
  name: 'domain-finder',
  version: '2.0.0',
});

// Register tools
server.tool(
  'check_domains',
  'Check availability of multiple domain names. Returns which domains are available or taken.',
  {
    domains: z.array(z.string()).describe('List of domain names to check (max 50)'),
  },
  async ({ domains }) => {
    const results = await checkDomainsInternal(domains);
    const available = results.filter((r) => r.available && !r.error).map((r) => r.domain);
    const taken = results.filter((r) => !r.available && !r.error).map((r) => r.domain);
    const errors = results.filter((r) => r.error).map((r) => ({ domain: r.domain, error: r.error }));

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify({ available, taken, errors }, null, 2),
        },
      ],
    };
  }
);

server.tool(
  'check_single_domain',
  'Check if a single domain is available. Returns detailed information including registrar and expiration if taken.',
  {
    domain: z.string().describe('Domain name to check (e.g., "example.com")'),
  },
  async ({ domain }) => {
    const validation = validateDomain(domain);
    if (!validation.valid) {
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({ domain, available: false, error: validation.error }, null, 2),
          },
        ],
      };
    }

    const tldToServer = await getBootstrap();
    const result = await checkDomain(validation.sanitized!, tldToServer);

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }
);

// Environment type with rate limiter binding
interface Env {
  RATE_LIMITER: {
    limit: (opts: { key: string }) => Promise<{ success: boolean }>;
  };
}

// Create the base MCP handler
const mcpHandler = createMcpHandler(server);

// Export handler with rate limiting
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // Get client IP for rate limiting
    const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';

    // Check rate limit (20 requests per minute per IP)
    const { success } = await env.RATE_LIMITER.limit({ key: clientIP });
    if (!success) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded (20 requests/minute). Please try again later.' }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '60',
          },
        }
      );
    }

    // Process the request
    return mcpHandler(request, env, ctx);
  },
};
