"use client";

import { useRouter } from "next/navigation";
import { SchoolClassDto } from "../database/dto/school-class.dto";

interface TurmaProps {
  schoolClass: SchoolClassDto;
  subjectId: string;
}

export default function TurmaCard({ schoolClass, subjectId }: TurmaProps) {
  const { push } = useRouter();

  const handleClick = () => {
    push(`/materia/${subjectId}/turmas/${schoolClass.id}`);
  };

  return (
    <div
      className="card bg-white mt-6 text-sky-950 max-w-sm h-40 shadow-xl scale-100 transform transition duration-500 hover:scale-[1.1] border rounded px-0"
      onClick={handleClick}
    >
      <div className="card-body flex flex-row justify-center place-content-center border rounded">
        <h2 className="card-title">
          <ul className="flex flex-row text-2xl">
            <li>Turma {schoolClass.name}</li>
          </ul>
        </h2>
      </div>
    </div>
  );
}
