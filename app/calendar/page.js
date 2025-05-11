import Calendar from "../_components/Calendar";
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
      <main className="h-screen">
        <SideBar navLinks={navLinks} />
        <div className="w-full py-10 px-10 pl-[15rem]">
          <Calendar />
        </div>
      </main>
    </div>
  );
}
