#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."
bun scripts/check-mermaid.mjs
(cd site && bun run check:docs)
