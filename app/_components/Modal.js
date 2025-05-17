import { createPortal } from "react-dom";
import { useEffect } from "react";
import { IoCloseOutline } from "react-icons/io5";

export default function Modal({ children, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return createPortal(
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-primary-400 bg-opacity-50 backdrop-blur-sm transition-all duration-500"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div
        role="dialog"
        className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-white p-10 shadow-lg transition-all duration-500 w-1/2 max-w-2xl"
      >
        {/* Close Button */}
        <button
          className="absolute right-1 top-1 p-2 transition-all duration-200 hover:bg-gray-200 rounded-full"
          onClick={onClose}
          aria-label="Zatvoriť modal"
        >
          <IoCloseOutline className="text-primary-200 h-6 w-6" />
        </button>
        <div>{children}</div>
      </div>
    </>,
    document.body,
  );
}
