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

// IANA RDAP Bootstrap response
interface IanaBootstrap {
  version: string;
  services: [string[], string[]][];
}

// Cloudflare DNS-over-HTTPS response
interface DnsResponse {
  Status: number; // 0 = NOERROR, 3 = NXDOMAIN
  Answer?: { name: string; type: number; TTL: number; data: string }[];
}

// RDAP domain response
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

// IANA RDAP Bootstrap URL
const IANA_BOOTSTRAP_URL = 'https://data.iana.org/rdap/dns.json';
const BOOTSTRAP_CACHE_KEY = 'iana-rdap-bootstrap';
const BOOTSTRAP_CACHE_TTL = 86400; // 24 hours

// Cloudflare DNS over HTTPS endpoint
const DOH_URL = 'https://cloudflare-dns.com/dns-query';

// Request timeout in milliseconds
const FETCH_TIMEOUT = 10000;

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60; // seconds
const RATE_LIMIT_MAX_REQUESTS = 10; // max requests per window per IP

/**
 * Categorize errors for clearer diagnostics.
 * @param err - The caught error
 * @returns Human-readable error description
 */
function categorizeError(err: unknown): string {
  if (err instanceof Error) {
    if (err.name === 'AbortError') {
      return 'Request timed out';
    }
    if (err.message.includes('fetch failed') || err.message.includes('network')) {
      return 'Network error';
    }
    return err.message;
  }
  return 'Unknown error';
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Check rate limit for an IP address using KV storage.
 * @param ip - Client IP address
 * @param cache - KV namespace for rate limit storage
 * @returns Whether the request is allowed
 */
async function checkRateLimit(ip: string, cache: KVNamespace): Promise<RateLimitResult> {
  const key = `ratelimit:${ip}`;
  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - (now % RATE_LIMIT_WINDOW);
  const windowKey = `${key}:${windowStart}`;

  try {
    const current = await cache.get(windowKey);
    const count = current ? parseInt(current, 10) : 0;

    if (count >= RATE_LIMIT_MAX_REQUESTS) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: windowStart + RATE_LIMIT_WINDOW
      };
    }

    // Increment counter with TTL equal to window size
    await cache.put(windowKey, String(count + 1), { expirationTtl: RATE_LIMIT_WINDOW });

    return {
      allowed: true,
      remaining: RATE_LIMIT_MAX_REQUESTS - count - 1,
      resetAt: windowStart + RATE_LIMIT_WINDOW
    };
  } catch {
    // If rate limiting fails, allow the request (fail open)
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS, resetAt: now + RATE_LIMIT_WINDOW };
  }
}

/**
 * Fetch with automatic timeout.
 * @param url - URL to fetch
 * @param options - Fetch options
 * @returns Response or throws on timeout
 */
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

interface ValidationResult {
  valid: boolean;
  error?: string;
  sanitized?: string;
}

/**
 * Validate and sanitize a domain name using tldts.
 * Handles URL stripping, IP detection, and TLD validation.
 * @param input - Raw domain input (may include protocol/path)
 * @returns Validation result with sanitized domain or error
 */
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

/**
 * Parse IANA bootstrap file to build TLD to RDAP server mapping.
 * @param bootstrap - IANA RDAP bootstrap response
 * @returns Map of TLD to RDAP server URL
 */
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

// Extract TLD from domain
function getTld(domain: string): string {
  const parts = domain.toLowerCase().split('.');
  return parts[parts.length - 1];
}

/**
 * Check domain availability via DNS (Cloudflare DoH).
 * Queries NS and A records in parallel for faster results.
 * @param domain - Domain to check
 * @returns Domain availability result
 */
async function checkDomainDns(domain: string): Promise<DomainResult> {
  try {
    // Fetch NS and A records in parallel for faster lookups
    const [nsResponse, aResponse] = await Promise.all([
      fetchWithTimeout(
        `${DOH_URL}?name=${encodeURIComponent(domain)}&type=NS`,
        { headers: { 'Accept': 'application/dns-json' } }
      ),
      fetchWithTimeout(
        `${DOH_URL}?name=${encodeURIComponent(domain)}&type=A`,
        { headers: { 'Accept': 'application/dns-json' } }
      )
    ]);

    // Parse responses
    const nsData: DnsResponse | null = nsResponse.ok ? await nsResponse.json() : null;
    const aData: DnsResponse | null = aResponse.ok ? await aResponse.json() : null;

    // Status 0 = NOERROR (domain exists)
    // Status 3 = NXDOMAIN (domain doesn't exist = available)

    // Check NS records first (most reliable for registration)
    if (nsData) {
      if (nsData.Status === 3) {
        return { domain, available: true, method: 'dns' };
      }
      if (nsData.Status === 0 && nsData.Answer && nsData.Answer.length > 0) {
        return { domain, available: false, method: 'dns' };
      }
    }

    // Check A records as backup
    if (aData) {
      if (aData.Status === 3) {
        return { domain, available: true, method: 'dns' };
      }
      if (aData.Status === 0) {
        return { domain, available: false, method: 'dns' };
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
      error: `DNS: ${categorizeError(err)}`
    };
  }
}

/**
 * Check domain availability via WHOIS web scraping.
 * Used as fallback when RDAP and DNS are inconclusive.
 * @param domain - Domain to check
 * @returns Domain availability result with registrar/expiry if found
 */
async function checkDomainWhois(domain: string): Promise<DomainResult> {
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
      error: `WHOIS: ${categorizeError(err)}`
    };
  }
}

/**
 * Check domain availability via RDAP (preferred method).
 * Returns null if no RDAP server exists for the TLD.
 * @param domain - Domain to check
 * @param tldToServer - TLD to RDAP server mapping
 * @returns Domain result, or null if no RDAP server for TLD
 */
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
      const data: RdapResponse = await response.json();

      let registrar: string | undefined;
      let expires: string | undefined;

      if (data.entities) {
        for (const entity of data.entities) {
          if (entity.roles?.includes('registrar')) {
            registrar = entity.vcardArray?.[1]?.find((v) => v[0] === 'fn')?.[3]
              || entity.handle
              || 'Unknown';
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

    // Non-404 error status - try fallback
    return {
      domain,
      available: false,
      method: 'rdap',
      error: `RDAP: Server returned ${response.status}`
    };

  } catch (err) {
    return {
      domain,
      available: false,
      method: 'rdap',
      error: `RDAP: ${categorizeError(err)}`
    };
  }
}

/**
 * Check domain availability with fallback chain: RDAP → DNS → WHOIS.
 * @param domain - Validated domain to check
 * @param tldToServer - TLD to RDAP server mapping
 * @returns Domain availability result
 */
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
      // Rate limiting
      const clientIp = request.headers.get('CF-Connecting-IP') || 'unknown';
      const rateLimit = await checkRateLimit(clientIp, env.RDAP_CACHE);

      if (!rateLimit.allowed) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          {
            status: 429,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': String(rateLimit.resetAt),
              'Retry-After': String(rateLimit.resetAt - Math.floor(Date.now() / 1000))
            }
          }
        );
      }

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

        // Get bootstrap file (cached) with graceful fallback
        let bootstrap: IanaBootstrap | null = null;
        let cachedBootstrap = false;

        const cached = await env.RDAP_CACHE?.get(BOOTSTRAP_CACHE_KEY);
        if (cached) {
          try {
            bootstrap = JSON.parse(cached);
            cachedBootstrap = true;
          } catch {
            console.error('Failed to parse cached bootstrap data');
          }
        }

        if (!bootstrap) {
          try {
            const bootstrapResponse = await fetchWithTimeout(IANA_BOOTSTRAP_URL);
            if (bootstrapResponse.ok) {
              bootstrap = await bootstrapResponse.json();

              await env.RDAP_CACHE?.put(
                BOOTSTRAP_CACHE_KEY,
                JSON.stringify(bootstrap),
                { expirationTtl: BOOTSTRAP_CACHE_TTL }
              );
            }
          } catch (err) {
            // Log error but continue - we'll fall back to DNS/WHOIS
            console.error('Failed to fetch IANA bootstrap:', err instanceof Error ? err.message : err);
          }
        }

        // If bootstrap unavailable, use empty map (RDAP will be skipped, fallback to DNS/WHOIS)
        const tldToServer = bootstrap ? parseBootstrap(bootstrap) : new Map<string, string>();

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
        // Log detailed error for debugging (visible in Cloudflare dashboard)
        console.error('Check endpoint error:', err instanceof Error ? err.message : err);

        // Return generic error to client (no internal details)
        return new Response(
          JSON.stringify({ error: 'An error occurred while processing your request' }),
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
