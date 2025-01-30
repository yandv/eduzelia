"use client";

import { redirect, useRouter } from "next/navigation";
import { SubjectDto } from "../database/dto/subject.dto";

interface CardProps {
  subject: SubjectDto;
}

export default function Card({ subject }: CardProps) {
  const { push } = useRouter();

  const handleClick = () => {
    push(`/materia/${subject.id}`);
  };

  return (
    <div
      className="card bg-white m-8 text-sky-950 w-96 h-40 shadow-xl scale-100 transform transition duration-500 hover:scale-[1.1] border rounded"
      onClick={handleClick}
    >
      <div className="card-body flex justify-center place-content-center border rounded">
        <h2 className="card-title">{subject.name}</h2>
      </div>
    </div>
  );
}
