"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { HiOutlineChartSquareBar } from "react-icons/hi";
import {
  HiOutlineCalendarDays,
  HiOutlineHome,
  HiOutlineUserPlus,
  HiOutlineUsers,
} from "react-icons/hi2";
import { PiAmbulance } from "react-icons/pi";
import { RxHamburgerMenu } from "react-icons/rx";
import LogOutButton from "./LogOutButton";

export default function Navigation() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /* 1️⃣ aktuálny offset z URL (server‑safe) */
  const urlOffset = searchParams.get("m") ?? "0";
  const urlStatsOffset = searchParams.get("y") ?? "0";

  /* 2️⃣ lokálny stav, ktorý synchronizujeme s URL aj sessionStorage */
  const [dashOffset, setDashOffset] = useState(urlOffset);
  const [statsOffset, setStatsOffset] = useState(urlStatsOffset);

  /* 3️⃣ ak sa URL zmení (napr. v /​shifts), prepíš stav */
  useEffect(() => {
    setDashOffset(urlOffset);
    setStatsOffset(urlStatsOffset);
  }, [urlOffset, urlStatsOffset]);

  /* 4️⃣ pri prvej hydratácii skús vytiahnuť hodnotu zo sessionStorage */
  useEffect(() => {
    const stored = localStorage.getItem("dashOffset");
    if (stored !== null) setDashOffset(stored);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("statsOffset");
    if (stored !== null) setStatsOffset(stored);
  }, []);

  /* 5️⃣ zakaždým, keď dashOffset zmeníme, ulož ho na neskôr */
  useEffect(() => {
    localStorage.setItem("dashOffset", dashOffset);
  }, [dashOffset]);

  useEffect(() => {
    localStorage.setItem("statsOffset", statsOffset);
  }, [statsOffset]);

  const navLinks = [
    { name: "Domov", href: `/?m=${dashOffset}`, icon: <HiOutlineHome size={20} /> },
    { name: "Služby", href: `/shifts?m=${dashOffset}`, icon: <PiAmbulance size={20} /> },
    { name: "Kalendár", href: "/calendar", icon: <HiOutlineCalendarDays size={20} /> },
    { name: "Záchranári", href: "/profiles", icon: <HiOutlineUsers size={20} /> },
    { name: "Registrácia", href: "/register", icon: <HiOutlineUserPlus size={20} /> },
    { name: "Štatistiky", href: `/statistics?y=${statsOffset}`, icon: <HiOutlineChartSquareBar size={20} /> },
  ];

  return (
    <nav data-cy="navigation">
      <ul className="hidden md:flex gap-1 px-10 py-1">
        {navLinks.map(({ name, href, icon }) => {
          const isActive = pathname === href.split("?")[0];
          return (
            <li
              key={href}
              className={clsx(
                "rounded-md p-4 transition-transform duration-300 ease-in-out hover:bg-primary-50 active:scale-95",
                { "bg-primary-50": isActive },
              )}
            >
              <Link
                href={href}
                prefetch={false}
                className={clsx(
                  "flex items-center gap-2 font-semibold text-primary-700",
                  isActive && "text-primary-700",
                )}
              >
                {icon}
                {name}
              </Link>
            </li>
          );
        })}


        <LogOutButton />
      </ul>

      {/* MOBILE NAV */}
      <div className="md:hidden">
        {/* HAMBURGER tlačidlo */}
        <button
          // onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
          // aria-expanded={open}
          aria-controls="mobile-menu"
          className="inline-flex items-center justify-center rounded-xl py-2 text-primary-200 hover:bg-primary-700/30 focus:outline-none focus:ring-2 focus:ring-primary-300 md:hidden"
        >
          <RxHamburgerMenu size={28} />
        </button>

        {/* OVERLAY + PANEL */}
        {/* <div
          className={`fixed inset-0 z-50 bg-black/40 transition-opacity ${open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
            }`}
          onClick={() => setOpen(false)}
        /> */}
      </div>
    </nav>
  );
}
