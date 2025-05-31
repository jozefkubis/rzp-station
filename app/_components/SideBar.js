'use client';

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideBar({ navLinks }) {
  const pathname = usePathname();

  return (
    <div data-cy="sidebar" className="fixed left-0 top-0 h-screen w-[13rem] border-r border-primary-200 pt-[10rem] flex justify-center">
      <div className="w-full px-3">
        <ul className="text-md font-semibold text-primary-700 space-y-2">
          {navLinks.map((link) => {
            const { href, name, icon } = link;
            const isActive = pathname === href;

            return (
              <li
                key={href}
                className={clsx(
                  "rounded-md p-3 transition-transform duration-300 ease-in-out hover:bg-primary-50 active:scale-95",
                  { "bg-primary-50": isActive }
                )}
              >
                <Link data-cy="sidebar-link" href={href} className="flex items-center justify-start gap-3">
                  <span>{icon}</span>
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
