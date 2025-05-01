import Header from "@/app/_components/Header";
import InsertUpdateProfilesDataForm from "@/app/_components/InsertUpdateProfilesDataForm";
import SideBar from "@/app/_components/SideBar";
import { getProfilesData, getUser } from "@/app/_lib/data-service";
import { IoPersonOutline } from "react-icons/io5";
import { RiLockPasswordLine } from "react-icons/ri";

export const metadata = {
    title: "Profilové nastavenia",
};

export default async function page() {

    const navLinks = [
        { name: "Profil", href: "/settings/profile", icon: <IoPersonOutline /> },
        { name: "Heslo", href: "/settings/user", icon: <RiLockPasswordLine /> },
    ];

    const user = await getUser();
    const profiles = await getProfilesData(user?.email);

    return (
        <div>
            <Header />
            <div className="max-h-screen">
                <SideBar navLinks={navLinks} />
                <div className="pl-[15rem] flex justify-center">
                    <InsertUpdateProfilesDataForm profiles={profiles} />
                </div>
            </div>
        </div>
    );
}
