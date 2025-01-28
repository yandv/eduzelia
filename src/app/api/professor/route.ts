import { toCursorResponse } from "@/database/dto/pagination-cursor.dto";
import { prisma } from "@/database/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const professores = await prisma.professor.findMany();

  return NextResponse.json(toCursorResponse(professores));
}
