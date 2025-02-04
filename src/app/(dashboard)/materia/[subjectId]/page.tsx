import { getUserSession } from "@/lib/actions/user-session.action";
import { Suspense } from "@/lib/components/Loading";
import { Button } from "@/lib/components/ui/Button";
import { PageCursorResponseDto } from "@/lib/database/dto/pagination-cursor.dto";
import { SchoolClassDto } from "@/lib/database/dto/school-class.dto";
import { SubjectDto } from "@/lib/database/dto/subject.dto";
import { BaseQueryParams } from "@/lib/utils/base-query-params";
import { request } from "@/lib/utils/system";
import Link from "next/link";
import { CreateSchoolClass } from "./create-school-class";

interface Subject extends SubjectDto {
  schoolClasses: PageCursorResponseDto<SchoolClassDto>;
}

export default async function SubjectPage({
  params,
}: BaseQueryParams<{ subjectId: string }>) {
  const { user } = await getUserSession();
  const { subjectId } = await params;

  return (
    <Suspense>
      <SchoolClassList userId={user?.id} subjectId={subjectId} />
    </Suspense>
  );
}

interface SchoolClassListProps {
  userId?: string;
  subjectId: string;
}

async function SchoolClassList({ userId, subjectId }: SchoolClassListProps) {
  const {
    name,
    schoolClasses: { data: schoolClasses },
  } = await request<Subject>(
    `${process.env.NEXT_PUBLIC_API_URL}/teacher/${userId}/subject/${subjectId}/school-class`,
    {
      next: {
        revalidate: 300,
        tags: [`school-classes`],
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
    <>
      <div className="flex flex-row justify-between mt-6">
        <h2 className="text-2xl md:text-3xl lg:text-5xl text-sky-950 font-semibold">
          Matéria: {name}
        </h2>
        <div className="flex flex-row flex-wrap gap-1">
          <CreateSchoolClass subjectId={subjectId} />

          <Link href={"/"}>
            <Button>Página principal</Button>
          </Link>
        </div>
      </div>
      <div className="mt-8">
        {Object.entries(schoolClassesAgroupedByYear)
          .sort(([firstYear], [secondYear]) => +secondYear - +firstYear)
          .map(([year, schoolClasses]) => (
            <div key={year} className="w-full">
              <h2 className="text-4xl">{year}</h2>
              <div className="flex flex-row gap-4 flex-wrap">
                {schoolClasses.map((schoolClass) => (
                  <Link
                    key={schoolClass.id}
                    href={`/materia/${subjectId}/turmas/${schoolClass.id}`}
                    prefetch
                  >
                    <div className="card bg-white mt-6 text-sky-950 max-w-sm h-40 w-56 shadow-xl scale-100 transform transition duration-500 hover:scale-[1.1] border rounded px-0">
                      <div className="card-body flex flex-row justify-center place-content-center border rounded">
                        <h2 className="card-title">
                          <div className="flex flex-row text-2xl">
                            <p>Turma {schoolClass.name}</p>
                          </div>
                        </h2>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="divider mt-6" />
            </div>
          ))}
      </div>
    </>
  );
}
