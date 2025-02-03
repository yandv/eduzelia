import Navbar from "@/lib/components/Navbar";
import { PropsWithChildren, Suspense } from "react";

function SuspenseFallback() {
  return (
    <div className="flex justify-center lace-content-center m-9 text-2xl text-sky-950">
      Carregando &nbsp;
      <span className="loading loading-dots loading-xs bg-sky-950"></span>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: Readonly<PropsWithChildren>) {
  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto">
        <Suspense fallback={<SuspenseFallback />}>{children}</Suspense>
      </div>
    </>
  );
}
