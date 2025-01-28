"use client";

import { useUser } from "@/lib/contexts/user.context";

export default function Home() {
  const { user } = useUser();
  return <p>{user?.name}</p>;
}
