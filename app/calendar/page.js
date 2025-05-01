import Header from "../_components/Header";
import SideBar from "../_components/SideBar";

export const metadata = {
  title: "Kalendár",
};

export default async function page() {

  const navLinks = [
    { name: "Test-1", href: "/calendar" },
    { name: "Test-2", href: "/settings" },
    { name: "Test-3", href: "/profiles" },
    { name: "Test-4", href: "/documents" },
    { name: "Test-5", href: "/photos" },
  ];

  return (
    <div>
      <Header />
      <div className="h-screen">
        <SideBar navLinks={navLinks} />
        <div className="flex h-full items-center justify-center pl-[15rem]">
          <h1 className="text-8xl font-bold text-primary-700">Kalendár</h1>
        </div>
      </div>
    </div>
  );
}
