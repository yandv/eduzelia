import { getUserSession } from "@/lib/actions/user-session.action";
import { PageCursorResponseDto } from "@/lib/database/dto/pagination-cursor.dto";
import { SchoolClassDto } from "@/lib/database/dto/school-class.dto";
import { SubjectDto } from "@/lib/database/dto/subject.dto";
import { request } from "@/lib/utils/system";

export default async function SubjectPage({
  params: { subjectId },
}: {
  params: { subjectId: string };
}) {
  const { user } = await getUserSession();

  const [subject, { data: schoolClasses }] = await Promise.all([
    request<SubjectDto>(
      `${process.env.NEXT_PUBLIC_API_URL}/teacher/${user?.id}/subject/${subjectId}`,
      {
        next: {
          revalidate: 300,
          tags: [`teacher-${user?.id}-subject-${subjectId}`],
        },
      }
    ),
    request<PageCursorResponseDto<SchoolClassDto>>(
      `${process.env.NEXT_PUBLIC_API_URL}/teacher/${user?.id}/subject/${subjectId}/school-class`,
      {
        next: {
          revalidate: 300,
          tags: [`teacher-${user?.id}-subject-${subjectId}-school-classes`],
        },
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
    {} as Record<string, SchoolClassDto[]>
  );

  return (
    <div>
      <h1>Matéria: {subject.name}</h1>
      <ul>
        {Object.entries(schoolClassesAgroupedByYear).map(
          ([year, schoolClasses]) => (
            <li key={year}>
              <h2>{year}</h2>
              <ul>
                {schoolClasses.map((schoolClass) => (
                  <li key={schoolClass.id}>{schoolClass.name}</li>
                ))}
              </ul>
            </li>
          )
        )}
      </ul>
    </div>
  );
}
