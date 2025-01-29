"use client";

import Navbar from "@/lib/components/Navbar";
import { useUser } from "@/lib/contexts/user.context";

export default function turmas(){
    const { user } = useUser();
    return(
        <>
        <Navbar></Navbar>
            <h1>Olá, {user?.name}</h1>
        </>
    )
}