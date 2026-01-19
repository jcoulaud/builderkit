---
name: domain-availability
description: Automatically checks domain availability when users discuss domain names, ask for suggestions, or mention registering domains. Triggers on domain-related conversations.
---

# Domain Availability Skill

When users discuss domains, automatically check availability before suggesting.

## When to Activate

- User asks for domain name suggestions
- User is brainstorming startup/project names
- User asks "is X.com available?"
- User shares domain ideas they're considering

## How to Check

Use the `check_domains` MCP tool. Always check multiple domains in ONE call:

```json
{
  "domains": ["example.com", "example.io", "example.dev"]
}
```

## Output Format

Always use this clean table format:

```
### Domain Availability

| Domain | Status | Info |
|--------|--------|------|
| cool.io | ✓ Available | [Register](https://namecheap.com/domains/registration/results/?domain=cool.io) |
| cool.com | ✗ Taken | Expires 2026-03-15 |
| cool.dev | ✓ Available | [Register](https://namecheap.com/domains/registration/results/?domain=cool.dev) |
```

## Rules

1. **One API call** - batch all domains into single `check_domains` call
2. **Table output only** - no verbose explanations
3. **Available first** - list available domains before taken ones
4. **Include links** - add Namecheap/Porkbun registration links for available domains
5. **Be proactive** - if user mentions a project idea, suggest AND check domains without being asked
