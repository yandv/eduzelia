"use client";

import { useRouter } from "next/navigation";

export default function Navbar() {
  const { push } = useRouter();

  const handleClick = () => {
    push("/");
  };

  return (
    <header className="bg-sky-950">
      <div className="navbar max-w-7xl mx-auto text-white justify-center">
        <div
          className="text-xl font-extrabold  cursor-pointer"
          onClick={handleClick}
        >
          Edu Zelia
        </div>
      </div>
    </header>
  );
}
