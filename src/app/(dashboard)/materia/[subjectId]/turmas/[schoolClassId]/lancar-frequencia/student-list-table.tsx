import Table from "@/lib/components/Table";
import { PageCursorResponseDto } from "@/lib/database/dto/pagination-cursor.dto";
import { SchoolClassDto } from "@/lib/database/dto/school-class.dto";
import { StudentDto } from "@/lib/database/dto/student.dto";
import { request } from "@/lib/utils/system";

interface StudentListProps {
  userId?: string;
  subjectId: string;
  schoolClassId: string;
}

interface SchoolClass extends SchoolClassDto {
  students: PageCursorResponseDto<StudentDto>;
}

export async function StudentListTable({
  userId,
  subjectId,
  schoolClassId,
}: StudentListProps) {
  const schoolClass = await request<SchoolClass>(
    `${process.env.NEXT_PUBLIC_API_URL}/teacher/${userId}/subject/${subjectId}/school-class/${schoolClassId}/students`,
    {
      next: {
        revalidate: 300,
        tags: [
          `teacher-${userId}-subject-${subjectId}-school-class-${schoolClassId}-students`,
        ],
      },
      cache: "no-cache",
    }
  );

  const tableRows = schoolClass.students?.data.map((student, idx) => ({
    id: student.id,
    order: idx + 1,
    studentName: student.firstName + " " + student.lastName,
    presence: (
      <input
        type="checkbox"
        className="toggle toggle-success [--tglbg:aliceblue] "
      />
    ),
  }));

  return (
    <Table
      headers={[
        { key: "order", label: "Ordem da chamada", className: "w-2/6" },
        { key: "studentName", label: "Nome do aluno", className: "w-4/6" },
        { key: "presence", label: "Presença", className: "w-2/6" },
      ]}
      rows={tableRows}
    />
  );
}
