import type { MetadataRoute } from "next";

import { SITE } from "@/constants/site";
import { source } from "@/lib/source";
export default function sitemap(): MetadataRoute.Sitemap {
  return source
    .getPages()
    .map((page) => ({ url: new URL(page.url, SITE.URL).href }));
}
