"use client";

import { useEffect, useState } from "react";
import { SchoolClassDto } from "../database/dto/school-class.dto";
import Modal from "./ui/Modal";
import { Button } from "./ui/Button";
import { StudentDto } from "../database/dto/student.dto";

interface StudentManageProps {
  schoolClass: SchoolClassDto;
  students: StudentDto[];
}

interface TableRowProps {
  student: StudentDto;
  selected: boolean;
  handleSelectStudent: () => void;
}

function TableRow({ student, selected, handleSelectStudent }: TableRowProps) {
  return (
    <tr>
      <th>
        <input
          type="checkbox"
          checked={selected}
          onChange={handleSelectStudent}
        />
      </th>
      <td>
        <div
          className="tooltip"
          data-tip={new Date(student?.birthDate).toLocaleDateString("pt-BR")}
        >
          {`${student?.firstName} ${student?.lastName}`}
        </div>
      </td>
      <td>
        {student.grades.reduce((acc, grade) => acc + grade, 0) /
          Math.max(1, student.grades.length)}
      </td>
      <td>{student.frequency}%</td>
    </tr>
  );
}

export function StudentsManage({ schoolClass, students }: StudentManageProps) {
  const [visible, setVisible] = useState(false);
  const [virtualStudents, setVirtualStudents] = useState<StudentDto[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<StudentDto[]>([]);

  useEffect(() => {
    setVirtualStudents(students);
    setSelectedStudents([])
  }, [visible, students]);

  const handleToggle = () => setVisible((prevState) => !prevState);

  const handleClose = () => {
    setVisible(false);
  };

  const handleSelectStudent = (student: StudentDto) => {
    return () => {
      setSelectedStudents((prevState) =>
        prevState.some((selectedStudent) => selectedStudent.id === student.id)
          ? prevState.filter(
              (selectedStudent) => selectedStudent.id !== student.id
            )
          : [...prevState, student]
      );
    };
  };

  const handleRemoveStudent = () => {
    setVirtualStudents((prevState) =>
      prevState.filter(
        (student) =>
          !selectedStudents.some(
            (selectedStudent) => selectedStudent.id === student.id
          )
      )
    );
  };

  return (
    <>
      <Button
        className="btn text-white bg-sky-950 hover:bg-sky-900"
        onClick={handleToggle}
      >
        Gerenciar alunos
      </Button>
      <Modal visible={visible} onClose={handleClose} closeButton>
        <Modal.Title>
          <h3 className="text-sm text-sky-950 font-semibold">
            Gerenciar alunos - {schoolClass?.name}
          </h3>

          <Button className="ml-3">
            Adicionar aluno
          </Button>

          <Button
            className="ml-3"
            disabled={!selectedStudents.length}
            onClick={handleRemoveStudent}
          >
            Remover aluno
          </Button>
        </Modal.Title>
        <Modal.ModalBody>
          <table className="table text-black">
            <thead className="text-sky-950 text-lg">
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedStudents.length === students.length}
                    onChange={() =>
                      selectedStudents.length !== students.length
                        ? setSelectedStudents(students)
                        : setSelectedStudents([])
                    }
                  />
                </th>
                <th>Aluno</th>
                <th>Média</th>
                <th>Frequência</th>
              </tr>
            </thead>
            <tbody>
              {virtualStudents.map((student) => (
                <TableRow
                  key={student.id}
                  student={student}
                  selected={selectedStudents.some(
                    (selectedStudent) => selectedStudent.id === student.id
                  )}
                  handleSelectStudent={handleSelectStudent(student)}
                />
              ))}
            </tbody>
          </table>
        </Modal.ModalBody>
        <Modal.Actions>
          <Button
            className="ml-3"
            disabled={virtualStudents.every((student) =>
              students.some((s) => s.id === student.id)
            )}
          >
            Salvar
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
}
