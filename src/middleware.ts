import { NextRequest, NextResponse } from "next/server";
import { getUserSession } from "./lib/actions/user-session.action";
import { request } from "./lib/utils/system";
import { TeacherDto } from "./lib/database/dto/teacher.dto";
import { revalidateTag } from "next/cache";

const PUBLIC_ROUTES = ["/login"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isPublic = PUBLIC_ROUTES.includes(path);

  if (isPublic) {
    return NextResponse.next();
  }

  const { user, isLoggedIn } = await getUserSession();

  if (user) {
    const isBackendLoggedIn = await request<TeacherDto>(
      `${process.env.NEXT_PUBLIC_API_URL}/teacher/${user?.id}`,
      {
        next: {
          revalidate: 300,
          tags: [`teacher`],
        },
      }
    )
      .then(() => true)
      .catch((error) => {
        if (error.response?.status === 404) {
          return false;
        }

        return true;
      });

    if (isBackendLoggedIn && isLoggedIn) {
      return NextResponse.next();
    }

    revalidateTag("teacher");
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
