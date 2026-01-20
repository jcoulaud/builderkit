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

### Step 3: Output Results

```
**✓ Available (X)**

| Domain |
|--------|
| coolname.io |
| awesome.dev |

**✗ Taken (Y)**

| Domain | Registrar |
|--------|-----------|
| taken.com | GoDaddy |

**Top picks**
- coolname.io
- awesome.dev
```

## Rules

- ONE tool call with all domains
- Available: single column table with domain names
- Taken: table with domain and registrar
- Sort by TLD: .com, .io, .dev first
- End with "Top picks" as bullet points (2-3 favorite available domains)
