import Navbar from "@/lib/components/Navbar";
import { PropsWithChildren, Suspense } from "react";

export default function DashboardLayout({
  children,
}: Readonly<PropsWithChildren>) {
  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto">
        <Suspense fallback={<div>Carregando...</div>}>{children}</Suspense>
      </div>
    </>
  );
}
