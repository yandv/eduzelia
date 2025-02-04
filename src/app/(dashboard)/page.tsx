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
      <h1
        className="lg:text-6xl md:text-5xl text-4xl
  text-sky-950 m-8 font-semibold"
      >
        Olá, {user?.firstName}
      </h1>
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
      tags: [`teacher-${userId}-subjects`],
    },
  });

  return (
    <>
      {subjects.map((subject) => (
        <Link key={subject.id} href={`/materia/${subject.id}`} prefetch>
          <div className="card bg-white m-8 text-sky-950 max-w-sm h-40 shadow-xl scale-100 transform transition duration-500 hover:scale-[1.1] border rounded px-0">
            <div className="card-body flex justify-center place-content-center border rounded">
              <h2 className="card-title">{subject.name}</h2>
            </div>
          </div>
        </Link>
      ))}
    </>
  );
}
