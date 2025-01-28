import { prisma } from "@/database/prisma";
import { BaseQueryParams } from "@/utils/base-query-params";
import { NextResponse } from "next/server";

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

  return NextResponse.json(professor);
}
