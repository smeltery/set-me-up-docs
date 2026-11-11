import { SITE } from "@/constants/site";
export const BreadcrumbJsonLd = ({
  items,
}: {
  items: { name: string; path: string }[];
}) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: new URL(item.path, SITE.URL).href,
        })),
      }),
    }}
  />
);
