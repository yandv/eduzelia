import type { Metadata } from "next";
import { UserProvider } from "@/lib/contexts/user.context";

import "./globals.css";

export const metadata: Metadata = {
  title: "Edu Zelia",
  description: "Zelia Carolina - Grade and class Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="">
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
