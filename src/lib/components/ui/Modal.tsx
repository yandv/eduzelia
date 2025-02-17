"use client";

import {
  createContext,
  PropsWithChildren,
  SyntheticEvent,
  useContext,
  useEffect,
  useRef,
} from "react";
import { createPortal } from "react-dom";
import { Button } from "./Button";
import { cn } from "@/lib/utils/cn";

interface ModalProps {
  visible?: boolean;
  closeButton?: boolean;
  onClose?: () => void;
}

interface ModalContextProps {
  titleRef: React.RefObject<HTMLDivElement | null>;
  bodyRef: React.RefObject<HTMLDivElement | null>;
  actionsRef: React.RefObject<HTMLDivElement | null>;
}

const ModalContext = createContext<ModalContextProps>({
  titleRef: { current: null },
  bodyRef: { current: null },
  actionsRef: { current: null },
});

function Modal({
  visible = false,
  closeButton = false,
  onClose,
  children,
}: PropsWithChildren<ModalProps>) {
  const modalRef = useRef<HTMLDialogElement>(null);

  const titleRef = useRef<HTMLDivElement | null>(null);
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const actionsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!modalRef.current) {
      return;
    }

    if (visible) {
      modalRef.current.showModal();
    } else {
      modalRef.current.close();
    }
  }, [visible]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleESC = (event: SyntheticEvent<HTMLDialogElement, Event>) => {
    event.preventDefault();
    handleClose();
  };

  return (
    <dialog ref={modalRef} className="modal" onCancel={handleESC}>
      <div className="modal-box bg-white max-w-sm">
        <div ref={titleRef} className="font-bold text-lg mb-2" />
        <div ref={bodyRef} />
        <div className="modal-action">
          <div ref={actionsRef}>
            {closeButton && (
              <Button className="btn" onClick={handleClose}>
                Fechar
              </Button>
            )}
          </div>
        </div>
      </div>
      <ModalContext.Provider value={{ bodyRef, titleRef, actionsRef }}>
        {children}
      </ModalContext.Provider>
    </dialog>
  );
}

const useModal = () => {
  const modal = useContext(ModalContext);

  if (!modal) {
    throw new Error("useModal must be used within a ModalProvider");
  }

  return modal;
};

function ModalBody({ children }: { children: React.ReactNode }) {
  const { bodyRef: divRef } = useModal();

  if (!divRef?.current) return null;

  return createPortal(children, divRef.current);
}

Modal.Body = ModalBody;

function ModalTitle({ children }: { children: React.ReactNode }) {
  const { titleRef } = useModal();

  if (!titleRef?.current) return null;

  return createPortal(children, titleRef.current);
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
  const { actionsRef } = useModal();

  if (!actionsRef?.current) return null;

  if (inverse) {
    actionsRef.current.className = cn(
      actionsRef.current.className,
      "flex flex-row-reverse row-gap-2",
      className
    );
  }

  return createPortal(children, actionsRef.current);
}

Modal.Actions = ModalActions;

export default Modal;
