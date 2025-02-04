"use client";

import { useState } from "react";
import { SchoolClassDto } from "../database/dto/school-class.dto";
import Modal from "./ui/Modal";
import { Button } from "./ui/Button";
import { StudentDto } from "../database/dto/student.dto";
import FormTextInput from "./form/FormTextInput";

interface StudentManageProps {
  schoolClass: SchoolClassDto;
  students: StudentDto[];
}

export function AddStudent({ schoolClass }: StudentManageProps) {
  const [visible, setVisible] = useState(false);

  const handleToggle = () => setVisible((prevState) => !prevState);

  const handleClose = () => {
    setVisible(false);
  };

  return (
    <>
      <Button className="w-64" onClick={handleToggle}>Adicionar aluno</Button>
      <Modal visible={visible} onClose={handleClose} closeButton>
        <Modal.Title>
          <h3 className="text-3xl mb-8 text-sky-950 font-semibold">
            Adicionar aluno - {schoolClass?.name}
          </h3>
        </Modal.Title>
        <Modal.Body>
          <FormTextInput label="Nome do aluno" />
        </Modal.Body>
        <Modal.Actions className="grid grid-cols-1 lg:grid-rows-2 md:grid-cols-2 place-items-center">
          <Button disabled>Adicionar aluno</Button>
        </Modal.Actions>
      </Modal>
    </>
  );
}
