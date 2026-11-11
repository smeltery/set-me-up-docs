# AGENTS.md

## Project Snapshot

This repository owns the published user-facing documentation for `set-me-up`.
Keep changes focused on installation, provisioning, trust, adapter, and
workflow docs. Product behavior belongs in the installer, modules, blueprint,
or tests repositories that own it.

## Where To Add Things

- Keep `README.md` high-level; route readers through `docs/README.md`.
- Author user guides in `site/content-data/` and regenerate MDX with
  `bun run --cwd site generate:content`.
- Update generated or static documentation assets only when the documented
  behavior has changed in an owning repository.
- Do not change sibling repositories from this checkout unless the routed task
  explicitly spans multiple repos.

## Validation

Run the native validator before finishing:

```bash
scripts/validate.sh --all
```

Focused checks:

```bash
scripts/validate.sh --markdown
scripts/validate.sh --shell
scripts/validate.sh --structure
scripts/validate.sh --links
scripts/validate.sh --mermaid
```

Install locked Bun dependencies before mermaid validation:

```bash
bun install --frozen-lockfile
bun install --cwd site --frozen-lockfile
```

GitHub Actions runs markdown lint, ShellCheck, structure checks, link
validation, mermaid diagram validation, and the full native validator on every
push and pull request. It also checks workflow syntax, authored file line
budgets, and the full documentation application. Pre-commit uses the same
`scripts/validate.sh --all` entrypoint.

## Git

- Use conventional commits.
- Do not add `Co-Authored-By` or AI attribution footers.
- Never force-push `master`.
