import Link from "next/link";
import {
  IoChatboxOutline,
  IoDocumentsOutline,
  IoCalendarOutline,
  IoSettingsOutline,
} from "react-icons/io5";
import { HiOutlinePhoto } from "react-icons/hi2";
import { GiSkullWithSyringe } from "react-icons/gi";

export default function Page() {
  const navLinks = [
    {
      name: "Kalendár",
      href: "/calendar",
      icon: (
        <IoCalendarOutline className="h-20 w-20 text-primary-700" />
      ),
    }
    ,
    {
      name: "Fotky",
      href: "/photos",
      icon: (
        <HiOutlinePhoto className="h-20 w-20 text-primary-700" />
      ),
    },
    {
      name: "Dokumenty",
      href: "/documents",
      icon: (
        <IoDocumentsOutline className="h-20 w-20 text-primary-700" />
      ),
    },
    {
      name: "Debata",
      href: "/chat",
      icon: (
        <IoChatboxOutline className="h-20 w-20 text-primary-700" />
      ),
    },
    {
      name: "Nastavenia",
      href: "/settings",
      icon: (
        <IoSettingsOutline className="h-20 w-20 text-primary-700" />
      ),
    },
    {
      name: "Registrácia",
      href: "/register",
      icon: (
        <GiSkullWithSyringe className="h-20 w-20 text-primary-700" />
      ),
    },
  ];

  return (
    <nav className="flex h-screen px-40 py-20 bg-gray-50">
      <ul className="grid h-full w-full grid-cols-3 items-center gap-4 text-center">
        {navLinks.map((link) => (
          <li key={link.name}>
            <Link
              href={link.href}
              className="flex flex-col w-1/3 mx-auto items-center text-xl font-bold text-primary-700 hover:bg-primary-100 p-2 rounded-md active:scale-95 transition-transform duration-300 ease-in-out"
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
