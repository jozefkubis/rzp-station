import Header from "@/app/_components/Header";
import InsertUpdateProfilesDataForm from "@/app/_components/InsertUpdateProfilesDataForm";
import SideBar from "@/app/_components/SideBar";
import { getProfilesData, getUser } from "@/app/_lib/data-service";
import { HiOutlineInformationCircle, HiOutlineLockClosed } from "react-icons/hi";


export const metadata = {
    title: "Profilové nastavenia",
};

export default async function page() {

    const navLinks = [
        { name: "Informácie", href: "/settings/profile", icon: <HiOutlineInformationCircle /> },
        { name: "Heslo", href: "/settings/user", icon: <HiOutlineLockClosed /> },
    ];

    const user = await getUser();
    const profiles = await getProfilesData(user?.email);

    return (
        <div data-cy="settings-profile-page">
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
