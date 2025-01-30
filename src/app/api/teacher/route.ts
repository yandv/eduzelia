import { toCursorResponse } from "@/lib/database/dto/pagination-cursor.dto";
import { prisma } from "@/lib/database/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const teachers = await prisma.teacher.findMany({
    omit: {
      password: true,
    },
  });

  return NextResponse.json(toCursorResponse(teachers));
}
