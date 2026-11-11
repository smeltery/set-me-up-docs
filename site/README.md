# set-me-up docs

This is the actual [asciicn docs application source](https://github.com/opencoredev/asciicn/tree/d5592fc980cad39578f13b16f6e015404160669b), adapted to set-me-up.
It runs Next.js, Fumadocs MDX, Tailwind, and the original Radix UI components.
The former Vite implementation and its imitation layout styles are removed.

## Run locally

Use Node 24 or newer and Bun 1.3:

```sh
bun install --frozen-lockfile
bun run dev
```

Open <http://127.0.0.1:4787/docs>. Next provides live reload for source and MDX.
Run `bun run ci` for source integrity, content checks, type checking, tests,
and the production build. `bun run start` serves the production build.
With a server running, `bun scripts/smoke-site.ts` verifies every docs URL,
Markdown exports, content negotiation, and missing-page status codes.

Vercel uses the Next.js preset in `vercel.json`. Set this directory as its
project root. `SITE_URL` overrides the production docs origin when needed.

## Original source and adaptations

`upstream.json` records the repository revision and each retained source
file's original SHA-256. Unmodified files are checked by `check:upstream`.
The original copyright and MIT terms are retained in [ASCIICN-LICENSE](ASCIICN-LICENSE).

The docs layout, page template, sidebar, contents panel, search command menu,
mobile popover, page-copy menu, sharing menu, keyboard navigation, theme
switch, transition component, and UI primitives use upstream source.
The navigation links, logo, metadata, font loading, and content adapter are
adapted for set-me-up. Upstream analytics and registry/catalog services are
not included in this documentation application.

`styles/globals.css` is upstream's stylesheet. Product colors are isolated in
`styles/set-me-up.css`: forest green, cream, and moss in both themes. The
original Schibsted Grotesk, JetBrains Mono, and Cascadia Mono fonts are
bundled locally with their OFL licenses. The original animated Not Found
component fills the page and uses the same theme tokens.

## Content and diagrams

The 22 authored pages are preserved in `content-data/`. Run this after editing
those files:

```sh
bun scripts/generate-content.ts
```

This generates the MDX read by Fumadocs under `content/docs/`, preserving
published URLs, prose, code, legacy anchors, and 11 sequence diagrams.
Folder `meta.json` files control sidebar order and concise navigation labels.
Link groups render as responsive guide cards with descriptions and icons;
actual content lists remain lists. Markdown exports expand both the cards
and diagrams into ordinary Markdown and Mermaid.

The marketing search reads the same `content-data/` files. The coordinator's
`website/ascii/sync-docs.py` now syncs brand assets only; docs navigation and
404 behavior come from their actual upstream components.
