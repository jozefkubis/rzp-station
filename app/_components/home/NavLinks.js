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

export default async function NavLinks() {
  /* -------- avatar fetch (server → OK) -------- */
  const user = await getUser();
  const avatarUrl = user?.email ? await getAvatarUrl(user.email) : BLANK_AVATAR;

  /* -------- definuj navigačné odkazy -------- */
  const links = [
    { href: "/shifts", label: "Výjazdy", icon: <PiAmbulance size={28} /> },
    {
      href: "/calendar",
      label: "Kalendár",
      icon: <HiOutlineCalendarDays size={28} />,
    },
    { href: "/profiles", label: "Profily", icon: <HiOutlineUsers size={28} /> },
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
            className="grid size-12 place-items-center rounded-xl text-primary-200 transition hover:bg-primary-600/40 hover:text-primary-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 active:scale-95"
          >
            {icon}
          </Link>
        </li>
      ))}
    </>
  );
}
