import { readFileSync } from "node:fs";

import mermaid from "mermaid";

import { contentPages, mdxPath, pageMdx, toMermaid } from "./generate-content";

export async function checkDocs() {
  const pages = contentPages();
  const paths = new Set(pages.map((page) => page.path));
  let diagrams = 0;
  for (const page of pages) {
    if (readFileSync(mdxPath(page), "utf8") !== pageMdx(page))
      throw new Error(
        `Stale MDX: ${page.path}. Run bun scripts/generate-content.ts`
      );
    for (const section of page.sections) {
      if (section.diagram) {
        await mermaid.parse(toMermaid(section.diagram));
        diagrams++;
      }
      for (const link of section.links ?? []) {
        if (
          link.href.startsWith("/docs") &&
          !paths.has(link.href.split("#")[0])
        )
          throw new Error(`Broken docs link: ${page.path} → ${link.href}`);
      }
    }
  }
  return { pages: pages.length, diagrams };
}
if (import.meta.main) console.log("Docs content verified:", await checkDocs());
