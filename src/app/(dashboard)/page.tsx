import { getUserSession } from "@/lib/actions/user-session.action";
import { Suspense } from "@/lib/components/Loading";
import { PageCursorResponseDto } from "@/lib/database/dto/pagination-cursor.dto";
import { SchoolClassDto } from "@/lib/database/dto/school-class.dto";
import { request } from "@/lib/utils/system";
import Link from "next/link";

export default async function SubjectListPage() {
  const { user } = await getUserSession();

  return (
    <>
      <h2 className="text-2xl md:text-3xl lg:text-5xl text-sky-950 mt-6 font-semibold">
        Olá, {user?.firstName}
      </h2>
      <Suspense>
        <SubjectList userId={user?.id} />
      </Suspense>
    </>
  );
}

interface SubjectListProps {
  userId?: string;
}

async function SubjectList({ userId }: SubjectListProps) {
  const { data: subjects } = await request<
    PageCursorResponseDto<SchoolClassDto>
  >(`${process.env.NEXT_PUBLIC_API_URL}/teacher/${userId}/subject`, {
    next: {
      revalidate: 300,
      tags: [`subjects`],
    },
  });

  return (
    <div className="flex flex-row flex-wrap gap-4 mt-6 max-sm:justify-center">
      {subjects.map((subject) => (
        <Link key={subject.id} href={`/materia/${subject.id}`} prefetch>
          <div className="card bg-white text-sky-950 h-40 w-64 shadow-xl scale-100 transform transition duration-500 hover:scale-[1.1] border rounded px-0">
            <div className="card-body flex flex-col justify-center items-center border rounded">
              <h2 className="card-title">{subject.name}</h2>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
