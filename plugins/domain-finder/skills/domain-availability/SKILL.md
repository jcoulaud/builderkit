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

Use two clean tables:

```
**✓ Available (X)**

| Domain |
|--------|
| cool.io |
| cool.dev |

**✗ Taken (Y)**

| Domain | Registrar |
|--------|-----------|
| cool.com | GoDaddy |
```

## Rules

1. **One API call** - batch all domains into single `check_domains` call
2. **Table output only** - no verbose explanations
3. **Available first** - list available domains before taken ones
4. **Be proactive** - if user mentions a project idea, suggest AND check domains without being asked
