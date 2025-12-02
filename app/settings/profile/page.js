import Header from "@/app/_components/Header";
import InsertUpdateProfilesDataForm from "@/app/_components/profiles/InsertUpdateProfilesDataForm";
import SideBar from "@/app/_components/SideBar";
import { getProfilesData, getUser } from "@/app/_lib/profiles-data";
import {
  HiOutlineInformationCircle,
  HiOutlineLockClosed,
} from "react-icons/hi";

export const metadata = {
  title: "Profilové nastavenia",
};

export default async function page() {
  const navLinks = [
    {
      name: "Informácie",
      href: "/settings/profile",
      icon: <HiOutlineInformationCircle />,
    },
    { name: "Heslo", href: "/settings/user", icon: <HiOutlineLockClosed /> },
  ];

  const user = await getUser();
  const profiles = await getProfilesData(user?.email);

  return (
    <div>
      <Header />
      <div
        className="max-h-screen-md flex flex-col"
      >
        <SideBar navLinks={navLinks} />
        <div className="max-h-screen-md flex justify-center overflow-auto itmes-center md:pl-[11rem] lg:pl-[13rem]">
          <InsertUpdateProfilesDataForm profiles={profiles} />
        </div>
      </div>
    </div>
  );
}
