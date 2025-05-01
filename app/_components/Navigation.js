'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  IoChatboxOutline,
  IoDocumentsOutline,
  IoCalendarOutline,
} from 'react-icons/io5';
import { HiOutlinePhoto } from 'react-icons/hi2';
import { SlPeople } from 'react-icons/sl';
import { BsCardList } from 'react-icons/bs';
import clsx from 'clsx';
import LogOutButton from './LogOutButton';
import SettingsButton from './SettingsButton';

export default function Navigation() {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Kalendár', href: '/calendar', icon: <IoCalendarOutline /> },
    { name: 'RZP-Rajec', href: '/profiles', icon: <BsCardList /> },
    { name: 'Dokumenty', href: '/documents', icon: <IoDocumentsOutline /> },
    { name: 'Fotky', href: '/photos', icon: <HiOutlinePhoto /> },
    { name: 'Registrácia', href: '/register', icon: <SlPeople /> },
  ];

  return (
    <nav>
      <ul className="flex px-10 py-2 gap-1">
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
                  isActive && 'text-primary-900'
                )}
              >
                {icon}
                {name}
              </Link>
            </li>
          );
        })}

        <SettingsButton />
        <LogOutButton />
      </ul>
    </nav>
  );
}
