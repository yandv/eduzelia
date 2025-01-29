import type { Metadata } from "next";
import { UserProvider } from "@/lib/contexts/user.context";

import { cookies } from "next/headers";
import { PropsWithChildren } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: "Edu Zelia",
  description: "Zelia Carolina - Grade and class Management",
};

export default async function RootLayout({
  children,
}: Readonly<PropsWithChildren>) {
  const cookie = await cookies();

  const session = cookie.get("session");

  return (
    <html lang="pt-BR">
      <body>
        <UserProvider session={session ? JSON.parse(session.value) : undefined}>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
