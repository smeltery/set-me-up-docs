import { toMermaid, type Diagram } from "@/scripts/generate-content";

const decodeAttribute = (value: string) =>
  value
    .replace(/&#x([0-9a-f]+);/gi, (_match, hex) =>
      String.fromCodePoint(parseInt(hex, 16))
    )
    .replace(/&#([0-9]+);/g, (_match, number) =>
      String.fromCodePoint(Number(number))
    )
    .replaceAll("&quot;", '"')
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&");
export const docsMarkdown = (processed: string) =>
  processed
    .replace(/<SetupDiagram diagram="([^"]+)"\s*\/>/g, (_match, value) => {
      const diagram = JSON.parse(decodeAttribute(value)) as Diagram;
      return `\`\`\`mermaid\n${toMermaid(diagram)}\n\`\`\`\n\n${diagram.caption}`;
    })
    .replace(/<GuideCards links="([^"]+)"\s*\/>/g, (_match, value) => {
      const links = JSON.parse(decodeAttribute(value)) as {
        label: string;
        href: string;
        description?: string;
      }[];
      return links
        .map(
          (link) =>
            `- [${link.label}](${link.href})${link.description ? `: ${link.description}` : ""}`
        )
        .join("\n");
    })
    .replace(/<span id="[^"]+"\s*\/>\n*/g, "");
