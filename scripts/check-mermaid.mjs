#!/usr/bin/env node

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const diagramPattern = /^```mermaid\r?\n([\s\S]*?)\r?\n```/gm;

const dom = new JSDOM("<!DOCTYPE html><body></body>");
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.DOMPurify = DOMPurify(dom.window);

const mermaid = (await import("mermaid")).default;

mermaid.initialize({
  startOnLoad: false,
  securityLevel: "loose",
});

function listMarkdownFiles(directory) {
  const files = [];

  for (const entry of readdirSync(directory)) {
    if (entry === "node_modules" || entry.startsWith(".")) {
      continue;
    }

    const path = join(directory, entry);
    const stats = statSync(path);

    if (stats.isDirectory()) {
      files.push(...listMarkdownFiles(path));
      continue;
    }

    if (/\.mdx?$/.test(entry)) {
      files.push(path);
    }
  }

  return files.sort();
}

let diagramCount = 0;

for (const file of listMarkdownFiles(repoRoot)) {
  const content = readFileSync(file, "utf8");
  let match;
  let index = 0;

  diagramPattern.lastIndex = 0;
  while ((match = diagramPattern.exec(content)) !== null) {
    index += 1;
    diagramCount += 1;
    const source = match[1].trim();
    const label = `${relative(repoRoot, file)}#${index}`;

    try {
      await mermaid.parse(source);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`Invalid mermaid diagram ${label}: ${message}`);
      process.exit(1);
    }
  }

  if (index > 0) {
    console.log(`OK ${relative(repoRoot, file)} (${index} diagram${index === 1 ? "" : "s"})`);
  }
}

if (diagramCount === 0) {
  console.log("OK mermaid (no diagrams found)");
} else {
  console.log(`OK mermaid (${diagramCount} diagram${diagramCount === 1 ? "" : "s"})`);
}
