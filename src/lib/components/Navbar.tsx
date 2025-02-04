import Link from "next/link";

export default function Navbar() {
  return (
    <header className="bg-sky-950">
      <div className="navbar max-w-7xl mx-auto text-white justify-center">
        <Link className="text-xl font-extrabold" href="/">
          Edu Zelia
        </Link>
      </div>
    </header>
  );
}
