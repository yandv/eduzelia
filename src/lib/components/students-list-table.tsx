"use client";

import { useActionState, useCallback, useState, useTransition } from "react";
import { SchoolClassDto } from "../database/dto/school-class.dto";
import Modal, { useDialog } from "./ui/modal/Modal";
import { Button } from "./ui/Button";
import {
  CreateStudentRequestDto,
  deleteStudentsSchema,
  StudentDto,
} from "../database/dto/student.dto";
import {
  SelectableTable,
  SelectableTableKind,
  useSelection,
} from "./ui/table/SelectableTable";
import FormTextInput from "./ui/form/FormTextInput";
import { createStudent } from "../actions/students/create-student.action";
import { deleteStudents } from "../actions/students/delete-students.action";
import { ConfirmationModal } from "./ui/modal/ConfirmationModal";

interface StudentsListTable {
  schoolClass: SchoolClassDto;
  students: StudentDto[];
}

type TableEntityProps = {
  id: string;
  name: React.ReactNode;
  criteria: React.ReactNode;
  firstGrade: React.ReactNode;
  secondGrade: React.ReactNode;
  thirdGrade: React.ReactNode;
  fourthGrade: React.ReactNode;
  mean: React.ReactNode;
  situation: React.ReactNode;
  frequency: React.ReactNode;
};

function StudentCriteria({ student }: { student: StudentDto }) {
  if (student?.grades.length < 4) {
    return (
      <div
        className="tooltip"
        data-tip={`Para que o 'critério' seja calculado, é necessário que pelo menos 4 notas do aluno ${student?.firstName} ${student?.lastName} sejam lançadas`}
      >
        <p>Notas insuficientes</p>
      </div>
    );
  }

  const mean = student?.grades.slice(0, 4).reduce((a, b) => a + b, 0) / 4;

  if (mean >= 7) {
    return <p>Ótimo</p>;
  }

  if (mean >= 5) {
    return <p>Bom</p>;
  }

  return <p>Ruim</p>;
}

function StudentSituation({ student }: { student: StudentDto }) {
  if (student?.grades.length < 4) {
    return (
      <div
        className="tooltip"
        data-tip={`Para que a 'situação' seja calculada, é necessário que pelo menos 4 notas do aluno ${student?.firstName} ${student?.lastName} sejam lançadas`}
      >
        <p>Notas insuficientes</p>
      </div>
    );
  }

  const mean = student?.grades.slice(0, 4).reduce((a, b) => a + b, 0) / 4;

  return <td>{mean}</td>;
}

export function StudentsListTable({
  students,
  schoolClass,
}: StudentsListTable) {
  const { dispatcher, setSelectedRows, selectedRows } =
    useSelection<TableEntityProps>();
  const { dialogRef, handleModalOpen } = useDialog();
  const {
    dialogRef: confirmationModalDialogRef,
    handleModalOpen: handleConfirmationModalOpen,
  } = useDialog();
  const [isPending, startTransition] = useTransition();

  const rows: TableEntityProps[] = students.map((student) => {
    return {
      id: student.id,
      name: (
        <div
          className="tooltip"
          data-tip={new Date(student?.birthDate).toLocaleDateString("pt-BR")}
        >
          {`${student?.firstName} ${student?.lastName}`}
        </div>
      ),
      criteria: <StudentCriteria student={student} />,
      firstGrade: student?.grades[0],
      secondGrade: student?.grades[1],
      thirdGrade: student?.grades[2],
      fourthGrade: student?.grades[3],
      mean: student?.grades.slice(0, 4).reduce((a, b) => a + b, 0) / 4,
      situation: <StudentSituation student={student} />,
      frequency: (
        <div className="tooltip" data-tip="hello">
          <p>{student?.frequency}%</p>
        </div>
      ),
    };
  });

  const handleDeleteStudent = useCallback(() => {
    startTransition(async () => {
      const formDate = new FormData();
      formDate.append("students", selectedRows.map((row) => row.id).join(","));
      formDate.append("schoolClassId", schoolClass?.id);

      await deleteStudents(formDate);

      setSelectedRows((prevState) =>
        prevState.filter(({ id }) => !selectedRows.some((row) => row.id === id))
      );
    });
  }, [selectedRows, setSelectedRows]);

  return (
    <div>
      <SelectableTable
        headers={[
          { key: "name", label: "Nome do aluno" },
          { key: "criteria", label: "Critério", className: "w-[150px]" },
          { key: "firstGrade", label: "1ª nota", className: "w-[75px]" },
          { key: "secondGrade", label: "2ª nota", className: "w-[75px]" },
          { key: "thirdGrade", label: "3ª nota", className: "w-[75px]" },
          { key: "fourthGrade", label: "4ª nota", className: "w-[75px]" },
          { key: "mean", label: "Média", className: "w-[75px]" },
          { key: "situation", label: "Situação", className: "w-[150px]" },
          { key: "frequency", label: "Frequência", className: "w-[75px]" },
        ]}
        rows={rows}
        selection={SelectableTableKind.MULTIPLE}
        dispatcher={dispatcher}
      />
      <div className="flex justify-end gap-4 mt-4">
        <Button className="ml-2 " onClick={handleModalOpen}>
          Adicionar aluno
        </Button>
        <Button
          className="ml-2"
          disabled={!selectedRows.length || isPending}
          onClick={handleConfirmationModalOpen}
        >
          Excluir selecionado(s)
        </Button>
        <Button className="ml-2" disabled={!selectedRows.length}>
          Salvar
        </Button>
        <CreateStudent schoolClassId={schoolClass?.id} dialogRef={dialogRef} />
        <ConfirmationModal
          dialogRef={confirmationModalDialogRef}
          onSuccess={handleDeleteStudent}
          onCancel={() => confirmationModalDialogRef.current?.close()}
          title="Excluir aluno(s)"
          description={`Tem certeza que deseja excluir ${selectedRows.length} aluno(s) selecionado(s)?`}
        />
      </div>
    </div>
  );
}

interface CreateStudentProps {
  dialogRef: React.RefObject<HTMLDialogElement | null>;
  schoolClassId: string;
}

export function CreateStudent({
  dialogRef,
  schoolClassId,
}: CreateStudentProps) {
  const [isPending, startTransition] = useTransition();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");

  const isFormValid = firstName.trim() && lastName.trim() && birthDate;

  const handleSave = useCallback(() => {
    if (!isFormValid) {
      return;
    }

    const formDate = new FormData();

    formDate.append("firstName", firstName.trim());
    formDate.append("lastName", lastName.trim());
    formDate.append("birthDate", birthDate);
    formDate.append("schoolClassId", schoolClassId);

    startTransition(async () => {
      const createStudentResponse = await createStudent(formDate);

      if (createStudentResponse?.errors) {
        console.log(createStudentResponse?.errors);
      }

      dialogRef?.current?.close();
    });
  }, [firstName, lastName, birthDate]);

  return (
    <Modal dialogRef={dialogRef}>
      <Modal.Body>
        <div className="flex flex-col gap-4">
          <FormTextInput
            label="Nome"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <FormTextInput
            label="Sobrenome"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <FormTextInput
            type="date"
            label="Data de nascimento"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
          />
        </div>
      </Modal.Body>
      <Modal.Actions className="flex flex-col gap-2">
        <Button disabled={!isFormValid || isPending} onClick={handleSave}>
          Salvar
        </Button>
        <Modal.CloseButton handleClose={() => dialogRef?.current?.close()} />
      </Modal.Actions>
    </Modal>
  );
}
