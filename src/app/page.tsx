import Card from "@/components/Card";
import Navbar from "@/components/Navbar";
import Image from "next/image";

export default function Home() {
  return (
    <>
    <Navbar></Navbar>
    <h1 className="text-6xl text-sky-950 m-8 font-semibold">Olá, Andreia</h1>
    <Card></Card>
    </>
  )
}
