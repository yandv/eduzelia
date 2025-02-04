import { Loading } from "@/lib/components/Loading";
import Navbar from "@/lib/components/Navbar";
import { PropsWithChildren, Suspense } from "react";

export default function DashboardLayout({
  children,
}: Readonly<PropsWithChildren>) {
  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto">
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </div>
    </>
  );
}
