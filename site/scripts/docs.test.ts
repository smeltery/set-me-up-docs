import { expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";

import { checkDocs } from "./check-docs";
import { upstreamMismatches } from "./check-upstream";
import { contentPages, pageMdx, toMermaid } from "./generate-content";

test("the actual upstream UI and layout source remain intact", () =>
  expect(upstreamMismatches()).toEqual([]));
test("all existing pages and diagrams survive the MDX migration", async () =>
  expect(await checkDocs()).toEqual({ pages: 22, diagrams: 11 }));
test("MDX escapes CLI placeholders and table delimiters", () => {
  const source = pageMdx({
    ...contentPages()[0],
    sections: [
      {
        id: "options",
        title: "Options",
        paragraphs: ["Use <module> with {options}"],
        table: [
          ["Flag", "Value"],
          ["<name>", "a|b"],
        ],
      },
    ],
  });
  expect(source).toContain("&lt;module&gt;");
  expect(source).toContain("&#123;options&#125;");
  expect(source).toContain("a\\|b");
});
test("legacy section anchors remain reachable", () => {
  const source = pageMdx({
    ...contentPages()[0],
    sections: [{ id: "legacy-anchor", title: "New heading", paragraphs: [] }],
  });
  expect(source).toContain('<span id="legacy-anchor" />');
});
test("sequence diagrams retain actors and reply arrows", () => {
  const source = toMermaid({
    title: "Example",
    caption: "Example",
    actors: ["You", "smu"],
    steps: [
      [0, 1, "Plan"],
      [1, 0, "Result"],
    ],
  });
  expect(source).toContain("A0->>A1: Plan");
  expect(source).toContain("A1-->>A0: Result");
});
test("Vercel uses Next and the Vite approximation is gone", () => {
  expect(JSON.parse(readFileSync("vercel.json", "utf8")).framework).toBe(
    "nextjs"
  );
  expect(existsSync("src/docs/rendering/reference-layout.css")).toBe(false);
  expect(existsSync("public/asciicn/navigation.js")).toBe(false);
});

test("navigation link groups use descriptive cards rather than bullet lists", () => {
  const source = pageMdx({
    ...contentPages()[0],
    sections: [
      {
        id: "guides",
        title: "Guides",
        paragraphs: [],
        links: [{ label: "Blueprints", href: "/docs/guides/blueprints" }],
      },
    ],
  });
  expect(source).toContain("<GuideCards links=");
  expect(source).toContain("A blueprint is the Git repository");
  expect(source).not.toContain("- [Blueprints]");
});
test("legacy code labels map to real syntax grammars", async () => {
  const { codeLanguage } = await import("./generate-content");
  expect(codeLanguage("Terminal")).toBe("bash");
  expect(codeLanguage("smu.toml")).toBe("toml");
  expect(codeLanguage("hosts.txt")).toBe("text");
});
test("Markdown exports expand cards and sequence diagrams", async () => {
  const { docsMarkdown } = await import("../lib/docs-markdown");
  const value = docsMarkdown(
    '<GuideCards links="[{&#x22;label&#x22;:&#x22;Guide&#x22;,&#x22;href&#x22;:&#x22;/docs&#x22;}]" />'
  );
  expect(value).toBe("- [Guide](/docs)");
});
