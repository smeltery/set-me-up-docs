import type { InferPageType } from "fumadocs-core/source";
import { loader } from "fumadocs-core/source";

import { docs } from "@/.source/server";
import { ROUTES } from "@/constants/routes";
import { docsMarkdown } from "@/lib/docs-markdown";
export const source = loader({
  baseUrl: ROUTES.DOCS,
  source: docs.toFumadocsSource(),
});
export const getPageImage = (_page: InferPageType<typeof source>) => ({
  url: "/social-card.png",
  segments: [],
});
export const getPageMarkdownUrl = (page: InferPageType<typeof source>) => ({
  url: `/llms.md/docs/${[...page.slugs, "content.md"].join("/")}`,
  segments: [...page.slugs, "content.md"],
});
export const getLLMText = async (page: InferPageType<typeof source>) =>
  `# ${page.data.title}\n\n${page.data.description}\n\n${docsMarkdown(await page.data.getText("processed"))}`;
