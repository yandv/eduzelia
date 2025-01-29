import type { Metadata } from "next";
import { UserProvider } from "@/lib/contexts/user.context";

import "./globals.css";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Edu Zelia",
  description: "Zelia Carolina - Grade and class Management",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookie = await cookies();

  const session = cookie.get("session");

  return (
    <html lang="en">
      <body>
        <UserProvider session={session ? JSON.parse(session.value) : undefined}>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
