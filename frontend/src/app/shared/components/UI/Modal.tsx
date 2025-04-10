'use client';

import React, { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

interface ModalProps {
  children: ReactNode;       // Content inside the modal
  isOpen: boolean;           // Whether the modal is open
  onClose: () => void;       // Function to close the modal
}

const Modal = ({ children, isOpen, onClose }: ModalProps) => {
  const [mounted, setMounted] = useState(false);

  // To ensure compatibility with SSR, only render modal after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close modal on overlay click
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Avoid rendering on the server
  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleOverlayClick} // Close modal if overlay is clicked
    >
      <div
        className="bg-white rounded-xl shadow-lg w-[90%] max-w-lg" // Modal content styles
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
