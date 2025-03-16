"use client";

import { frequency } from "@/lib/actions/students/frequency.action";
import { Button } from "@/lib/components/ui/Button";
import FormTextarea from "@/lib/components/ui/form/FormTextarea";
import FormTextInput from "@/lib/components/ui/form/FormTextInput";
import { ConfirmationModal } from "@/lib/components/ui/modal/ConfirmationModal";
import { useDialog } from "@/lib/components/ui/modal/Modal";
import Table from "@/lib/components/ui/table/Table";
import { SchoolClass } from "@/lib/database/dto/school-class.dto";
import { StudentDto } from "@/lib/database/dto/student.dto";
import { useState, useTransition } from "react";

interface StudentListProps {
  schoolClass: SchoolClass;
  teacherId: string;
}

export function StudentFrequencyListTable({
  schoolClass,
  teacherId,
}: StudentListProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [description, setDescription] = useState("");
  const [students, setStudents] = useState<StudentDto[]>([]);

  const { dialogRef } = useDialog();

  const [isPending, startTransition] = useTransition();

  const tableRows = schoolClass.students?.data.map((student, idx) => ({
    id: student.id,
    order: idx + 1,
    studentName: student.firstName + " " + student.lastName,
    presence: (
      <input
        type="checkbox"
        className="toggle toggle-success [--tglbg:aliceblue] "
        onChange={() => {
          setStudents((prev) => {
            const studentIndex = prev.findIndex((s) => s.id === student.id);

            if (studentIndex === -1) {
              return [...prev, student];
            }

            return prev.filter((s) => s.id !== student.id);
          });
        }}
        checked={students.some((s) => s.id === student.id)}
      />
    ),
  }));

  const handleSubmit = () => {
    startTransition(async () => {
      const formData = new FormData();

      formData.append("date", date.toISOString());
      formData.append("description", description);
      formData.append("schoolClassId", schoolClass.id);
      formData.append("teacherId", teacherId);
      formData.append(
        "students",
        students.map((student) => student.id).join(",")
      );

      await frequency(formData);
    });
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormTextInput
          type="date"
          label="Selecione a data:"
          value={date.toISOString().split("T")[0]}
          onChange={(e) => setDate(new Date(e.target.value))}
        />
        <FormTextarea
          type="text"
          label="Assunto:"
          placeholder="Tópico do dia"
          className="w-full"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <Table
        headers={[
          { key: "order", label: "Ordem da chamada" },
          {
            key: "studentName",
            label: "Nome do aluno",
          },
          { key: "presence", label: "Presença" },
        ]}
        rows={tableRows}
      />

      <div className="flex lg:justify-end md:justify-end justify-center">
        <Button
          className="mt-6"
          onClick={() => dialogRef?.current?.showModal()}
          disabled={isPending}
        >
          Lançar frequência
        </Button>
      </div>
      <ConfirmationModal
        dialogRef={dialogRef}
        title="Lançar frequência"
        description={`Tem certeza que deseja lançar a frequência do dia ${date.toLocaleDateString(
          "pt-BR"
        )} da turma ${schoolClass?.name}?`}
        onSuccess={handleSubmit}
      />
    </>
  );
}
