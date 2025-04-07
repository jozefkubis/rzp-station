import Link from "next/link";
import { IoChatboxOutline, IoDocumentsOutline, IoCalendarOutline } from "react-icons/io5";
import { TbPhotoSquareRounded, TbMedicalCross } from "react-icons/tb";
import LogOutButton from "./LogOutButton";
import SettingsButton from "./SettingsButton";

export default function Navigation() {

    const navLinks = [
        // {
        //     name: "Domov",
        //     href: "/",
        //     icon: <TbMedicalCross className="h-5 w-5 text-primary-700" />,
        // },
        {
            name: "Kalendár",
            href: "/calendar",
            icon: <IoCalendarOutline className="h-5 w-5 text-primary-700" />,
        },
        {
            name: "Fotky",
            href: "/photos",
            icon: <TbPhotoSquareRounded className="h-5 w-5 text-primary-700" />,
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
    ]

    return (
        <>
            <nav className="">
                <ul className="flex gap-10 py-2 px-10">
                    {navLinks.map((link) => (
                        <li key={link.name}>
                            <Link href={link.href} className="flex items-center gap-2 text-primary-700 font-semibold">
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

