import { getUserSession } from "@/lib/actions/user-session.action";
import Card from "@/lib/components/Card";
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
  const dadosDaTurmaPorAno = {
    2025: [{
      ID: 'a',
      ano: '2025',

    }],
    2024: [],
  }
  // 701 2025 , 702 2024, 703 2024
  // acc = {};
  // acc = {'2025': []} -> {'2025': ['turma 701']}
  // acc = {'2024': [], '2025':['turma 701']} -> {'2024':[turma 702],'2025': ['turma 701']}
  // acc = {'2024': ['turma 702', 'turma 703'], '2025':['turma 701']}
  //   
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0 ">
                {schoolClasses.map((schoolClass) => (
                  <div key={schoolClass.id} className="card bg-white mt-6 text-sky-950 w-96 h-40 shadow-xl scale-100 transform transition duration-500 hover:scale-[1.1] border rounded px-0">
                    <div className="card-body flex flex-row justify-center place-content-center border rounded">
                      <h2 className="card-title">
                        <ul className="flex flex-row text-2xl">Turma &nbsp;
                          <li >{schoolClass.name}</li>
                        </ul>
                      </h2>
                    </div>
                  </div>
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
