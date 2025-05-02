import Header from "@/app/_components/Header";
import InsertUpdateProfilesDataForm from "@/app/_components/InsertUpdateProfilesDataForm";
import SideBar from "@/app/_components/SideBar";
import { getProfilesData, getUser } from "@/app/_lib/data-service";
import { HiOutlineLockClosed, HiOutlineUser } from "react-icons/hi";


export const metadata = {
    title: "Profilové nastavenia",
};

export default async function page() {

    const navLinks = [
        { name: "Profil", href: "/settings/profile", icon: <HiOutlineUser /> },
        { name: "Heslo", href: "/settings/user", icon: <HiOutlineLockClosed /> },
    ];

    const user = await getUser();
    const profiles = await getProfilesData(user?.email);

    return (
        <div>
            <Header />
            <div className="max-h-screen">
                <SideBar navLinks={navLinks} />
                <div className="pl-[13rem] flex justify-center">
                    <InsertUpdateProfilesDataForm profiles={profiles} />
                </div>
            </div>
        </div>
    );
}
