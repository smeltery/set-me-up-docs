import type { MetadataRoute } from "next";

import { SITE } from "@/constants/site";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: new URL("/sitemap.xml", SITE.URL).href,
  };
}
