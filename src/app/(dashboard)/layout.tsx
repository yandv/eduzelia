import Navbar from "@/lib/components/Navbar";
import { PropsWithChildren } from "react";

export default function DashboardLayout({
  children,
}: Readonly<PropsWithChildren>) {
  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto">{children}</div>
    </>
  );
}
