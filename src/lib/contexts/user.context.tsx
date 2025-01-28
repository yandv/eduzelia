"use client";

import { createContext, PropsWithChildren, useContext } from "react";

export interface User {
  name: string;
}

interface UserContextProps {
  user: undefined;
  isLoggedIn: false;
}

interface UserContextLoggedInProps {
  user: User;
  isLoggedIn: true;
}

export const UserContext = createContext<
  UserContextProps | UserContextLoggedInProps
>({ user: undefined, isLoggedIn: false });

export function UserProvider({ children }: PropsWithChildren) {
  return (
    <UserContext.Provider
      value={{ isLoggedIn: true, user: { name: "Andréia Paula" } }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const user = useContext(UserContext);
  if (!user) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return user;
}
