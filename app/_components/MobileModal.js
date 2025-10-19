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
                className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 items-center"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div
                role="dialog"
                className="animate-in fade-in zoom-in fixed left-1/2 top-1/2 z-50 w-[90%] max-w-2xl -translate-x-1/2 -translate-y-1/2 scale-100 transform rounded-2xl opacity-100 duration-300 max-h-[100dvh] overflow-y-auto  bg-white/30  transition-opacity px-4 py-4"  // ⬅️ jediné potrebné utility pre scroll
            >
                <div>{children}</div>
            </div>
        </>,
        document.body
    );
}
