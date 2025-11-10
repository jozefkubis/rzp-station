"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { HiOutlineChartSquareBar } from "react-icons/hi";
import {
  HiArrowRightOnRectangle,
  HiOutlineCalendarDays,
  HiOutlineUserCircle,
  HiOutlineUserPlus,
  HiOutlineUsers,
} from "react-icons/hi2";
import { IoClose } from "react-icons/io5";
import { PiAmbulance } from "react-icons/pi";
import { RxHamburgerMenu } from "react-icons/rx";

export default function MobileNav({ shiftsOffset, statsOffset }) {
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

  const links = useMemo(
    () => [
      {
        href: "/settings/profile",
        label: "Môj profil",
        icon: <HiOutlineUserCircle size={28} />,
      },
      {
        href: `/shifts?m=${shiftsOffset}`,
        label: "Služby",
        icon: <PiAmbulance size={28} />,
      },
      {
        href: "/calendar",
        label: "Kalendár",
        icon: <HiOutlineCalendarDays size={28} />,
      },
      {
        href: "/profiles",
        label: "Záchranári",
        icon: <HiOutlineUsers size={28} />,
      },
      {
        href: "/register",
        label: "Registrácia",
        icon: <HiOutlineUserPlus size={28} />,
      },
      {
        href: `/statistics?y=${statsOffset}`,
        label: "Štatistiky",
        icon: <HiOutlineChartSquareBar size={28} />,
      },
      {
        href: "/login",
        label: "Logout",
        icon: <HiArrowRightOnRectangle size={28} />,
      },
    ],
    [shiftsOffset, statsOffset],
  );

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
        className={`fixed left-0 top-0 z-50 h-full max-h-[100dvh] w-60 transform overflow-y-auto bg-primary-700 p-6 shadow-xl transition-transform duration-200 ease-out ${
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
          {links.map(({ href, label, icon }) => (
            <li key={href} className="active:scale-95">
              <Link
                href={href}
                aria-label={label}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary-50"
              >
                {icon}
                <span className="text-base font-medium">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}
