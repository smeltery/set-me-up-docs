# set-me-up documentation

[![CI](https://github.com/smeltery/set-me-up-docs/actions/workflows/ci.yml/badge.svg)](https://github.com/smeltery/set-me-up-docs/actions/workflows/ci.yml)
[![Bun](https://img.shields.io/badge/Bun-1.3-black?logo=bun)](https://bun.sh)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)](https://nextjs.org)
[![Fumadocs](https://img.shields.io/badge/Docs-Fumadocs-blue)](https://fumadocs.dev)
[![License](https://img.shields.io/badge/License-PolyForm_Shield-blue)](LICENSE)

User guides and reference material for reproducible macOS and Linux setup:
blueprints, dotfiles, provisioning, updates, and machine operations.

Start with the [documentation index](docs/README.md). The [documentation
application](site/README.md) publishes the guides with search, Markdown
exports, and Mermaid diagrams.

## Develop

```sh
flox activate
bun install --frozen-lockfile
bun install --cwd site --frozen-lockfile
pre-commit install
bun run --cwd site dev
```

Run `scripts/validate.sh --all` before committing; CI and pre-commit run the
same checks. See [contributor guidance](docs/contributing.md) for validation,
content authoring, and releases.

## License

[PolyForm Shield 1.0.0](LICENSE). Retained upstream source and font licenses
are documented in [site/README.md](site/README.md).
