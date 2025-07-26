// components/NavLinks.tsx  (server component)
import Image from "next/image";
import Link from "next/link";

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
  const { m } = await searchParams;
  const shiftsOffset = Number(m ?? 0);

  /* -------- avatar fetch (server → OK) -------- */
  const user = await getUser();
  const avatarUrl = user?.email ? await getAvatarUrl(user.email) : BLANK_AVATAR;

  /* -------- definicia navigačné odkazy -------- */
  const links = [
    {
      href: `/shifts?m=${shiftsOffset}`,
      label: "Služby",
      icon: <PiAmbulance size={28} />,
    },
    {
      href: "/calendar",
      label: "Kalendár",
      icon: <HiOutlineCalendarDays size={28} />,
    },
    {
      href: "/profiles",
      label: "Záchranári",
      icon: <HiOutlineUsers size={28} />,
    },
    {
      href: "/register",
      label: "Registrácia",
      icon: <HiOutlineUserPlus size={28} />,
    },
    {
      href: "/login",
      label: "Logout",
      icon: <HiArrowRightOnRectangle size={28} />,
    },
  ];

  return (
    <>
      {/* -------- avatar -------- */}
      <Link href="/settings/profile" aria-label="Profil">
        <div className="relative size-14 overflow-hidden rounded-full transition hover:ring-2 hover:ring-primary-300">
          <Image
            src={avatarUrl || BLANK_AVATAR}
            alt="Avatar"
            fill
            className="object-cover"
          />
        </div>
      </Link>

      {/* -------- ikonové odkazy -------- */}
      {links.map(({ href, label, icon }) => (
        <li key={href}>
          <Link
            href={href}
            aria-label={label}
            data-tip={label}
            className="relative grid size-12 place-items-center rounded-xl text-primary-200 transition before:pointer-events-none before:absolute before:left-full before:top-1/2 before:ml-1 before:-translate-y-1/2 before:whitespace-nowrap before:rounded-r-full before:bg-primary-700 before:px-4 before:py-2 before:text-lg before:text-primary-50 before:opacity-0 before:transition-opacity before:duration-150 before:content-[attr(data-tip)] hover:bg-primary-600/40 hover:text-primary-50 hover:before:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 active:scale-95"
          >
            {icon}
          </Link>
        </li>
      ))}
    </>
  );
}
