"use client";

import {
  createContext,
  PropsWithChildren,
  SyntheticEvent,
  useContext,
  useRef,
} from "react";
import { cn } from "@/lib/utils/cn";
import { Button } from "../Button";

interface ModalProps {
  closeButton?: boolean;
  onClose?: () => void;
  dialogRef: React.RefObject<HTMLDialogElement | null>;
}


export function useDialog() {
  const ref = useRef<HTMLDialogElement | null>(null);

  return {
    dialogRef: ref,
    handleModalClose: () => ref.current?.close(),
    handleModalOpen: () => ref.current?.showModal(),
  };
}

function Modal({
  onClose,
  dialogRef,
  children,
}: PropsWithChildren<ModalProps>) {
  const handleClose = (event?: SyntheticEvent<HTMLButtonElement>) => {
    if (onClose) {
      onClose();
    }

    event?.preventDefault();
  };

  const handleESC = (event: SyntheticEvent<HTMLDialogElement, Event>) => {
    event.preventDefault();
    handleClose();
  };

  return (
    <dialog ref={dialogRef} className="modal" onCancel={handleESC}>
      <div className="modal-box bg-white max-w-sm">{children}</div>
    </dialog>
  );
}

function ModalBody({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

Modal.Body = ModalBody;

function ModalTitle({ children }: { children: React.ReactNode }) {
  return <div className="font-bold text-lg mb-2">{children}</div>;
}

Modal.Title = ModalTitle;

interface ModalActionsProps {
  inverse?: boolean;
  className?: string;
}

function ModalActions({
  children,
  inverse,
  className,
}: PropsWithChildren<ModalActionsProps>) {
  return (
    <div
      className={cn(
        "modal-action",
        inverse && "flex flex-row-reverse row-gap-2",
        className
      )}
    >
      {children}
    </div>
  );
}

Modal.Actions = ModalActions;

function ModalCloseButton({ handleClose }: { handleClose: () => void }) {
  return (
    <Button className="btn" onClick={handleClose}>
      Fechar
    </Button>
  );
}

Modal.CloseButton = ModalCloseButton;

export default Modal;
