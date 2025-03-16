import { cache } from "react";
import { cookies } from "next/headers";
import { CacheReturn, request } from "../utils/system";
import { TeacherDto } from "../database/dto/teacher.dto";

interface LoggedSession {
  user: TeacherDto;
  isLoggedIn: true;
}

interface NotLoggedSession {
  user: undefined;
  isLoggedIn: false;
}

export const getUserSession = cache<
  CacheReturn<LoggedSession | NotLoggedSession>
>(async () => {
  const sessionCookies = await cookies();
  const cookie = sessionCookies.get("session")?.value;

  if (cookie) {
    const user: TeacherDto = JSON.parse(cookie);

    return { user, isLoggedIn: true };
  }

  return { isLoggedIn: false };
});
