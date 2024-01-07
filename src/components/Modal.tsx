import { ReactNode, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type ModalProps = {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
};

export default function Modal({ children, isOpen, onClose }: ModalProps) {
  const [isClosing, setIsClosing] = useState(false);
  const isPrevOpen = useRef<boolean>();

  useLayoutEffect(() => {
    if (isPrevOpen.current && !isOpen) {
      setIsClosing(true);
    }

    isPrevOpen.current = isOpen;
  }, [isOpen]);

  if (!isOpen && !isClosing) return null;

  return createPortal(
    <div
      className={`modal ${isClosing && "closing"}`}
      onAnimationEnd={() => setIsClosing(false)}
    >
      <div className="overlay" onClick={onClose}></div>
      <div className="modal-body">{children}</div>
    </div>,
    document.querySelector("#modal-container") as HTMLElement
  );
}
