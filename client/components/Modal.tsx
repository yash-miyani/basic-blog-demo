"use client";

import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  modelClassName?:string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  modelClassName
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      {/* Modal Card */}
      <div className={`bg-card text-text border border-border rounded-lg shadow-lg w-96 p-5 ${modelClassName}`}>
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg">{title}</h2>

          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-border transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div>{children}</div>
      </div>
    </div>
  );
}