import { prisma } from "@/database/prisma";
import { BaseQueryParams } from "@/utils/base-query-params";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  { params }: BaseQueryParams<{ professorId: string; turmaId: string }>
) {
  const { professorId, turmaId } = await params;
  const turma = await prisma.turma.findFirst({
    where: {
      id: turmaId,
      professorId,
    },
  });

  if (!turma) {
    return NextResponse.json(
      { message: `A turma ${turmaId} não existe` },
      { status: 404 }
    );
  }

  return NextResponse.json(turma);
}
