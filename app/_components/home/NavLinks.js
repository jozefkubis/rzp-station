// components/NavLinks.tsx
import { getAvatarUrl, getUser } from "@/app/_lib/data-service";
import Image from "next/image";
import Link from "next/link";
import {
  HiOutlineCalendarDays,
  HiOutlineUser,
  HiOutlineUserPlus,
  HiOutlineUsers,
  HiArrowRightOnRectangle,
} from "react-icons/hi2";
import { PiAmbulance } from "react-icons/pi";

export default async function NavLinks() {
  const blankAvatar =
    "https://kjfjavkvgocatxssthrv.supabase.co/storage/v1/object/public/avatars//1744906899450-avatar.png";

  const user = await getUser();
  const email = user?.email;
  const avatarUrl = await getAvatarUrl(email);

  const links = [
    {
      href: "/shifts",
      label: "Výjazdy",
      icon: <PiAmbulance className="h-8 w-8" />,
    },
    {
      href: "/calendar",
      label: "Kalendár",
      icon: <HiOutlineCalendarDays className="h-8 w-8" />,
    },
    {
      href: "/profiles",
      label: "Profily",
      icon: <HiOutlineUsers className="h-8 w-8" />,
    },
    // {
    //   href: "/settings/profile",
    //   label: "Nastavenia",
    //   icon: <HiOutlineUser className="h-8 w-8" />,
    // },
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
    <>
      <Link href="/settings/profile">
        <div className="relative h-[55px] w-[55px] overflow-hidden rounded-full transition hover:ring-2 hover:ring-primary-300">
          <Image
            src={avatarUrl || blankAvatar}
            fill
            alt="Avatar"
            className="object-cover"
          />
        </div>
      </Link>
      {links.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            aria-label={link.label}
            className="grid place-items-center rounded-xl p-2 text-primary-200 transition hover:bg-primary-600/40 hover:text-primary-50 active:scale-95"
          >
            {link.icon}
          </Link>
        </li>
      ))}
    </>
  );
}
