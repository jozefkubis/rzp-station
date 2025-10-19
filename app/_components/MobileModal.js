import { useEffect } from "react";
import { createPortal } from "react-dom";

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
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 items-center justify-center flex"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div
                role="dialog"
                className="animate-in fade-in zoom-in fixed left-1/2 top-1/2 z-50 w-[80%] max-w-2xl -translate-x-1/2 -translate-y-1/2 scale-100 transform rounded-2xl opacity-100 transition-all duration-300 max-h-[100dvh] overflow-y-auto"  // ⬅️ jediné potrebné utility pre scroll
            >
                {/* Close Button */}
                {/* <button
                    className="absolute right-3 top-3 rounded-full p-2 text-gray-400 transition-all duration-200 hover:bg-gray-100 hover:text-gray-600"
                    onClick={onClose}
                    aria-label="Zatvoriť modal"
                >
                    <IoCloseOutline className="h-6 w-6" />
                </button> */}

                <div>{children}</div>
            </div>
        </>,
        document.body
    );
}
