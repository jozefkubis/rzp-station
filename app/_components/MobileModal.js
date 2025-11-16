import { useEffect } from "react";
import { createPortal } from "react-dom";
import { IoCloseOutline } from "react-icons/io5";

export default function MobileModal({ children, onClose }) {
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
    <div className="relative">
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 items-center bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        role="dialog"
        className="animate-in fade-in zoom-in fixed left-1/2 top-1/2 z-50 max-h-[98dvh] w-[90%] max-w-2xl -translate-x-1/2 -translate-y-1/2 scale-100 transform overflow-y-auto rounded-2xl bg-white/30 px-5 py-5 opacity-100 transition-opacity duration-300 sm:w-1/2" // ⬅️ jediné potrebné utility pre scroll
      >
        <button
          className="roundedr-full absolute right-0 top-0 p-1 font-bold text-white opacity-60 transition-all duration-200 hover:bg-gray-100 hover:text-gray-600"
          onClick={onClose}
          aria-label="Zatvoriť modal"
        >
          <IoCloseOutline className="h-6 w-6" />
        </button>
        <div>{children}</div>
      </div>
    </div>,
    document.body,
  );
}
