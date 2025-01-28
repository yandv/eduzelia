import { toCursorResponse } from "@/database/dto/pagination-cursor.dto";
import { prisma } from "@/database/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const createStudentSchema = z.object({
  nome: z.string(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const { nome } = createStudentSchema.parse(body);

  const aluno = await prisma.aluno.create({
    data: {
      nome,
    },
  });

  return NextResponse.json(aluno, { status: 201 });
}

export async function GET(request: Request) {
  const alunos = await prisma.aluno.findMany();

  return NextResponse.json(toCursorResponse(alunos));
}
