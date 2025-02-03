import { getUserSession } from "@/lib/actions/user-session.action";
import Card from "@/lib/components/Card";
import { PageCursorResponseDto } from "@/lib/database/dto/pagination-cursor.dto";
import { SchoolClassDto } from "@/lib/database/dto/school-class.dto";
import { request } from "@/lib/utils/system";

export default async function Home() {
  const { user } = await getUserSession();

  const { data: subjects } = await request<
    PageCursorResponseDto<SchoolClassDto>
  >(`${process.env.NEXT_PUBLIC_API_URL}/teacher/${user?.id}/subject`, {
    next: {
      revalidate: 300,
      tags: [`teacher-${user?.id}-subjects`],
    },
  });

  return (
    <>
      <h1 className="lg:text-6xl md:text-5xl text-4xl
  text-sky-950 m-8 font-semibold">
        Olá, {user?.firstName}
      </h1>
      {subjects.map((subject) => (
        <Card key={subject.id} subject={subject} />
      ))}
    </>
  );
}
