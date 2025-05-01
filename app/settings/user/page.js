import Header from "@/app/_components/Header";
import SideBar from "@/app/_components/SideBar";
import UpdateUserDataForm from "@/app/_components/UpdateUserDataForm";
import { getUser } from "@/app/_lib/data-service";
import { IoPersonOutline } from "react-icons/io5";
import { RiLockPasswordLine } from "react-icons/ri";

export const metadata = {
    title: "Nastavenia",
};

export default async function page() {


    const navLinks = [
        { name: "Profil", href: "/settings/profile", icon: <IoPersonOutline /> },
        { name: "Heslo", href: "/settings/user", icon: <RiLockPasswordLine /> },
    ];

    const user = await getUser();

    return (
        <div>
            <Header />
            <div className="h-screen">
                <SideBar navLinks={navLinks} />
                <div className="pl-[15rem] flex justify-center">
                    <UpdateUserDataForm user={user} />
                </div>
            </div>
        </div>
    );
}
