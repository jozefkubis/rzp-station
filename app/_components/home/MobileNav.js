"use client";

import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";

export default function MobileNav({ children }) {
    const [open, setOpen] = useState(false);

    // Zavrie menu na Escape a zamkne scroll
    useEffect(() => {
        function onKey(e) {
            if (e.key === "Escape") setOpen(false);
        }
        document.addEventListener("keydown", onKey);
        document.body.style.overflow = open ? "hidden" : "";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [open]);

    return (
        <>
            {/* HAMBURGER tlačidlo */}
            <button
                onClick={() => setOpen((v) => !v)}
                aria-label="Menu"
                aria-expanded={open}
                aria-controls="mobile-menu"
                className="inline-flex items-center justify-center rounded-xl p-2 text-primary-200 hover:bg-primary-700/30 focus:outline-none focus:ring-2 focus:ring-primary-300 md:hidden"
            >
                <RxHamburgerMenu size={28} />
            </button>

            {/* OVERLAY + PANEL */}
            <div
                className={`fixed inset-0 z-50 bg-black/40 transition-opacity ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                onClick={() => setOpen(false)}
            />

            <aside
                id="mobile-menu"
                className={`fixed left-0 top-0 z-50 h-full w-72 transform bg-primary-700 p-6 shadow-xl transition-transform ${open ? "translate-x-0" : "-translate-x-full"
                    } md:hidden`}
                aria-modal="true"
                role="dialog"
            >
                {/* Header v mobile menu */}
                <div className="mb-6 flex items-center justify-between">
                    <span className="text-lg font-semibold text-primary-50">Menu</span>
                    <button
                        onClick={() => setOpen(false)}
                        aria-label="Zavrieť menu"
                        className="rounded-lg p-1 text-primary-200 hover:bg-primary-700/30"
                    >
                        <IoClose size={28} />
                    </button>
                </div>

                {/* Vložené odkazy (NavLinks) */}
                <ul
                    onClick={() => setOpen(false)} // klik na link zatvára menu
                    className="flex flex-col gap-4 overflow-y-auto"
                >
                    {children}
                </ul>
            </aside>
        </>
    );
}
