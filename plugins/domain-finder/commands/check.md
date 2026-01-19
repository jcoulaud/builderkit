---
description: Check if a domain name is available for registration
---

# Check Domain Availability

Check if "$ARGUMENTS" is available for registration.

## Instructions

1. Use the `check_single_domain` MCP tool from domain-finder to check the domain
2. Present the result clearly:

**If available:**
```
✓ example.com is AVAILABLE

Register now:
  → Namecheap: https://namecheap.com/domains/registration/results/?domain=example.com
  → Porkbun: https://porkbun.com/checkout/search?q=example.com
```

**If taken:**
```
✗ example.com is TAKEN
  Registrar: GoDaddy
  Expires: 2026-03-15
```

**If error:**
```
⚠ example.com - Could not check (reason)
```

Keep the output minimal and actionable.
