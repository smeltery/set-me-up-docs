import {
  ArrowUpRight01Icon,
  BookOpen01Icon,
  ComputerTerminal01Icon,
  SourceCodeIcon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";

import { Icon } from "@/components/icon";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export interface GuideLink {
  label: string;
  href: string;
  description?: string;
}
export const GuideCards = ({ links }: { links: GuideLink[] }) => (
  <div
    className="my-6 grid grid-cols-1 gap-3 sm:grid-cols-2"
    aria-label="Related guides"
  >
    {links.map((link) => {
      const icon = link.href.includes("/reference")
        ? SourceCodeIcon
        : link.href.includes("vps")
          ? ComputerTerminal01Icon
          : BookOpen01Icon;
      return (
        <Link
          key={link.href}
          href={link.href}
          transitionTypes={["nav-forward"]}
          className="group rounded-xl no-underline outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <Card className="h-full gap-4 bg-surface/50 p-5 shadow-none transition-colors group-hover:border-primary/40 group-hover:bg-accent/40">
            <div className="flex items-center justify-between gap-4">
              <span className="flex size-8 items-center justify-center rounded-lg border bg-background text-primary">
                <Icon icon={icon} className="size-4" />
              </span>
              <Icon
                icon={ArrowUpRight01Icon}
                className="size-4 text-muted-foreground transition-colors group-hover:text-foreground"
              />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-sm leading-snug font-semibold text-foreground">
                {link.label}
              </CardTitle>
              {link.description && (
                <CardDescription className="line-clamp-3 text-[0.8rem] leading-relaxed">
                  {link.description}
                </CardDescription>
              )}
            </div>
          </Card>
        </Link>
      );
    })}
  </div>
);
