import { getUserSession } from "@/lib/actions/user-session.action";
import Card from "@/lib/components/Card";
import TurmaCard from "@/lib/components/TurmaCard";
import { PageCursorResponseDto } from "@/lib/database/dto/pagination-cursor.dto";
import { SchoolClassDto } from "@/lib/database/dto/school-class.dto";
import { SubjectDto } from "@/lib/database/dto/subject.dto";
import { request } from "@/lib/utils/system";

export default async function SubjectPage({
  params,
}: {
  params: Promise<{ subjectId: string }>;
}) {
  const { user } = await getUserSession();

  const { subjectId } = await params;

  const [subject, { data: schoolClasses }] = await Promise.all([
    request<SubjectDto>(
      `${process.env.NEXT_PUBLIC_API_URL}/teacher/${user?.id}/subject/${subjectId}`,
      {
        next: {
          revalidate: 300,
          tags: [`teacher-${user?.id}-subject-${subjectId}`],
        },
        cache: 'no-cache'
      }
    ),
    request<PageCursorResponseDto<SchoolClassDto>>(
      `${process.env.NEXT_PUBLIC_API_URL}/teacher/${user?.id}/subject/${subjectId}/school-class`,
      {
        next: {
          revalidate: 300,
          tags: [`teacher-${user?.id}-subject-${subjectId}-school-classes`],
        },
        cache: 'no-cache'
      }
    ),
  ]);
  
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
      <h1 className="text-5xl m-8">Matéria: {subject.name}</h1>
      <ul className="m-8">
        {Object.entries(schoolClassesAgroupedByYear).sort(([firstYear], [secondYear]) => +secondYear - +firstYear).map(
          ([year, schoolClasses]) => (
            <li key={year}>
              <h2 className="text-4xl">{year}</h2>
              <div id="turmas" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {schoolClasses.map((schoolClass) => (
                  <TurmaCard key={schoolClass.id} name={schoolClass.name} id={schoolClass.id} />
                ))}
              </div>
              <div className="divider mt-6"></div>
            </li>
          )
        )}
      </ul>
    </div>
  );
}
