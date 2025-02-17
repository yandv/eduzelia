import { getUserSession } from "@/lib/actions/user-session.action";
import { Suspense } from "@/lib/components/Loading";
import { AddStudent } from "@/lib/components/StudentsManage";
import { Button } from "@/lib/components/ui/Button";
import { PageCursorResponseDto } from "@/lib/database/dto/pagination-cursor.dto";
import { SchoolClassDto } from "@/lib/database/dto/school-class.dto";
import { StudentDto } from "@/lib/database/dto/student.dto";
import { BaseQueryParams } from "@/lib/utils/base-query-params";
import { request } from "@/lib/utils/system";
import Link from "next/link";

// dps coloca esse componente em algum outro lugar

interface TableRowProps {
  student: StudentDto;
}

function StudentCriteria({ student }: TableRowProps) {
  if (student?.grades.length < 4) {
    return (
      <div
        className="tooltip"
        data-tip={`Para que o 'critério' seja calculado, é necessário que pelo menos 4 notas do aluno ${student?.firstName} ${student?.lastName} sejam lançadas`}
      >
        <p>Notas insuficientes</p>
      </div>
    );
  }

  const mean = student?.grades.slice(0, 4).reduce((a, b) => a + b, 0) / 4;

  if (mean >= 7) {
    return <p>Ótimo</p>;
  }

  if (mean >= 5) {
    return <p>Bom</p>;
  }

  return <p>Ruim</p>;
}

function StudentSituation({ student }: TableRowProps) {
  if (student?.grades.length < 4) {
    return (
      <div
        className="tooltip"
        data-tip={`Para que a 'situação' seja calculada, é necessário que pelo menos 4 notas do aluno ${student?.firstName} ${student?.lastName} sejam lançadas`}
      >
        <p>Notas insuficientes</p>
      </div>
    );
  }

  const mean = student?.grades.slice(0, 4).reduce((a, b) => a + b, 0) / 4;

  return <td>{mean}</td>;
}

function TableRow({ student }: TableRowProps) {
  const mean = student?.grades.slice(0, 4).reduce((a, b) => a + b, 0) / 4;

  return (
    <tr>
      <th>1</th>
      <td>
        <div
          className="tooltip"
          data-tip={new Date(student?.birthDate).toLocaleDateString("pt-BR")}
        >
          {`${student?.firstName} ${student?.lastName}`}
        </div>
      </td>
      <td>
        <StudentCriteria student={student} />
      </td>
      <td>{student?.grades[0] ?? 0}</td>
      <td>{student?.grades[1] ?? 0}</td>
      <td>{student?.grades[2] ?? 0}</td>
      <td>{student?.grades[3] ?? 0}</td>
      <td>{mean}</td>
      <td>
        <StudentSituation student={student} />
      </td>
      <td>
        <div className="tooltip" data-tip="hello">
          <p>{student?.frequency}%</p>
        </div>
      </td>
    </tr>
  );
}

interface SchoolClass extends SchoolClassDto {
  students: PageCursorResponseDto<StudentDto>;
}

export default async function SchoolClassPage({
  params,
}: BaseQueryParams<{ subjectId: string; schoolClassId: string }>) {
  const { user } = await getUserSession();
  const { subjectId, schoolClassId } = await params;

  return (
    <div>
      <Suspense>
        <StudentList
          userId={user?.id}
          subjectId={subjectId}
          schoolClassId={schoolClassId}
        />
      </Suspense>
    </div>
  );
}

interface StudentListProps {
  userId?: string;
  subjectId: string;
  schoolClassId: string;
}

async function StudentList({
  userId,
  subjectId,
  schoolClassId,
}: StudentListProps) {
  const schoolClass = await request<SchoolClass>(
    `${process.env.NEXT_PUBLIC_API_URL}/teacher/${userId}/subject/${subjectId}/school-class/${schoolClassId}/students`,
    {
      next: {
        revalidate: 300,
        tags: [`students`],
      },
      cache: "no-cache",
    }
  );

  return (
    <>
      <h2 className="text-2xl md:text-3xl lg:text-5xl text-sky-950 mt-6 font-semibold">
        Turma {schoolClass.name} - {schoolClass.subject?.name}
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-4 place-items-center gap-4 mt-6">
        <Button className="w-64">Lançar nota</Button>
        <Link
          href={`/materia/${subjectId}/turmas/${schoolClass.id}/lancar-frequencia`}
          prefetch
        >
          <Button className="w-64">Lançar frequência</Button>
        </Link>
        <AddStudent
          schoolClass={schoolClass}
          students={schoolClass.students.data}
        />
        <Button className="w-64">Exportar planilha</Button>
      </div>
      <div className="max-w-7xl mx-auto mt-5">
        <div className="overflow-x-scroll overflow-y-scroll">
          <table className="table text-black">
            <thead className="text-sky-950 text-lg">
              <tr>
                <th />
                <th>Aluno</th>
                <th>Critério</th>
                <th>Nota 1</th>
                <th>Nota 2</th>
                <th>Nota 3</th>
                <th>Nota 4</th>
                <th>Média</th>
                <th>Situação</th>
                <th>Frequência</th>
              </tr>
            </thead>
            <tbody>
              {schoolClass.students.data.map((student) => (
                <TableRow key={student.id} student={student} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
