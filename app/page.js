import Link from "next/link";
import { IoChatboxOutline, IoDocumentsOutline, IoCalendarOutline } from "react-icons/io5";
import { TbPhotoSquareRounded } from "react-icons/tb";

export default function Page() {

  const navLinks = [
    {
      name: "Kalendár",
      href: "/calendar",
      icon: <IoCalendarOutline className="h-20 w-20 text-primary-700" />,
    },
    {
      name: "Debata",
      href: "/chat",
      icon: <IoChatboxOutline className="h-20 w-20 text-primary-700" />,
    },
    {
      name: "Fotky",
      href: "/photos",
      icon: <TbPhotoSquareRounded className="h-20 w-20 text-primary-700" />,
    },
    {
      name: "Dokumenty",
      href: "/documents",
      icon: <IoDocumentsOutline className="h-20 w-20 text-primary-700" />,
    },
  ]

  return (
    <nav className="h-screen flex py-20 px-40">
      <ul className="h-full w-full items-center grid grid-cols-2 gap-4 text-center">
        {navLinks.map((link) => (
          <li key={link.name}>
            <Link href={link.href} className="flex flex-col items-center text-xl text-primary-700 font-bold">
              {link.icon}
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );

}

