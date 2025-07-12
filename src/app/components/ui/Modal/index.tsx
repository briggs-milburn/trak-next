"use client";

import React, { ReactNode, useEffect, useState } from "react";

interface ModalProps {
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export default function Modal({ onClose, title, children }: ModalProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  // Close on ESC
  useEffect(() => {
    function onKeydown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeydown);
    return () => document.removeEventListener("keydown", onKeydown);
  }, [onClose]);

  if (!show) return null;

  return (
    <div
      className="modal"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {title && (
          <h2
            id="modal-title"
            className="text-3xl font-bold mb-6 tracking-tight"
          >
            {title}
          </h2>
        )}
        {children}
        <button
          aria-label="Close modal"
          className="btn btn-ghost mt-8"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
