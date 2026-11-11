import { SITE } from "@/constants/site";
import { source } from "@/lib/source";
export const GET = () =>
  new Response(
    `# ${SITE.NAME}\n\n${SITE.DESCRIPTION.SHORT}\n\n${source
      .getPages()
      .map(
        (page) =>
          `- [${page.data.title}](${new URL(`${page.url}.md`, SITE.URL).href}): ${page.data.description}`
      )
      .join("\n")}\n`,
    { headers: { "Content-Type": "text/plain; charset=utf-8" } }
  );
