"use client";

import { createContext, PropsWithChildren, useContext } from "react";

export interface User {
  email: string;
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

interface UserProviderProps {
  session?: User;
}

const UserContext = createContext<UserContextProps | UserContextLoggedInProps>({
  user: undefined,
  isLoggedIn: false,
});

export function UserProvider({
  children,
  session,
}: PropsWithChildren<UserProviderProps>) {
  console.log(session);

  return (
    <UserContext.Provider
      value={
        session
          ? { user: session, isLoggedIn: true }
          : { user: undefined, isLoggedIn: false }
      }
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
