import { useEffect } from "react";
import { createPortal } from "react-dom";
import { IoCloseOutline } from "react-icons/io5";

export default function Modal({ children, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    // 🔧 zamknutie scrollu na pozadí
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow; // vrátiť pôvodný stav
    };
  }, [onClose]);

  return createPortal(
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        role="dialog"
        className="animate-in fade-in zoom-in fixed left-1/2 top-1/2 z-50 max-h-[100dvh] w-[90%] max-w-2xl -translate-x-1/2 -translate-y-1/2 scale-100 transform overflow-y-auto rounded-2xl bg-white p-6 opacity-100 shadow-xl transition-all duration-300 sm:w-2/3 md:p-10 lg:w-[90%]" // ⬅️ jediné potrebné utility pre scroll
      >
        {/* Close Button */}
        <button
          className="right-3 top-3 hidden rounded-full p-2 text-gray-400 transition-all duration-200 hover:bg-gray-100 hover:text-gray-600 md:absolute"
          onClick={onClose}
          aria-label="Zatvoriť modal"
        >
          <IoCloseOutline className="h-6 w-6" />
        </button>

        <div>{children}</div>
      </div>
    </>,
    document.body,
  );
}
