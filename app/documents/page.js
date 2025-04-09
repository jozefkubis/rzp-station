import Link from "next/link"
import Header from "../_components/Header"
import clsx from "clsx"
import { headers } from 'next/headers';

export const metadata = {
    title: "Kalendár",
}

export default async function page() {
    const headerData = headers(); // Zachytenie headers asynchrónne
    const pathname = (await headerData)?.get('x-pathname') || ''; // Použitie await a náhradnej hodnoty

    const navLinks = [
        { name: "Test-1", href: "/calendar" },
        { name: "Test-2", href: "/settings" },
        { name: "Test-3", href: "/chat" },
        { name: "Test-4", href: "/documents" },
        { name: "Test-5", href: "/photos" },
    ];

    return (
        <div>
            <Header />
            <div className="h-screen">
                <div className="border-r border-primary-200 fixed left-0 top-0 h-screen w-[15rem] pt-[10rem]">
                    <ul className="space-y-1 text-primary-700 font-semibold text-lg text-center px-4">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;

                            return (
                                <li
                                    key={link.name}
                                    className={clsx(
                                        'hover:bg-primary-50 p-3 rounded-md active:scale-95 transition-transform duration-300 ease-in-out',
                                        { 'bg-primary-50': isActive }
                                    )}
                                >
                                    <Link href={link.href} className="block w-full h-full">
                                        {link.name}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <div className="flex items-center justify-center pl-[15rem] h-full">
                    <h1 className="text-8xl text-primary-700 font-bold">Dokumenty</h1>
                </div>
            </div>
        </div>
    );
}

