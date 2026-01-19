/**
 * Domain Finder API - Cloudflare Worker
 *
 * Checks domain availability using:
 * 1. RDAP (primary) - official registry protocol
 * 2. DNS fallback - for TLDs without RDAP
 * 3. WHOIS fallback - additional verification
 */

import { parse } from 'tldts';

interface Env {
  RDAP_CACHE: KVNamespace;
}

interface DomainResult {
  domain: string;
  available: boolean;
  registrar?: string;
  expires?: string;
  method?: 'rdap' | 'dns' | 'whois';
  error?: string;
}

interface CheckDomainsRequest {
  domains: string[];
}

interface CheckDomainsResponse {
  results: DomainResult[];
  cached_bootstrap: boolean;
}

// IANA RDAP Bootstrap URL
const IANA_BOOTSTRAP_URL = 'https://data.iana.org/rdap/dns.json';
const BOOTSTRAP_CACHE_KEY = 'iana-rdap-bootstrap';
const BOOTSTRAP_CACHE_TTL = 86400; // 24 hours

// Cloudflare DNS over HTTPS endpoint
const DOH_URL = 'https://cloudflare-dns.com/dns-query';

// Request timeout in milliseconds
const FETCH_TIMEOUT = 10000;

// Fetch with timeout using AbortController
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

// WHOIS servers for common TLDs without RDAP
const WHOIS_SERVERS: Record<string, string> = {
  'io': 'whois.nic.io',
  'co': 'whois.nic.co',
  'me': 'whois.nic.me',
  'tv': 'whois.nic.tv',
  'cc': 'whois.nic.cc',
  'so': 'whois.nic.so',
};

interface ValidationResult {
  valid: boolean;
  error?: string;
  sanitized?: string;
}

// Validate and sanitize a domain name using tldts
function validateDomain(input: string): ValidationResult {
  if (!input || typeof input !== 'string') {
    return { valid: false, error: 'Domain is required' };
  }

  // Clean input: trim, lowercase, remove protocol/path/port
  const domain = input
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .split(/[/:]/)[0];

  if (!domain) {
    return { valid: false, error: 'Domain is empty' };
  }

  // Parse and validate using tldts (validates against real Public Suffix List)
  // This handles: IP detection, TLD validation, format validation
  const parsed = parse(domain);

  if (parsed.isIp) {
    return { valid: false, error: 'IP addresses are not allowed' };
  }

  if (!parsed.domain || !parsed.publicSuffix) {
    return { valid: false, error: 'Invalid domain' };
  }

  return { valid: true, sanitized: parsed.domain };
}

// Parse the IANA bootstrap file to get TLD -> RDAP server mapping
function parseBootstrap(bootstrap: any): Map<string, string> {
  const tldToServer = new Map<string, string>();

  if (bootstrap?.services) {
    for (const service of bootstrap.services) {
      const [tlds, urls] = service;
      if (urls && urls.length > 0) {
        const rdapUrl = urls[0];
        for (const tld of tlds) {
          tldToServer.set(tld.toLowerCase(), rdapUrl);
        }
      }
    }
  }

  return tldToServer;
}

// Extract TLD from domain
function getTld(domain: string): string {
  const parts = domain.toLowerCase().split('.');
  return parts[parts.length - 1];
}

// Check domain via DNS (Cloudflare DoH)
async function checkDomainDns(domain: string): Promise<DomainResult> {
  try {
    // Check for NS records first (most reliable for registration)
    const nsResponse = await fetchWithTimeout(
      `${DOH_URL}?name=${encodeURIComponent(domain)}&type=NS`,
      { headers: { 'Accept': 'application/dns-json' } }
    );

    if (nsResponse.ok) {
      const nsData = await nsResponse.json() as any;

      // Status 0 = NOERROR (domain exists)
      // Status 3 = NXDOMAIN (domain doesn't exist = available)
      if (nsData.Status === 3) {
        return {
          domain,
          available: true,
          method: 'dns'
        };
      }

      if (nsData.Status === 0 && nsData.Answer && nsData.Answer.length > 0) {
        return {
          domain,
          available: false,
          method: 'dns'
        };
      }
    }

    // Also check A records as backup
    const aResponse = await fetchWithTimeout(
      `${DOH_URL}?name=${encodeURIComponent(domain)}&type=A`,
      { headers: { 'Accept': 'application/dns-json' } }
    );

    if (aResponse.ok) {
      const aData = await aResponse.json() as any;

      if (aData.Status === 3) {
        return {
          domain,
          available: true,
          method: 'dns'
        };
      }

      if (aData.Status === 0) {
        // Domain exists (even without A records, NOERROR means it's registered)
        return {
          domain,
          available: false,
          method: 'dns'
        };
      }
    }

    // Couldn't determine
    return {
      domain,
      available: false,
      method: 'dns',
      error: 'DNS lookup inconclusive'
    };

  } catch (err) {
    return {
      domain,
      available: false,
      method: 'dns',
      error: `DNS lookup failed: ${err instanceof Error ? err.message : 'Unknown error'}`
    };
  }
}

// Check domain via WHOIS (using web-based WHOIS services)
async function checkDomainWhois(domain: string): Promise<DomainResult> {
  const tld = getTld(domain);

  try {
    // Use whois.com API (free for basic lookups)
    const whoisUrl = `https://www.whois.com/whois/${encodeURIComponent(domain)}`;

    const response = await fetchWithTimeout(whoisUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; DomainFinder/1.0)' }
    });

    if (response.ok) {
      const html = await response.text();

      // Check for common "not found" patterns
      const notFoundPatterns = [
        'No match for',
        'NOT FOUND',
        'No Data Found',
        'Domain not found',
        'No entries found',
        'is available for registration',
        'Status: free',
        'Domain Status: No Object Found',
      ];

      const lowerHtml = html.toLowerCase();
      for (const pattern of notFoundPatterns) {
        if (lowerHtml.includes(pattern.toLowerCase())) {
          return {
            domain,
            available: true,
            method: 'whois'
          };
        }
      }

      // Check for "registered" patterns
      const registeredPatterns = [
        'Creation Date:',
        'Created Date:',
        'Registration Date:',
        'Domain Name:',
        'Registrar:',
        'Registry Domain ID:',
      ];

      for (const pattern of registeredPatterns) {
        if (html.includes(pattern)) {
          // Try to extract registrar
          const registrarMatch = html.match(/Registrar:\s*([^\n<]+)/i);
          const expiresMatch = html.match(/Expir(?:y|ation) Date:\s*(\d{4}-\d{2}-\d{2})/i);

          return {
            domain,
            available: false,
            method: 'whois',
            registrar: registrarMatch ? registrarMatch[1].trim() : undefined,
            expires: expiresMatch ? expiresMatch[1] : undefined
          };
        }
      }
    }

    // Couldn't determine from WHOIS
    return {
      domain,
      available: false,
      method: 'whois',
      error: 'WHOIS lookup inconclusive'
    };

  } catch (err) {
    return {
      domain,
      available: false,
      method: 'whois',
      error: `WHOIS lookup failed: ${err instanceof Error ? err.message : 'Unknown error'}`
    };
  }
}

// Check single domain availability via RDAP
async function checkDomainRdap(
  domain: string,
  tldToServer: Map<string, string>
): Promise<DomainResult | null> {
  const tld = getTld(domain);
  const rdapServer = tldToServer.get(tld);

  if (!rdapServer) {
    return null; // No RDAP server, need fallback
  }

  const baseUrl = rdapServer.endsWith('/') ? rdapServer : `${rdapServer}/`;
  const rdapUrl = `${baseUrl}domain/${domain.toLowerCase()}`;

  try {
    const response = await fetchWithTimeout(rdapUrl, {
      headers: { 'Accept': 'application/rdap+json, application/json' }
    });

    if (response.status === 404) {
      return {
        domain,
        available: true,
        method: 'rdap'
      };
    }

    if (response.ok) {
      const data = await response.json() as any;

      let registrar: string | undefined;
      let expires: string | undefined;

      if (data.entities) {
        for (const entity of data.entities) {
          if (entity.roles?.includes('registrar')) {
            registrar = entity.vcardArray?.[1]?.find((v: any) => v[0] === 'fn')?.[3]
              || entity.handle
              || 'Unknown';
            break;
          }
        }
      }

      if (data.events) {
        const expirationEvent = data.events.find((e: any) => e.eventAction === 'expiration');
        if (expirationEvent?.eventDate) {
          expires = expirationEvent.eventDate.split('T')[0];
        }
      }

      return {
        domain,
        available: false,
        method: 'rdap',
        registrar,
        expires
      };
    }

    return null; // RDAP failed, try fallback

  } catch (err) {
    return null; // RDAP error, try fallback
  }
}

// Main check function with fallback chain
async function checkDomain(
  domain: string,
  tldToServer: Map<string, string>
): Promise<DomainResult> {
  // 1. Try RDAP first (most authoritative)
  const rdapResult = await checkDomainRdap(domain, tldToServer);
  if (rdapResult && !rdapResult.error) {
    return rdapResult;
  }

  // 2. Try DNS fallback
  const dnsResult = await checkDomainDns(domain);
  if (!dnsResult.error) {
    return dnsResult;
  }

  // 3. Try WHOIS as last resort
  const whoisResult = await checkDomainWhois(domain);
  if (!whoisResult.error) {
    return whoisResult;
  }

  // All methods failed
  return {
    domain,
    available: false,
    error: `Could not determine availability (no RDAP for .${getTld(domain)}, DNS and WHOIS inconclusive)`
  };
}

// Main handler
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);

    // Health check
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({ status: 'ok' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Check domains endpoint
    if (url.pathname === '/check' && request.method === 'POST') {
      try {
        const body = await request.json() as CheckDomainsRequest;

        if (!body.domains || !Array.isArray(body.domains)) {
          return new Response(
            JSON.stringify({ error: 'Missing or invalid "domains" array' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Validate and sanitize all domains
        const validatedDomains: { domain: string; validation: ValidationResult }[] = [];
        for (const domain of body.domains.slice(0, 50)) {
          const validation = validateDomain(domain);
          validatedDomains.push({ domain, validation });
        }

        // Get bootstrap file (cached)
        let bootstrap: any;
        let cachedBootstrap = false;

        const cached = await env.RDAP_CACHE?.get(BOOTSTRAP_CACHE_KEY);
        if (cached) {
          bootstrap = JSON.parse(cached);
          cachedBootstrap = true;
        } else {
          const bootstrapResponse = await fetchWithTimeout(IANA_BOOTSTRAP_URL);
          bootstrap = await bootstrapResponse.json();

          await env.RDAP_CACHE?.put(
            BOOTSTRAP_CACHE_KEY,
            JSON.stringify(bootstrap),
            { expirationTtl: BOOTSTRAP_CACHE_TTL }
          );
        }

        const tldToServer = parseBootstrap(bootstrap);

        // Check all valid domains in parallel, return errors for invalid ones
        const results = await Promise.all(
          validatedDomains.map(async ({ domain, validation }) => {
            if (!validation.valid) {
              return {
                domain,
                available: false,
                error: validation.error
              } as DomainResult;
            }
            return checkDomain(validation.sanitized!, tldToServer);
          })
        );

        const response: CheckDomainsResponse = {
          results,
          cached_bootstrap: cachedBootstrap
        };

        return new Response(JSON.stringify(response), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      } catch (err) {
        return new Response(
          JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // MCP-compatible tool endpoint
    if (url.pathname === '/mcp/tools' && request.method === 'GET') {
      const tools = {
        tools: [
          {
            name: 'check_domains',
            description: 'Check availability of domain names using RDAP, DNS, and WHOIS fallbacks',
            inputSchema: {
              type: 'object',
              properties: {
                domains: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'List of domain names to check'
                }
              },
              required: ['domains']
            }
          }
        ]
      };

      return new Response(JSON.stringify(tools), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Default response
    return new Response(
      JSON.stringify({
        name: 'Domain Finder API',
        version: '1.1.0',
        endpoints: {
          'POST /check': 'Check domain availability (RDAP → DNS → WHOIS fallback)',
          'GET /health': 'Health check',
          'GET /mcp/tools': 'MCP tool definitions'
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};
