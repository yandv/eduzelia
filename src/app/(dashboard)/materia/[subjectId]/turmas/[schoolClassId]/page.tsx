import { getUserSession } from "@/lib/actions/user-session.action";
import { Suspense } from "@/lib/components/Loading";
import { StudentsListTable } from "@/lib/components/students-list-table";
import { Button } from "@/lib/components/ui/Button";
import { PageCursorResponseDto } from "@/lib/database/dto/pagination-cursor.dto";
import { SchoolClassDto } from "@/lib/database/dto/school-class.dto";
import { StudentDto } from "@/lib/database/dto/student.dto";
import { BaseQueryParams } from "@/lib/utils/base-query-params";
import { request } from "@/lib/utils/system";
import Link from "next/link";

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
        <Link
          href={`/api/teacher/${userId}/subject/${subjectId}/school-class/${schoolClassId}/students/export`}
          target="_blank"
        >
          <Button className="w-64" type="submit">
            Exportar planilha
          </Button>
        </Link>
      </div>
      <div className="max-w-7xl mx-auto mt-5">
        <StudentsListTable
          schoolClass={schoolClass}
          students={schoolClass.students.data}
        />
      </div>
    </>
  );
}
