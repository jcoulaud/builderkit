# Builderkit - Claude Code plugins for builders

[Claude Code](https://claude.ai/code) plugins marketplace for builders.

Built things I needed, sharing them here. More plugins coming as I build more stuff.

---

## Domain Finder

When brainstorming project ideas with Claude, I got tired of checking if domains were available manually. So I built this - Claude now checks availability automatically when suggesting domain names.

### Install

**Step 1:** Add the marketplace
```
/plugin marketplace add jcoulaud/builderkit
```

**Step 2:** Install the plugin
```
/plugin install domain-finder@builderkit
```

**Step 3:** Use it
```
/domain-finder:brainstorm project management app for designers
```
```
/domain-finder:check mycoolapp.io
```

[Full documentation →](./plugins/domain-finder)

### Output

| Domain | Status | Register |
|--------|--------|----------|
| designflow.io | ✓ Available | [Namecheap](https://namecheap.com) · [Porkbun](https://porkbun.com) |
| projectcanvas.dev | ✓ Available | [Namecheap](https://namecheap.com) · [Porkbun](https://porkbun.com) |
| designerpm.com | ✗ Taken | Expires 2026-05 |

---

## Ideas? Issues?

[Open an issue](https://github.com/jcoulaud/builderkit/issues) or submit a PR.

## License

MIT - Do whatever you want with it.
