import { getUserSession } from "@/lib/actions/user-session.action";
import { PageCursorResponseDto } from "@/lib/database/dto/pagination-cursor.dto";
import { SchoolClassDto } from "@/lib/database/dto/school-class.dto";
import { StudentDto } from "@/lib/database/dto/student.dto";
import { BaseQueryParams } from "@/lib/utils/base-query-params";
import { request } from "@/lib/utils/system";

// dps coloca esse componente em algum outro lugar

interface TableRowProps {
  student: StudentDto;
}

function TableRow({ student }: TableRowProps) {
  const mean = student?.grades.slice(0, 4).reduce((a, b) => a + b, 0) / 4;

  // onde está as notas colocarei um input para edição que fará uma requisição para endpoint de atualizar nota ou usará uma action do nextjs, to vendo ainda....

  return (
    <tr>
      <th>1</th>
      <td>
        <div
          className="tooltip tooltip-right"
          data-tip={new Date(student?.birthDate).toLocaleDateString("pt-BR")}
        >
          {`${student?.firstName} ${student?.lastName}`}
        </div>
      </td>
      <td>
        <div
          className="tooltip tooltip-right"
          data-tip="O critério é calculado com base na média das notas"
        >
          Muito bom
        </div>
      </td>
      <td>{student?.grades[0] ?? 0}</td>
      <td>{student?.grades[1] ?? 0}</td>
      <td>{student?.grades[2] ?? 0}</td>
      <td>{student?.grades[3] ?? 0}</td>
      <td>{mean}</td>
      <td>
        {mean >= 5
          ? "Aprovado"
          : student?.grades.length < 4
          ? "Notas lançadas insuficientes"
          : "Reprovado"}
      </td>
      <td>
        <div className="tooltip tooltip-right" data-tip="hello">
          <p>{student?.frequency}%</p>
        </div>
      </td>
    </tr>
  );
}

export default async function SchoolClassPage({
  params,
}: BaseQueryParams<{ subjectId: string; schoolClassId: string }>) {
  const { user } = await getUserSession();
  const { subjectId, schoolClassId } = await params;

  const [{ data: students }, schoolClass] = await Promise.all([
    request<PageCursorResponseDto<StudentDto>>(
      `${process.env.NEXT_PUBLIC_API_URL}/teacher/${user?.id}/subject/${subjectId}/school-class/${schoolClassId}/students`,
      {
        next: {
          revalidate: 300,
          tags: [
            `teacher-${user?.id}-subject-${subjectId}-school-class-${schoolClassId}-students`,
          ],
        },
        cache: "no-cache",
      }
    ),
    request<SchoolClassDto>(
      `${process.env.NEXT_PUBLIC_API_URL}/teacher/${user?.id}/subject/${subjectId}/school-class/${schoolClassId}`,
      {
        next: {
          revalidate: 300,
          tags: [
            `teacher-${user?.id}-subject-${subjectId}-school-class-${schoolClassId}`,
          ],
        },
        cache: "no-cache",
      }
    ),
  ]);

  return (
    <div>
      <h2 className="text-4xl text-sky-950 font-semibold mt-6">
        Turma {schoolClass?.name} - Língua Portuguesa
      </h2>
      <div>
        <button className="btn text-white bg-sky-950 hover:bg-sky-900 mt-6 w-32">
          Lançar nota
        </button>

        <button className="btn text-white bg-sky-950 hover:bg-sky-900 mt-6 w-48">
          Lançar frequência
        </button>

        <button className="btn text-white bg-sky-950 hover:bg-sky-900 mt-6 w-48">
          Gerenciar alunos
        </button>

        <button className="btn text-white bg-sky-950 hover:bg-sky-900 mt-6 w-48">
          Exportar planilha
        </button>
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
              {students.map((student) => (
                <TableRow key={student.id} student={student} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
