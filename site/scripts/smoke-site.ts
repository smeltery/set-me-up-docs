import { contentPages } from "./generate-content";
const origin = process.env.DOCS_PREVIEW_ORIGIN ?? "http://127.0.0.1:4787";
const pages = contentPages();
for (let offset = 0; offset < pages.length; offset += 4) {
  await Promise.all(
    pages.slice(offset, offset + 4).map(async (page) => {
      const response = await fetch(new URL(page.path, origin));
      const html = await response.text();
      if (
        response.status !== 200 ||
        !html.includes("set-me-up") ||
        !html.includes('data-slot="docs"')
      )
        throw new Error(`Broken page: ${page.path} (${response.status})`);
    })
  );
}
for (const path of ["/docs.md", "/docs/guides/blueprints.md"]) {
  const response = await fetch(new URL(path, origin));
  const text = await response.text();
  if (
    response.status !== 200 ||
    !response.headers.get("content-type")?.includes("text/markdown") ||
    !text.startsWith("# ")
  )
    throw new Error(`Broken Markdown export: ${path}`);
  if (text.includes("<GuideCards") || text.includes("<SetupDiagram"))
    throw new Error(`Unexpanded MDX in ${path}`);
}
const negotiated = await fetch(new URL("/docs", origin), {
  headers: { Accept: "text/markdown" },
});
if (!negotiated.headers.get("content-type")?.includes("text/markdown"))
  throw new Error("Markdown content negotiation failed");
const missing = await fetch(new URL("/docs/this-page-does-not-exist", origin));
if (missing.status !== 404)
  throw new Error(`Missing pages must return 404, got ${missing.status}`);
console.log(
  `HTTP smoke passed: ${pages.length} pages, Markdown exports, content negotiation, and real 404 status`
);
