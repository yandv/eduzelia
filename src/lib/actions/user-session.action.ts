import { cache } from "react";
import { cookies } from "next/headers";
import { UserDto } from "../database/dto/user.dto";
import { CacheReturn } from "../utils/system";

interface LoggedSession {
  user: UserDto;
  isLoggedIn: true;
}

interface NotLoggedSession {
  user: undefined;
  isLoggedIn: false;
}

export const getUserSession = cache<CacheReturn<LoggedSession | NotLoggedSession>>(
  async () => {
    const cookie = (await cookies()).get("session")?.value;

    if (cookie) {
      const user: UserDto = JSON.parse(cookie);

      return { user, isLoggedIn: true };
    }

    return { isLoggedIn: false };
  }
);
