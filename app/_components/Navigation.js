'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HiOutlineCalendarDays, HiOutlineHome, HiOutlineUserPlus, HiOutlineUsers } from 'react-icons/hi2';
import { PiAmbulance } from "react-icons/pi";
import LogOutButton from './LogOutButton';


export default function Navigation() {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Domov', href: '/', icon: <HiOutlineHome size={20} /> },
    { name: 'Kalendár', href: '/calendar', icon: <HiOutlineCalendarDays size={20} /> },
    { name: 'Služby', href: '/shifts', icon: <PiAmbulance size={20} /> },
    { name: 'Posádka', href: '/profiles', icon: <HiOutlineUsers size={20} /> },
    // { name: 'Dokumenty', href: '/documents', icon: <HiOutlineFolder size={20} /> },
    // { name: 'Fotky', href: '/photos', icon: <HiOutlinePhoto size={20} /> },
    { name: 'Registrácia', href: '/register', icon: <HiOutlineUserPlus size={20} /> },
  ];

  return (
    <nav data-cy="navigation">
      <ul className="flex px-10 py-1 gap-1">
        {navLinks.map(({ name, href, icon }) => {
          const isActive = pathname === href;

          return (
            <li
              key={href}
              className={clsx(
                'rounded-md p-4 transition-transform duration-300 ease-in-out hover:bg-primary-50 active:scale-95',
                { 'bg-primary-50': isActive }
              )}
            >
              <Link
                href={href}
                className={clsx(
                  'flex items-center gap-2 font-semibold text-primary-700',
                  isActive && 'text-primary-700'
                )}
              >
                {icon}
                {name}
              </Link>
            </li>
          );
        })}

        {/* <SettingsButton /> */}
        <LogOutButton />
      </ul>
    </nav>
  );
}
