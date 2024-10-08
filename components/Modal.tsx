import React, { ReactNode, useEffect } from 'react';
import { MdClose } from 'react-icons/md';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, children }: Props) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="relative bg-background rounded-lg shadow-lg w-full max-w-xl mx-4 p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-accent hover:bg-backgroundLight rounded-full p-[2px]"
          onClick={onClose}
        >
          <span className="sr-only">Close modal</span>
          <MdClose size={14} />
        </button>
        {children}
      </div>
    </div>
  );
}
