import Link from "next/link";
import {
  HiOutlineCalendarDays,
  HiOutlineUser,
  HiOutlineFolder,
  HiOutlinePhoto,
  HiOutlineUserPlus,
  HiOutlineUsers,
  HiArrowRightOnRectangle,
} from "react-icons/hi2";
import { PiAmbulance } from "react-icons/pi";

export const revalidate = 0;

export default function Page() {
  const navLinks = [
    {
      href: "/calendar",
      label: "Kalendár",
      icon: <HiOutlineCalendarDays className="h-8 w-8" />,
    },
    {
      href: "/shifts",
      label: "Výjazdy",
      icon: <PiAmbulance className="h-8 w-8" />,
    },
    {
      href: "/profiles",
      label: "Profily",
      icon: <HiOutlineUsers className="h-8 w-8" />,
    },
    {
      href: "/settings/profile",
      label: "Nastavenia",
      icon: <HiOutlineUser className="h-8 w-8" />,
    },
    {
      href: "/register",
      label: "Registrácia",
      icon: <HiOutlineUserPlus className="h-8 w-8" />,
    },
    {
      href: "/login",
      label: "Logout",
      icon: <HiArrowRightOnRectangle className="h-8 w-8" />,
    },
  ];

  return (
    <div className="grid grid-cols-[4rem_1fr] h-screen bg-gray-50">
      {/* NAVBAR */}
      <nav data-cy="home-nav" className="bg-primary-700 py-8">
        <ul className="flex flex-col items-center gap-5">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-label={link.label}
                className="grid place-items-center rounded-xl p-2 text-primary-200
                           hover:text-primary-50 hover:bg-primary-600/40
                           active:scale-95 transition"
              >
                {link.icon}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* DASHBOARD GRID */}
      <main className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 border-l border-gray-200 overflow-y-auto">
        {/* Karta: Služba */}
        <section className="rounded-2xl bg-white shadow p-4 space-y-2 w-full">
          <h2 className="text-lg font-semibold">Služba dnes</h2>
          <p className="text-sm text-gray-600">— tu pôjdu mená —</p>

          <h2 className="text-lg font-semibold pt-4">Služba zajtra</h2>
          <p className="text-sm text-gray-600">— mená zajtra —</p>
        </section>

        {/* Karta: Počasie */}
        <section className="rounded-2xl bg-white shadow p-4 w-full flex flex-col items-center justify-center">
          <span className="text-3xl">🌤️</span>
          <p className="text-4xl font-bold mt-2">26 °C</p>
          <p className="text-sm text-gray-600">Slnečno, mierny vietor</p>
        </section>

        {/* Karta: Kalendár */}
        <section className="rounded-2xl bg-white shadow p-4 space-y-2 w-full">
          <h2 className="text-lg font-semibold">Kalendár dnes</h2>
          <p className="text-sm text-gray-600">— udalosti —</p>

          <h2 className="text-lg font-semibold pt-4">Kalendár zajtra</h2>
          <p className="text-sm text-gray-600">— udalosti —</p>
        </section>

        {/* Karta: Môj profil */}
        <section className="rounded-2xl bg-white shadow p-4 space-y-2 w-full">
          <h3 className="text-lg font-semibold">Môj profil</h3>
          <p className="text-sm text-gray-600">Služby tento mesiac: 14</p>
          <p className="text-sm text-gray-600">Denné / Nočné / Hodiny / Dovolenka</p>
          <p className="text-sm text-gray-600">Lekárska, psychotesty: OK</p>
        </section>
      </main>
    </div>
  );
}
