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
        className="relative bg-background rounded-lg shadow-lg w-full max-w-xl mx-4 p-4 max-h-[95vh] border-[1px] border-foreground"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 w-full flex justify-end" onClick={onClose}>
          <div className="text-accent cursor-pointer hover:bg-backgroundSecondary hover:text-accentSecondary  rounded-full p-[2px]">
            <span className="sr-only">Close modal</span>
            <MdClose size={14} />
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
