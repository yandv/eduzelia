import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getUserSession } from "./lib/actions/user-session.action";

const PUBLIC_ROUTES = ["/login"];

export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  const isPublic = PUBLIC_ROUTES.includes(path);

  if (isPublic) {
    return NextResponse.next();
  }

  // 3. Check if the user is authenticated using cookies
  const { isLoggedIn } = await getUserSession();

  if (isLoggedIn) {
    return NextResponse.next();
  }

  if (path.startsWith("/api")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.redirect(new URL("/login", req.nextUrl));
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
