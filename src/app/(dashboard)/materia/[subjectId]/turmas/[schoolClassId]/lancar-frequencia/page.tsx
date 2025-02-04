import { getUserSession } from "@/lib/actions/user-session.action";
import { BaseQueryParams } from "@/lib/utils/base-query-params";
import { StudentListTable } from "./student-list-table";
import { Suspense } from "@/lib/components/Loading";

export default async function UpdateFrequencyPage({
  params,
}: BaseQueryParams<{ subjectId: string; schoolClassId: string }>) {
  const { user } = await getUserSession();
  const { subjectId, schoolClassId } = await params;

  return (
    <>
      <h1 className="lg:text-6xl md:text-5xl text-4xl text-sky-950 m-8 font-semibold">
        Atualizar frequência
      </h1>
      <form action="" className="mx-8">
        <label className="block text-sm font-medium text-gray-700">
          Selecione a data:
        </label>
        <input
          type="date"
          className="input input-bordered w-full max-w-xs bg-slate-50 text-gray-900"
          defaultValue={new Date().toISOString().split("T")[0]}
        />
        <Suspense>
          <StudentListTable
            userId={user?.id}
            subjectId={subjectId}
            schoolClassId={schoolClassId}
          />
        </Suspense>
        <div className="flex lg:justify-end md:justify-end justify-center">
          <button className="btn text-white bg-sky-950 hover:bg-sky-900 mt-6 w-64 ">
            Lançar frequência
          </button>
        </div>
      </form>
    </>
  );
}
