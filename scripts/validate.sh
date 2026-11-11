#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."

validate() {
    case "$1" in
        --markdown)
            bunx --no-install markdownlint-cli2 '**/*.{md,mdx}' '#node_modules' '#site/node_modules' '#site/.next' '#site/.source' '#.flox' '#.git'
            ;;
        --shell)
            while IFS= read -r -d '' script; do
                bash -n "$script"
            done < <(find scripts -name '*.sh' -type f -print0)
            shellcheck scripts/*.sh
            ;;
        --structure)
            for file in README.md AGENTS.md LICENSE bun.lock package.json docs/README.md \
                .pre-commit-config.yaml .flox/env/manifest.toml .github/workflows/ci.yml \
                .github/workflows/auto-release.yml site/package.json site/bun.lock; do
                test -f "$file" || { printf 'Missing required file: %s\n' "$file" >&2; return 1; }
            done
            git diff --check
            ;;
        --links)
            lychee --offline --no-progress README.md AGENTS.md docs/*.md site/README.md
            ;;
        --mermaid) scripts/check-mermaid.sh ;;
        --workflows) actionlint ;;
        --budget) python3 scripts/check-file-sizes.py ;;
        --site) (cd site && bun run ci) ;;
        *) printf 'Unknown check: %s\n' "$1" >&2; return 2 ;;
    esac
}

if [ "$#" -eq 0 ] || [ "$1" = --all ]; then
    set -- --markdown --shell --structure --links --mermaid --workflows --budget --site
fi
for check in "$@"; do
    if [ "$check" = --help ] || [ "$check" = -h ]; then
        printf 'Usage: %s [--all|--markdown|--shell|--structure|--links|--mermaid|--workflows|--budget|--site]\n' "$0"
        exit 0
    fi
    validate "$check"
    printf 'OK %s\n' "${check#--}"
done
