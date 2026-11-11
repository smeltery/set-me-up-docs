import { NextResponse, type NextRequest } from "next/server";
export function proxy(request: NextRequest) {
  if (request.headers.get("accept")?.includes("text/markdown")) {
    const url = request.nextUrl.clone();
    url.pathname = `/llms.md${url.pathname.replace(/\/$/, "")}/content.md`;
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
}
export const config = { matcher: ["/docs/:path*"] };
