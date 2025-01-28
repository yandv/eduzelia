import { prisma } from "@/database/prisma";
import { BaseQueryParams } from "@/utils/base-query-params";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  { params }: BaseQueryParams<{ alunoId: string }>
) {
  const { alunoId } = await params;

  const aluno = await prisma.aluno.findFirst({
    where: {
      id: alunoId,
    },
  });

  if (!aluno) {
    return NextResponse.json(
      { message: `O aluno ${alunoId} não existe` },
      { status: 404 }
    );
  }

  return NextResponse.json(aluno);
}
