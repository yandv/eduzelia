import { getUserSession } from "@/lib/actions/user-session.action";
import { PageCursorResponseDto } from "@/lib/database/dto/pagination-cursor.dto";
import { SchoolClassDto } from "@/lib/database/dto/school-class.dto";
import { SubjectDto } from "@/lib/database/dto/subject.dto";
import { request } from "@/lib/utils/system";
import Link from "next/link";

interface Subject extends SubjectDto {
  schoolClasses: PageCursorResponseDto<SchoolClassDto>;
}

export default async function SubjectPage({
  params,
}: {
  params: Promise<{ subjectId: string }>;
}) {
  const { user } = await getUserSession();

  const { subjectId } = await params;

  const {
    name,
    schoolClasses: { data: schoolClasses },
  } = await request<Subject>(
    `${process.env.NEXT_PUBLIC_API_URL}/teacher/${user?.id}/subject/${subjectId}/school-class`,
    {
      next: {
        revalidate: 300,
        tags: [`teacher-${user?.id}-subject-${subjectId}-school-classes`],
      },
      cache: "no-cache",
    }
  );

  const schoolClassesAgroupedByYear = (schoolClasses ?? [])?.reduce(
    (acc, schoolClass) => {
      if (!acc[schoolClass.year]) {
        acc[schoolClass.year] = [];
      }

      acc[schoolClass.year].push(schoolClass);

      return acc;
    },
    {} as Record<number, SchoolClassDto[]>
  );

  return (
    <div className="text-sky-950 font-semibold">
      <h1 className="text-5xl mt-6">Matéria: {name}</h1>
      <ul className="m-8">
        {Object.entries(schoolClassesAgroupedByYear)
          .sort(([firstYear], [secondYear]) => +secondYear - +firstYear)
          .map(([year, schoolClasses]) => (
            <li key={year}>
              <h2 className="text-4xl">{year}</h2>
              <div
                id="turmas"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              >
                {schoolClasses.map((schoolClass) => (
                  <Link
                    key={schoolClass.id}
                    href={`/materia/${subjectId}/turmas/${schoolClass.id}`}
                    prefetch
                  >
                    <div className="card bg-white mt-6 text-sky-950 max-w-sm h-40 shadow-xl scale-100 transform transition duration-500 hover:scale-[1.1] border rounded px-0">
                      <div className="card-body flex flex-row justify-center place-content-center border rounded">
                        <h2 className="card-title">
                          <ul className="flex flex-row text-2xl">
                            <li>Turma {schoolClass.name}</li>
                          </ul>
                        </h2>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="divider mt-6"></div>
            </li>
          ))}
      </ul>
    </div>
  );
}
