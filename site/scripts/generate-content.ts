import { readdirSync, readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

export interface Diagram {
  title: string;
  actors: string[];
  steps: [number, number, string][];
  caption: string;
}
interface Section {
  id: string;
  title: string;
  paragraphs: string[];
  notice?: string;
  diagram?: Diagram;
  items?: string[];
  table?: string[][];
  code?: string;
  language?: string;
  links?: { label: string; href: string }[];
}
export interface ContentPage {
  path: string;
  title: string;
  description: string;
  group: string;
  order?: number;
  sections: Section[];
}
export const contentFiles = (directory: string): string[] =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory()
      ? contentFiles(join(directory, entry.name))
      : entry.name.endsWith(".json")
        ? [join(directory, entry.name)]
        : []
  );
export const contentPages = () =>
  contentFiles("content-data").map(
    (file) => JSON.parse(readFileSync(file, "utf8")) as ContentPage
  );
const prose = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("{", "&#123;")
    .replaceAll("}", "&#125;");
export const toMermaid = (diagram: Diagram) =>
  [
    "sequenceDiagram",
    ...diagram.actors.map(
      (actor, index) => `participant A${index} as ${actor}`
    ),
    ...diagram.steps.map(
      ([from, to, label]) =>
        `A${from}${to < from ? "-->>" : "->>"}A${to}: ${label}`
    ),
  ].join("\n");
export const codeLanguage = (label = "Terminal") => {
  const name = label.toLowerCase();
  if (name.endsWith(".toml")) return "toml";
  if (name.endsWith(".txt")) return "text";
  if (name === "terminal" || name === "dotfiles/rcrc" || name.endsWith(".sh"))
    return "bash";
  return name;
};
export const pageMdx = (page: ContentPage) => {
  let text = `---\ntitle: ${JSON.stringify(page.title)}\ndescription: ${JSON.stringify(page.description)}\n---\n\n`;
  for (const section of page.sections) {
    const slug = section.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replaceAll(" ", "-");
    if (slug !== section.id)
      text += `<span id=${JSON.stringify(section.id)} />\n\n`;
    text += `## ${section.title}\n\n${section.paragraphs.map(prose).join("\n\n")}\n\n`;
    if (section.notice) text += `> ${prose(section.notice)}\n\n`;
    if (section.diagram)
      text += `<SetupDiagram diagram={${JSON.stringify(section.diagram)}} />\n\n`;
    if (section.items)
      text +=
        section.items.map((item) => `- ${prose(item)}`).join("\n") + "\n\n";
    if (section.table) {
      const row = (cells: string[]) =>
        `| ${cells.map((cell) => prose(cell).replaceAll("|", "\\|")).join(" | ")} |\n`;
      text +=
        row(section.table[0]) +
        row(section.table[0].map(() => "---")) +
        section.table.slice(1).map(row).join("") +
        "\n";
    }
    if (section.code)
      text += `\`\`\`${codeLanguage(section.language)} title=${JSON.stringify(section.language ?? "Terminal")}\n${section.code}\n\`\`\`\n\n`;
    if (section.links) {
      const descriptions = new Map(
        contentPages().map((page) => [page.path, page.description])
      );
      const links = section.links.map((link) => ({
        ...link,
        description: descriptions.get(link.href.split("#")[0]),
      }));
      text += `<GuideCards links={${JSON.stringify(links)}} />\n\n`;
    }
  }
  return text.trimEnd() + "\n";
};
export const mdxPath = (page: ContentPage) => {
  const slug = page.path.replace(/^\/docs\/?/, "");
  return `content/docs/${!slug ? "(root)/index" : slug === "quick-start" ? "(root)/quick-start" : ["guides", "operations", "reference"].includes(slug) ? `${slug}/index` : slug}.mdx`;
};
if (import.meta.main) {
  const pages = contentPages();
  for (const page of pages) {
    const file = mdxPath(page);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, pageMdx(page));
  }
  console.log(`Generated ${pages.length} set-me-up MDX pages`);
}
