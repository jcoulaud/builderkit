---
description: Brainstorm domain name ideas and check availability
---

# Domain Brainstorming

Generate domain ideas for: "$ARGUMENTS"

## Instructions

### Step 1: Generate Ideas (silently)

Think of 12-15 creative domain names based on the user's description. Consider:
- Direct/descriptive names
- Compound words (two words combined)
- Short invented words
- Action verbs
- Mix of TLDs: .com, .io, .dev, .app, .co, .ai

Do NOT output the ideas yet.

### Step 2: Check All Domains (single call)

Use the `check_domains` MCP tool to check ALL domains at once.

Pass all domain ideas as an array:
```json
{
  "domains": ["idea1.com", "idea1.io", "idea2.dev", ...]
}
```

### Step 3: Output Clean Summary Table

After receiving results, output a single clean table:

```
## Domain Ideas for "[user's description]"

### ✓ Available (X found)

| Domain | Register |
|--------|----------|
| coolname.io | [Namecheap](https://namecheap.com/domains/registration/results/?domain=coolname.io) · [Porkbun](https://porkbun.com/checkout/search?q=coolname.io) |
| awesome.dev | [Namecheap](https://namecheap.com/domains/registration/results/?domain=awesome.dev) · [Porkbun](https://porkbun.com/checkout/search?q=awesome.dev) |

### ✗ Taken (Y found)

| Domain | Registrar | Expires |
|--------|-----------|---------|
| taken.com | GoDaddy | 2026-01-15 |
| other.io | Namecheap | 2025-08-22 |
```

## Important

- Make ONE tool call with all domains, not multiple calls
- Only show the final summary table, nothing else
- Sort available domains first (most desirable TLDs: .com, .io, .dev at top)
- Keep it concise - no explanations, just the table
