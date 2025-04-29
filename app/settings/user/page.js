import { headers } from "next/headers";
import SideBar from "@/app/_components/SideBar";
import Header from "@/app/_components/Header";
import { getProfilesData, getUser } from "@/app/_lib/data-service";
import UpdateUserDataForm from "@/app/_components/UpdateUserDataForm";

export const metadata = {
    title: "Nastavenia",
};

export default async function page() {
    const headerData = headers(); // Zachytenie headers asynchrónne
    const pathname = (await headerData)?.get("x-pathname") || ""; // Použitie await a náhradnej hodnoty

    const navLinks = [
        { name: "Profil", href: "/settings/profile" },
        { name: "Užívateľ", href: "/settings/user" },
    ];

    const user = await getUser();
    const profiles = await getProfilesData(user?.email);

    return (
        <div>
            <Header />
            <div className="h-screen">
                <div className="fixed left-0 top-0 h-screen w-[15rem] border-r border-primary-200 pt-[10rem]">
                    <ul className="space-y-1 px-4 text-center text-lg font-semibold text-primary-700">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;

                            return (
                                <SideBar key={link.name} link={link} isActive={isActive} />
                            );
                        })}
                    </ul>
                </div>
                <div className="pl-[15rem] flex justify-center">
                    <UpdateUserDataForm user={user} />
                </div>
            </div>
        </div>
    );
}
