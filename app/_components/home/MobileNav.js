"use client";

import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";

export default function MobileNav({ children }) {
  const [open, setOpen] = useState(false);

  // Zavrie menu na Escape + lock scrollu (bez ďalších helperov)
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
      {/* HAMBURGER */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Menu"
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="inline-flex items-center justify-center rounded-xl p-2 text-primary-200 outline-none focus-visible:ring-2 focus-visible:ring-primary-300 md:hidden"
      >
        <RxHamburgerMenu size={28} />
      </button>

      {/* OVERLAY */}
      <div
        onClick={() => setOpen(false)}
        aria-hidden={!open}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px] transition-opacity duration-200 ease-out ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* PANEL */}
      <aside
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        className={`fixed left-0 top-0 z-50 h-full max-h-[100dvh] w-72 transform overflow-y-auto bg-primary-700 p-6 shadow-xl transition-transform duration-200 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <span className="text-lg font-semibold text-primary-50">Menu</span>
          <button
            onClick={() => setOpen(false)}
            aria-label="Zavrieť menu"
            className="rounded-lg p-2 text-primary-200 focus-visible:ring-2 focus-visible:ring-primary-300"
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Odkazy */}
        <ul
          onClick={() => setOpen(false)} // klik na link zatvára menu
          className="flex flex-col gap-3 overflow-y-auto"
        >
          {children}
        </ul>
      </aside>
    </>
  );
}
