import { BaseQueryParams } from "@/lib/utils/base-query-params";
import { utils, write } from "xlsx";
import { GET as getStudents } from "../route";

export async function GET(
  request: Request,
  {
    params,
  }: BaseQueryParams<{
    teacherId: string;
    subjectId: string;
    schoolClassId: string;
  }>
) {
  const response = await getStudents(request, { params });
  const {
    students: { data: students },
  } = await response.json();

  const workbook = utils.book_new();

  const grades = ["Nota 1", "Nota 2", "Nota 3", "Nota 4"];

  const worksheet = utils.aoa_to_sheet([
    [
      "Ordem",
      "Nome completo",
      "Critério",
      ...grades,
      "Média",
      "Situação",
      "Frequência",
    ],
    ...students.map((student: any, idx: number) => [
      idx + 1,
      `${student.firstName} ${student.lastName}`,
      "Sem critério",
      ...Array.from({ length: 4 }).map((_, idx) => student.grades[idx] ?? 0),
      student.grades.reduce((acc: number, grade: number) => acc + grade, 0) /
        Math.max(1, student.grades.length),
      "Sem situação",
      `${student.frequency}%`,
    ]),
  ]);

  worksheet["!cols"] = [
    { wpx: 40 },
    { wpx: 200 },
    { wpx: 75 },
    { wpx: 50 },
    { wpx: 50 },
    { wpx: 50 },
    { wpx: 50 },
    { wpx: 50 },
    { wpx: 100 },
    { wpx: 75 },
  ];

  utils.book_append_sheet(workbook, worksheet, "Aluno");

  const buffer = Buffer.from(
    write(workbook, { type: "base64", bookType: "xlsx", bookSST: false }),
    "base64"
  );

  return new Response(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": "attachment; filename=planilha.xlsx",
    },
  });
}
