"use client";

import { createSchoolClass } from "@/lib/actions/create-school-class.action";
import { Button } from "@/lib/components/ui/Button";
import { useActionState, useState } from "react";
import FormErrorMessage from "@/lib/components/ui/form/FormErrorMessage";
import FormFieldErrorMessage from "@/lib/components/ui/form/FormFieldErrorMessage";
import FormTextInput from "@/lib/components/ui/form/FormTextInput";
import Modal, { useDialog } from "@/lib/components/ui/modal/Modal";

interface CreateSchoolClassProps {
  subjectId: string;
}

export function CreateSchoolClass({ subjectId }: CreateSchoolClassProps) {
  const { dialogRef } = useDialog();
  const [formState, action, isPending] = useActionState(
    createSchoolClass,
    undefined
  );

  const handleSubmit = (payload: FormData) => {
    dialogRef?.current?.close();
    action(payload);
  };

  const handleToggle = () => dialogRef?.current?.showModal();

  const handleClose = () => {
    dialogRef?.current?.close();
  };

  return (
    <>
      <Button onClick={handleToggle}>Criar turma</Button>
      <form action={handleSubmit}>
        <Modal dialogRef={dialogRef} onClose={handleClose}>
          <Modal.Title>Criar turma</Modal.Title>
          <Modal.Body>
            <div className="flex flex-col justify-center items-center">
              <div
                id="cardBody"
                className="card-body  items-center text-center"
              >
                <FormTextInput
                  id="name"
                  name="name"
                  label="Nome da turma"
                  placeholder="Nome da turma"
                  aria-describedby="name-error"
                  htmlFor="name"
                />
                <FormFieldErrorMessage fieldName="name" formState={formState} />

                <FormTextInput
                  id="year"
                  name="year"
                  type="number"
                  label="Ano da turma"
                  placeholder="Ano da turma"
                  aria-describedby="password-error"
                  htmlFor="password"
                  className="mt-4"
                  defaultValue={new Date().getFullYear()}
                />
                <FormFieldErrorMessage fieldName="year" formState={formState} />

                <FormTextInput
                  id="subjectId"
                  name="subjectId"
                  type="hidden"
                  value={subjectId}
                />

                <FormErrorMessage formState={formState} />
              </div>
            </div>
          </Modal.Body>
          <Modal.Actions inverse>
            <Button disabled={isPending} type="submit">
              {isPending ? (
                <span className="loading loading-spinner bg-sky-950 loading-xs" />
              ) : (
                "Criar turma"
              )}
            </Button>
          </Modal.Actions>
        </Modal>
      </form>
    </>
  );
}
