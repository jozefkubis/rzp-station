import { headers } from "next/headers";
import Header from "../_components/Header";
import SideBar from "../_components/SideBar";
import InsertUpdateProfilesDataForm from "../_components/InsertUpdateProfilesDataForm";
import UpdateUserDataForm from "../_components/UpdateUserDataForm";
import { getAvatarUrl, getProfilesData, getUser } from "../_lib/data-service";

export const metadata = {
  title: "Nastavenia",
};

export default async function page() {
  const headerData = headers(); // Zachytenie headers asynchrónne
  const pathname = (await headerData)?.get("x-pathname") || ""; // Použitie await a náhradnej hodnoty

  const navLinks = [
    { name: "Test-1", href: "/calendar" },
    { name: "Test-2", href: "/settings" },
    { name: "Test-3", href: "/profiles" },
    { name: "Test-4", href: "/documents" },
    { name: "Test-5", href: "/photos" },
  ];

  const user = await getUser();
  const profiles = await getProfilesData(user?.email);

  return (
    <div>
      <Header />
      <div className="h-screen grid grid-cols-[15rem_1fr]">
        <div className="border-r border-primary-200 pt-[5rem]">
          <ul className="space-y-1 px-4 text-center text-lg font-semibold text-primary-700">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              return (
                <SideBar key={link.name} link={link} isActive={isActive} />
              );
            })}
          </ul>
        </div>
        <div className="grid grid-cols-2">
          <div className="flex justify-center pt-20">
            <InsertUpdateProfilesDataForm profiles={profiles} />
          </div>
          <div className="flex justify-center pt-20">
            <UpdateUserDataForm user={user} />
          </div>
        </div>
      </div>
    </div>
  );
}
