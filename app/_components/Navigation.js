import Link from "next/link";
import {
  IoChatboxOutline,
  IoDocumentsOutline,
  IoCalendarOutline,
} from "react-icons/io5";
import { HiOutlinePhoto } from "react-icons/hi2";
import LogOutButton from "./LogOutButton";
import SettingsButton from "./SettingsButton";
import clsx from "clsx";
import { headers } from "next/headers";
import { SlPeople } from "react-icons/sl";
import { BsCardList } from "react-icons/bs";



export default async function Navigation() {
  const headerData = headers(); // Zachytenie headers asynchrónne
  const pathname = (await headerData)?.get('x-pathname') || ''; // Použitie await a náhradnej hodnoty

  const navLinks = [
    {
      name: "Kalendár",
      href: "/calendar",
      icon: <IoCalendarOutline className="h-5 w-5 text-primary-700" />,
    },
    {
      name: "RZP-Rajec",
      href: "/profiles",
      icon: <BsCardList className="h-5 w-5 text-primary-700" />,
    },
    {
      name: "Dokumenty",
      href: "/documents",
      icon: <IoDocumentsOutline className="h-5 w-5 text-primary-700" />,
    },
    {
      name: "Fotky",
      href: "/photos",
      icon: <HiOutlinePhoto className="h-5 w-5 text-primary-700" />,
    },
    {
      name: "Registrácia",
      href: "/register",
      icon: <SlPeople className="h-5 w-5 text-primary-700" />,
    },
  ];

  return (
    <>
      <nav className="">
        <ul className="flex px-10 py-2 gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <li
                key={link.name}
                className={clsx(`rounded-md p-4 transition-transform duration-300 ease-in-out hover:bg-primary-50 active:scale-95`,
                  { 'bg-primary-50': isActive }
                )}
              >
                <Link
                  href={link.href}
                  className="flex items-center gap-2 font-semibold text-primary-700"
                >
                  {link.icon}
                  {link.name}
                </Link>
              </li>
            )
          })}
          <SettingsButton />
          <LogOutButton />
        </ul>
      </nav>
    </>
  );
}
