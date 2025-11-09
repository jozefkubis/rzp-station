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
      icon: (
        <PiAmbulance className="md:h-4 md:w-4 lg:h-5 lg:w-5 xl:h-7 xl:w-7" />
      ),
    },
    {
      href: "/calendar",
      label: "Kalendár",
      icon: (
        <HiOutlineCalendarDays className="md:h-4 md:w-4 lg:h-5 lg:w-5 xl:h-7 xl:w-7" />
      ),
    },
    {
      href: "/profiles",
      label: "Záchranári",
      icon: (
        <HiOutlineUsers className="md:h-4 md:w-4 lg:h-5 lg:w-5 xl:h-7 xl:w-7" />
      ),
    },
    {
      href: "/register",
      label: "Registrácia",
      icon: (
        <HiOutlineUserPlus className="md:h-4 md:w-4 lg:h-5 lg:w-5 xl:h-7 xl:w-7" />
      ),
    },
    {
      href: `/statistics?y=${statsOffset}`,
      label: "Štatistiky",
      icon: (
        <HiOutlineChartSquareBar className="md:h-4 md:w-4 lg:h-5 lg:w-5 xl:h-7 xl:w-7" />
      ),
    },
    {
      href: "/login",
      label: "Logout",
      icon: (
        <HiArrowRightOnRectangle className="md:h-4 md:w-4 lg:h-5 lg:w-5 xl:h-7 xl:w-7" />
      ),
    },
  ];

  // MARK: RENDER .......................................................................................
  return (
    <>
      {/* DESKTOP NAV */}
      <nav className="hidden gap-4 md:flex md:px-6 lg:flex-col">
        {/* Avatar */}
        <Link href="/settings/profile" aria-label="Profil">
          <div className="relative overflow-hidden rounded-full transition hover:ring-2 hover:ring-primary-300 lg:size-12 xl:size-14">
            <Image
              src={avatarUrl || BLANK_AVATAR}
              alt="Avatar"
              fill
              className="object-cover"
            />
          </div>
        </Link>

        {/* Linky */}
        {links.map(({ href, label, icon }) => (
          <li key={href}>
            <Link
              href={href}
              aria-label={label}
              data-tip={label}
              className="lx:before:text-lg relative grid place-items-center rounded-xl text-primary-200 transition before:pointer-events-none before:absolute before:left-full before:top-1/2 before:ml-1 before:-translate-y-1/2 before:whitespace-nowrap before:rounded-r-full before:bg-primary-700 before:px-4 before:py-2 before:text-primary-50 before:opacity-0 before:transition-opacity before:duration-150 before:content-[attr(data-tip)] hover:bg-primary-600/40 hover:text-primary-50 hover:before:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 active:scale-95 lg:size-10 lg:before:text-sm xl:size-12"
            >
              {icon}
            </Link>
          </li>
        ))}
      </nav>

      {/* MOBILE NAV */}
      <div className="md:hidden">
        <MobileNav shiftsOffset={shiftsOffset} statsOffset={statsOffset} />
      </div>
    </>
  );
}
