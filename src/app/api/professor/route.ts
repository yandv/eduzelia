import { toCursorResponse } from "@/lib/database/dto/pagination-cursor.dto";
import { prisma } from "@/lib/database/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const professores = await prisma.professor.findMany({
    omit: {
      senha: true,
    },
  });

  return NextResponse.json(toCursorResponse(professores));
}
