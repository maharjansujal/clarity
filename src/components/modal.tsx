// src/components/modal.tsx

import React from "react";

export default function Modal({
  open,
  onClose,
  children,
  title,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-999 bg-black/40 dark:bg-black/60"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="absolute rounded-lg shadow-xl flex flex-col select-none bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          maxWidth: "720px",
          maxHeight: "90vh",
        }}
      >
        {/* HEADER */}
        <div className="px-4 py-3 flex justify-between items-center rounded-t-lg">
          <h1 className="font-bold text-2xl">{title}</h1>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 text-xl cursor-pointer"
            title="close"
          >
            ✕
          </button>
        </div>

        {/* BODY */}
        <div
          className="px-4 py-4 overflow-y-auto"
          style={{ maxHeight: "calc(90vh - 70px)" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
