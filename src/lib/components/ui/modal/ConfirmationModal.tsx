"use client";

import { Button } from "../Button";
import Modal from "./Modal";

interface ConfirmationModalProps {
  dialogRef: React.RefObject<HTMLDialogElement | null>;

  title?: string;
  description?: string;

  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ConfirmationModal({
  dialogRef,
  title,
  description,
  onSuccess,
  onCancel,
}: ConfirmationModalProps) {
  const handleSuccess = () => {
    dialogRef.current?.close();
    onSuccess?.();
  };

  const handleCancel = () => {
    dialogRef.current?.close();
    onCancel?.();
  };

  return (
    <Modal dialogRef={dialogRef} onClose={handleCancel}>
      <Modal.Title>{title ?? "Confirmação"}</Modal.Title>
      <Modal.Body>
        <p>{description ?? "Tem certeza que deseja continuar?"}</p>
      </Modal.Body>
      <Modal.Actions>
        <Button onClick={handleSuccess}>Sim</Button>
        <Button onClick={handleCancel}>Não</Button>
      </Modal.Actions>
    </Modal>
  );
}
