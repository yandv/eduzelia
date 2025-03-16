import { getUserSession } from "@/lib/actions/user-session.action";
import { BaseQueryParams } from "@/lib/utils/base-query-params";
import { StudentFrequencyListTable } from "./student-list-table";
import { Suspense } from "@/lib/components/Loading";
import { request } from "@/lib/utils/system";
import { SchoolClass } from "@/lib/database/dto/school-class.dto";

export default async function FrequencyPage({
  params,
}: BaseQueryParams<{ subjectId: string; schoolClassId: string }>) {
  const { user } = await getUserSession();
  const { subjectId, schoolClassId } = await params;

  return (
    <>
      <Suspense>
        <FrequencyPageLoader
          userId={user?.id}
          subjectId={subjectId}
          schoolClassId={schoolClassId}
        />
      </Suspense>
    </>
  );
}

interface FrequencyPageLoaderProps {
  userId?: string;
  subjectId: string;
  schoolClassId: string;
}

async function FrequencyPageLoader({
  userId,
  subjectId,
  schoolClassId,
}: FrequencyPageLoaderProps) {
  const schoolClass = await request<SchoolClass>(
    `${process.env.NEXT_PUBLIC_API_URL}/teacher/${userId}/subject/${subjectId}/school-class/${schoolClassId}/students`,
    {
      next: {
        revalidate: 300,
        tags: [`students`],
      },
    }
  );

  return (
    <>
      <h2 className="text-2xl md:text-3xl lg:text-5xl text-sky-950 mt-6 font-semibold">
        Frequência da turma {schoolClass.name}
      </h2>
      {userId && (
        <StudentFrequencyListTable
          schoolClass={schoolClass}
          teacherId={userId}
        />
      )}
    </>
  );
}
