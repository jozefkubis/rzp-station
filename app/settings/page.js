import { headers } from "next/headers";
import Header from "../_components/Header";
import SideBar from "../_components/SideBar";
import InsertUpdateProfilesDataForm from "../_components/InsertUpdateProfilesDataForm";
import UpdateUserDataForm from "../_components/UpdateUserDataForm";

export const metadata = {
  title: "Kalendár",
};

export default async function page() {
  const headerData = headers(); // Zachytenie headers asynchrónne
  const pathname = (await headerData)?.get("x-pathname") || ""; // Použitie await a náhradnej hodnoty

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
        <div className="ml-[15rem] grid grid-cols-2">
          <div className="flex justify-center items-center pt-20">
            <InsertUpdateProfilesDataForm />
          </div>
          <div className="flex justify-center items-center pt-20">
            <UpdateUserDataForm />
          </div>
        </div>
      </div>
    </div>
  );
}
