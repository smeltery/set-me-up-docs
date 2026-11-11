# Contributing

## Environment

`flox activate` supplies Bun, Node, Python, Git, ShellCheck, lychee, actionlint,
and pre-commit. Install the root and site dependencies with the frozen Bun
lockfiles as shown in the [README](../README.md).

## Author content

Edit the topic JSON in `site/content-data/`, then run:

```sh
cd site
bun run generate:content
bun run dev
```

Generated MDX belongs in `site/content/docs/`. Preserve the upstream source
integrity contract in `site/upstream.json`; product changes belong in content,
metadata, and the documented adaptation points.

## Validate

`scripts/validate.sh --all` is the shared CI and pre-commit contract. It checks
all Markdown, shell syntax and ShellCheck, repository structure, links,
Mermaid, workflow syntax, line budgets, and the complete site CI command.
Focused flags are listed by `scripts/validate.sh --help`.

The default budget is 400 lines per authored source or documentation file.
Generated content, lockfiles, and retained upstream files are excluded because
they have their own generation or integrity checks. Split new authored files
by responsibility rather than raising the budget.

## Release

A successful CI run on the latest `master` commit creates the next patch tag
and publishes a GitHub release with generated notes. The first tag is
`v0.1.0`; rerunning CI reuses its existing tag. Pull requests and stale CI runs
do not cut releases. Releases preserve the source, content, and lockfiles;
the Next.js application deploys independently through its hosting provider.
