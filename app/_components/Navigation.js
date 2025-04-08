import Link from "next/link";
import {
  IoChatboxOutline,
  IoDocumentsOutline,
  IoCalendarOutline,
} from "react-icons/io5";
import { HiOutlinePhoto } from "react-icons/hi2";
import LogOutButton from "./LogOutButton";
import SettingsButton from "./SettingsButton";

export default function Navigation() {
  const navLinks = [
    {
      name: "Kalendár",
      href: "/calendar",
      icon: <IoCalendarOutline className="h-5 w-5 text-primary-700" />,
    },
    {
      name: "Fotky",
      href: "/photos",
      icon: <HiOutlinePhoto className="h-5 w-5 text-primary-700" />,
    },
    {
      name: "Dokumenty",
      href: "/documents",
      icon: <IoDocumentsOutline className="h-5 w-5 text-primary-700" />,
    },
    {
      name: "Debata",
      href: "/chat",
      icon: <IoChatboxOutline className="h-5 w-5 text-primary-700" />,
    },
  ];

  return (
    <>
      <nav className="">
        <ul className="flex gap-10 px-10 py-2">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                className="flex items-center gap-2 font-semibold text-primary-700"
              >
                {link.icon}
                {link.name}
              </Link>
            </li>
          ))}
          <SettingsButton />
          <LogOutButton />
        </ul>
      </nav>
    </>
  );
}
