import Header from "@/app/_components/Header";
import SideBar from "@/app/_components/SideBar";
import UpdateUserDataForm from "@/app/_components/profiles/UpdateUserDataForm";
import { getUser } from "@/app/_lib/data-service";
import { HiOutlineInformationCircle, HiOutlineLockClosed } from "react-icons/hi";

export const metadata = {
    title: "Nastavenia",
};

export default async function page() {


    const navLinks = [
        { name: "Informácie", href: "/settings/profile", icon: <HiOutlineInformationCircle /> },
        { name: "Heslo", href: "/settings/user", icon: <HiOutlineLockClosed /> },
    ];

    const user = await getUser();

    return (
        <div>
            <Header />
            <div className="h-screen">
                <SideBar navLinks={navLinks} />
                <div className="pl-[13rem] flex justify-center">
                    <UpdateUserDataForm user={user} />
                </div>
            </div>
        </div>
    );
}
