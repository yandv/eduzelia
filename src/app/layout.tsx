import type { Metadata } from "next";
import { PropsWithChildren } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: "Edu Zelia",
  description: "Zelia Carolina - Grade and class Management",
};

export default async function RootLayout({
  children,
}: Readonly<PropsWithChildren>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
