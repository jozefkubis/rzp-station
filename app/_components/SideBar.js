"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideBar({ navLinks }) {
  const pathname = usePathname();

  return (
    <div
      data-cy="sidebar"
      className="flex justify-center py-2 text-primary-600 transition-colors duration-300 md:fixed md:left-0 md:top-0 md:h-screen md:w-[11rem] 2xl:w-[13rem] md:border-r md:border-primary-200 md:bg-transparent md:pt-[10rem] md:text-primary-700"
    >
      <div className="w-full px-6 md:px-2">
        <ul className="lg:text-sm 2xl:text-lg space-y-2 font-semibold">
          {navLinks.map(({ href, name, icon }) => {
            const isActive = pathname === href;

            return (
              <li
                key={href}
                className={clsx(
                  // mobil: tmavšie pozadie + svetlé písmo
                  "rounded-md p-3 transition-all duration-300 ease-in-out",
                  "active:scale-95",
                  "md:hover:bg-primary-50 md:active:scale-95",
                  "border border-primary-100/70",
                  "shadow-lg md:shadow-sm",
                  {
                    "border border-primary-800/70 bg-primary-800 text-white shadow-lg md:border-none md:bg-primary-50 md:text-primary-700 md:shadow-sm":
                      isActive,
                  },
                )}
              >
                <Link
                  data-cy="sidebar-link"
                  href={href}
                  className="flex items-center justify-start gap-3"
                >
                  <span className="text-lg">{icon}</span>
                  <span>{name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
