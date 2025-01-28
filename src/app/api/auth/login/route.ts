import { prisma } from "@/lib/database/prisma";
import { serialize } from "cookie";
import { type NextApiResponse } from "next";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: Request, res: NextApiResponse) {
  const body = await req.json();
  const { email, password } = loginSchema.parse(body);

  const user = await prisma.professor.findFirst({
    where: {
      email,
    },
  });

  if (!user) {
    return NextResponse.json(
      { message: `O usuário ${email} não existe` },
      { status: 404 }
    );
  }

  console.log(user.senha, password);

  if (user.senha !== password) {
    return NextResponse.json(
      { message: `A senha está incorreta` },
      { status: 401 }
    );
  }

  const userData = {
    id: user.id,
    email: user.email,
    nome: user.nome,
  };

  const cookieStore = await cookies();

  cookieStore.set("session", JSON.stringify(userData), { secure: true });

  return NextResponse.json(userData);
}
