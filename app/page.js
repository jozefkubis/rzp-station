import Link from "next/link";

import { HiOutlineCalendarDays, HiOutlineUser, HiOutlineFolder, HiOutlinePhoto, HiOutlineUserPlus, HiOutlineUsers } from 'react-icons/hi2';


export const revalidate = 0;

export default function Page() {
  const navLinks = [
    {
      name: "Kalendár",
      href: "/calendar",
      icon: <HiOutlineCalendarDays className="h-20 w-20 text-primary-700" />,
    },
    {
      name: "Posádka",
      href: "/profiles",
      icon: <HiOutlineUsers className="h-20 w-20 text-primary-700" />,
    },
    // {
    //   name: "Fotky",
    //   href: "/photos",
    //   icon: <HiOutlinePhoto className="h-20 w-20 text-primary-700" />,
    // },
    // {
    //   name: "Dokumenty",
    //   href: "/documents",
    //   icon: <HiOutlineFolder className="h-20 w-20 text-primary-700" />,
    // },
    {
      name: "Profil",
      href: "/settings/profile",
      icon: <HiOutlineUser className="h-20 w-20 text-primary-700" />,
    },
    {
      name: "Registrácia",
      href: "/register",
      icon: <HiOutlineUserPlus className="h-20 w-20 text-primary-700" />,
    },
  ];

  return (
    <nav data-cy="home-nav" className="flex h-screen bg-gray-50 px-40 py-20">
      <ul className="grid h-full w-full grid-cols-3 items-center gap-4 text-center">
        {navLinks.map((link) => (
          <li key={link.name}>
            <Link
              href={link.href}
              className="mx-auto flex w-1/3 flex-col items-center rounded-md p-2 text-xl font-bold text-primary-700 transition-transform duration-300 ease-in-out hover:bg-primary-100 active:scale-95"
            >
              {link.icon}
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
