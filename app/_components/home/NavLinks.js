import Image from "next/image";
import Link from "next/link";
import MobileNav from "./MobileNav";

import { HiOutlineChartSquareBar } from "react-icons/hi";
import {
  HiArrowRightOnRectangle,
  HiOutlineCalendarDays,
  HiOutlineUserPlus,
  HiOutlineUsers,
} from "react-icons/hi2";
import { PiAmbulance } from "react-icons/pi";

import { getAvatarUrl, getUser } from "@/app/_lib/data-service";

const BLANK_AVATAR =
  "https://kjfjavkvgocatxssthrv.supabase.co/storage/v1/object/public/avatars//1744906899450-avatar.png";

export default async function NavLinks({ searchParams }) {
  const { m, y } = await searchParams;
  const shiftsOffset = Number(m ?? 0);
  const statsOffset = Number(y ?? 0);

  const user = await getUser();
  const avatarUrl = user?.email ? await getAvatarUrl(user.email) : BLANK_AVATAR;

  const links = [
    {
      href: `/shifts?m=${shiftsOffset}`,
      label: "Služby",
      icon: <PiAmbulance className="md:h-4 md:w-4 lg:h-6 lg:w-6" />,
    },
    {
      href: "/calendar",
      label: "Kalendár",
      icon: <HiOutlineCalendarDays className="md:h-4 md:w-4 lg:h-6 lg:w-6" />,
    },
    {
      href: "/profiles",
      label: "Záchranári",
      icon: <HiOutlineUsers className="md:h-4 md:w-4 lg:h-6 lg:w-6" />,
    },
    {
      href: "/register",
      label: "Registrácia",
      icon: <HiOutlineUserPlus className="md:h-4 md:w-4 lg:h-6 lg:w-6" />,
    },
    {
      href: `/statistics?y=${statsOffset}`,
      label: "Štatistiky",
      icon: <HiOutlineChartSquareBar className="md:h-4 md:w-4 lg:h-6 lg:w-6" />,
    },
    {
      href: "/login",
      label: "Logout",
      icon: <HiArrowRightOnRectangle className="md:h-4 md:w-4 lg:h-6 lg:w-6" />,
    },
  ];

  // MARK: RENDER .......................................................................................
  return (
    <>
      {/* DESKTOP NAV */}
      <nav className="hidden items-center gap-4 md:flex lg:flex-col">
        {/* Avatar */}
        <Link href="/settings/profile" aria-label="Profil">
          <div className="relative overflow-hidden rounded-full border border-primary-100 bg-white shadow-sm transition hover:scale-[1.05] hover:shadow-md md:size-8 lg:size-12">
            <Image
              src={avatarUrl || BLANK_AVATAR}
              alt="Avatar"
              fill
              className="object-cover"
            />
          </div>
        </Link>

        {/* Linky */}
        <ul className="mt-4 flex items-center gap-3 lg:flex-col">
          {links.map(({ href, label, icon }) => (
            <li key={href}>
              <Link
                href={href}
                aria-label={label}
                data-tip={label}
                className="relative grid place-items-center rounded-xl p-2.5 text-primary-50 transition-all before:pointer-events-none before:absolute before:left-full before:top-1/2 before:ml-2 before:-translate-y-1/2 before:whitespace-nowrap before:rounded-md before:bg-primary-600 before:px-3 before:py-1 before:text-white before:opacity-0 before:transition-opacity before:duration-150 before:content-[attr(data-tip)] hover:bg-primary-50 hover:text-primary-700 hover:before:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 active:scale-95 md:before:text-base lg:size-10 lg:before:text-lg"
              >
                <span className="text-xl xl:text-2xl">{icon}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* MOBILE NAV */}
      <div className="md:hidden">
        <MobileNav shiftsOffset={shiftsOffset} statsOffset={statsOffset} />
      </div>
    </>
  );
}
