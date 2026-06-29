# Contributing

Thank you for helping make this the reference engineers consult for production Capacitor applications.

## What we accept

- **Documentation** that explains *why* an architecture exists
- **Production lessons** using the format in [`docs/Lessons.md`](docs/Lessons.md)
- **Isolated examples** in `examples/` that work without the full monorepo
- **Templates** in `templates/` that are copy-paste ready with inline comments
- **Bug fixes** and clarity improvements to existing reference code

## What we avoid

- Feature-complete application UI
- Framework migrations without discussion in an issue first
- Dependencies added without justification in the PR description
- Marketing copy or README fluff

## Getting started

1. Fork the repository
2. Create a branch: `git checkout -b docs/push-token-refresh` or `feat/apns-retry`
3. Make focused changes — one module or doc per PR when possible
4. Ensure TypeScript compiles and any affected tests pass
5. Open a PR with:
   - **What** changed
   - **Why** (link to an issue if applicable)
   - **How to verify** locally

## Code style

- TypeScript strict mode
- Prefer explicit types at module boundaries
- Comment non-obvious production behavior (retries, idempotency, platform quirks)
- No `any` without a comment explaining why

## Lessons contributions

Real production stories are high-value. Use this structure in `docs/Lessons.md`:

```
### [Short title]

**Problem** — What went wrong in production?

**Symptoms** — What did users or monitors show?

**Root Cause** — What was actually broken?

**Investigation** — How did you find it?

**Fix** — What shipped?

**Why documentation wasn't enough** — What gap existed?

**Future prevention** — Checklist item, test, or architectural change
```

## Questions

Open a [GitHub Discussion](https://github.com/Mistakili/production-hybrid-reference/discussions) or issue labeled `question`.