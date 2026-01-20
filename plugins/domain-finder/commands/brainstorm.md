---
description: Brainstorm domain name ideas and check availability
---

# Domain Brainstorming

Generate domain ideas for: "$ARGUMENTS"

## CRITICAL RULES

1. **MAX 15 DOMAINS** - Generate exactly 12-15 domain ideas total. No more.
2. **USE MCP TOOL ONLY** - You MUST use the `check_domains` MCP tool. NEVER use bash, whois, or any fallback.
3. **ONE CALL** - Check all domains in a single `check_domains` call.

## Instructions

### Step 1: Generate Ideas (silently)

Think of 12-15 creative domain names. Consider:
- Direct/descriptive names
- Compound words
- Short invented words
- Mix of TLDs: .com, .io, .dev, .app, .co

Do NOT output the ideas yet. Do NOT exceed 15 domains.

### Step 2: Check Domains

Call the `check_domains` MCP tool with all domains:

```json
{
  "domains": ["idea1.com", "idea1.io", "idea2.dev", ...]
}
```

⚠️ If `check_domains` is not available, STOP and tell the user to restart Claude Code.

### Step 3: Output Results

Display the tool output directly, then add:

```
**Top picks**
- bestdomain.io
- another.dev
```

## Output Format

- Available: single column table
- Taken: table with domain and registrar
- End with 2-3 "Top picks" from available domains
