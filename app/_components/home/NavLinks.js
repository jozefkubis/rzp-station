// components/NavLinks.tsx
import Link from "next/link";
import {
  HiOutlineCalendarDays,
  HiOutlineUser,
  HiOutlineUserPlus,
  HiOutlineUsers,
  HiArrowRightOnRectangle,
} from "react-icons/hi2";
import { PiAmbulance } from "react-icons/pi";

export default function NavLinks() {
  const links = [
    {
      href: "/shifts",
      label: "Výjazdy",
      icon: <PiAmbulance className="h-8 w-8" />,
    },
    {
      href: "/calendar",
      label: "Kalendár",
      icon: <HiOutlineCalendarDays className="h-8 w-8" />,
    },
    {
      href: "/profiles",
      label: "Profily",
      icon: <HiOutlineUsers className="h-8 w-8" />,
    },
    {
      href: "/settings/profile",
      label: "Nastavenia",
      icon: <HiOutlineUser className="h-8 w-8" />,
    },
    {
      href: "/register",
      label: "Registrácia",
      icon: <HiOutlineUserPlus className="h-8 w-8" />,
    },
    {
      href: "/login",
      label: "Logout",
      icon: <HiArrowRightOnRectangle className="h-8 w-8" />,
    },
  ];

  return (
    <>
      {links.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            aria-label={link.label}
            className="grid place-items-center rounded-xl p-2 text-primary-200 transition hover:bg-primary-600/40 hover:text-primary-50 active:scale-95"
          >
            {link.icon}
          </Link>
        </li>
      ))}
    </>
  );
}
