"use server";

import { cookies } from "next/headers";

export async function logout() {
    const cookie = await cookies();

    const session = cookie.get("session");

    if (session) {
        cookie.delete("session");
    }
}