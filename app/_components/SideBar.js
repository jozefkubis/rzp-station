'use client';

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideBar({ navLinks }) {
  const pathname = usePathname();

  return (
    <div
      data-cy="sidebar"
      className="
        flex justify-center
        md:fixed md:left-0 md:top-0 md:h-screen md:w-[13rem]
        md:border-r md:border-primary-200 py-2 md:pt-[10rem]
        text-primary-600
        md:bg-transparent md:text-primary-700
        transition-colors duration-300
      "
    >
      <div className="w-full px-2">
        <ul className="text-md font-semibold space-y-2">
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
                  "shadow-lg",
                  {
                    "bg-primary-800 text-white md:bg-primary-50 md:text-primary-700 border border-primary-800/70 shadow-lg": isActive,
                  }
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
