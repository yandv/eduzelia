import { PropsWithChildren } from "react";
import { Suspense as DefaultSuspense } from "react";

export function Loading() {
  return (
    <div className="flex flex-col items-center justify-center lace-content-center m-9 text-2xl text-sky-950">
      Carregando
      <span className="loading loading-dots loading-xs bg-sky-950" />
    </div>
  );
}

export function Suspense({ children }: PropsWithChildren) {
  return <DefaultSuspense fallback={<Loading />}>{children}</DefaultSuspense>;
}
