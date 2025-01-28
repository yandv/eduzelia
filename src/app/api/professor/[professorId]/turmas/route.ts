import { toCursorResponse } from "@/lib/database/dto/pagination-cursor.dto";
import { prisma } from "@/lib/database/prisma";
import { BaseQueryParams } from "@/lib/utils/base-query-params";
import { NextResponse } from "next/server";
import { z } from "zod";

const createTurmaSchema = z.object({
  nome: z.string(),
  ano: z.number().positive().max(9999).min(2020),
  professorId: z.string(),
});

export async function POST(
  req: Request,
  { params }: BaseQueryParams<{ professorId: string }>
) {
  const body = await req.json();
  const { professorId } = await params;
  const { nome, ano } = createTurmaSchema.parse(body);

  const professor = await prisma.professor.findFirst({
    where: {
      id: professorId,
    },
  });

  if (!professor) {
    return NextResponse.json(
      { message: `O professor ${professorId} não existe` },
      { status: 404 }
    );
  }

  const turma = await prisma.turma.create({
    data: {
      nome,
      ano,
      professorId,
    },
  });

  return NextResponse.json(turma, { status: 201 });
}

export async function GET(
  _: Request,
  { params }: BaseQueryParams<{ professorId: string }>
) {
  const { professorId } = await params;

  const professor = await prisma.professor.findFirst({
    where: {
      id: professorId,
    },
  });

  if (!professor) {
    return NextResponse.json(
      { message: `O professor ${professorId} não existe` },
      { status: 404 }
    );
  }

  const turmas = await prisma.turma.findMany({
    where: {
      professorId,
    },
  });

  return NextResponse.json(toCursorResponse(turmas));
}
