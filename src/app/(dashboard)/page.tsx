"use client";

import Card from "@/lib/components/Card";

import { useUser } from "@/lib/contexts/user.context";

export default function Home() {
  const { user } = useUser();

  return (
    <>
      <h1 className="text-6xl text-sky-950 m-8 font-semibold">
        Olá, {user?.name}
      </h1>
      <Card />
    </>
  );
}
