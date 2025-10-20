"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { HiOutlineChartSquareBar } from "react-icons/hi";
import {
  HiArrowRightOnRectangle,
  HiOutlineCalendarDays,
  HiOutlineHome,
  HiOutlineUserPlus,
  HiOutlineUsers,
} from "react-icons/hi2";
import { IoClose } from "react-icons/io5";
import { PiAmbulance } from "react-icons/pi";
import { RxHamburgerMenu } from "react-icons/rx";

export default function MobileHeaderNav() {
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  // 1️⃣ Offsety z URL
  const dashOffset = searchParams.get("m") ?? "0";
  const statsOffset = searchParams.get("y") ?? "0";

  // 2️⃣ Generovanie odkazov cez useMemo
  const navLinks = useMemo(
    () => [
      {
        label: "Domov",
        href: `/?m=${dashOffset}`,
        icon: <HiOutlineHome size={26} />,
      },
      {
        label: "Služby",
        href: `/shifts?m=${dashOffset}`,
        icon: <PiAmbulance size={26} />,
      },
      {
        label: "Kalendár",
        href: "/calendar",
        icon: <HiOutlineCalendarDays size={26} />,
      },
      {
        label: "Záchranári",
        href: "/profiles",
        icon: <HiOutlineUsers size={26} />,
      },
      {
        label: "Registrácia",
        href: "/register",
        icon: <HiOutlineUserPlus size={26} />,
      },
      {
        label: "Štatistiky",
        href: `/statistics?y=${statsOffset}`,
        icon: <HiOutlineChartSquareBar size={26} />,
      },
      {
        href: "/login",
        label: "Logout",
        icon: <HiArrowRightOnRectangle size={28} />,
      },
    ],
    [dashOffset, statsOffset],
  );

  // 3️⃣ UX: zavri na Escape + lock scrollu
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="flex items-center gap-3 rounded-lg px-6 py-4">
      {/* HAMBURGER tlačidlo */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Menu"
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="inline-flex items-center justify-center rounded-xl py-2 text-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-300 md:hidden"
      >
        <RxHamburgerMenu size={28} />
      </button>

      {/* OVERLAY */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-200 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* PANEL MENU */}
      <aside
        id="mobile-menu"
        className={`fixed left-0 top-0 z-50 h-full w-72 transform overflow-y-auto bg-primary-700 p-6 shadow-xl transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <span className="text-lg font-semibold text-primary-50">Menu</span>
          <button
            onClick={() => setOpen(false)}
            aria-label="Zavrieť menu"
            className="rounded-lg p-1 text-primary-200 focus-visible:ring-2 focus-visible:ring-primary-300"
          >
            <IoClose size={28} />
          </button>
        </div>

        {/* Navigačné odkazy */}
        <ul
          onClick={() => setOpen(false)} // klik na link zatvára menu
          className="flex flex-col gap-3"
        >
          {navLinks.map(({ href, label, icon }) => (
            <li key={href}>
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
    </div>
  );
}
