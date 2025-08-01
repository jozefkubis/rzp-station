"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function UserCard({ profile }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/profiles/${profile.id}`);
  };

  const blankAvatar =
    "https://kjfjavkvgocatxssthrv.supabase.co/storage/v1/object/public/avatars//1744906899450-avatar.png";

  return (
    <li
      data-cy="user-card"
      onClick={handleClick}
      className="flex cursor-pointer flex-col items-center gap-10 rounded-xl border bg-gray-50 px-8 py-12 shadow-md transition-transform duration-300 ease-in-out hover:bg-primary-50 active:scale-95 h-full"
    >
      <div className="relative h-[160px] w-[160px] overflow-hidden rounded-full border-4 border-primary-300">
        <Image
          src={profile.avatar_url || blankAvatar}
          fill
          alt="Avatar"
          className="object-cover hover:scale-110"
          data-cy="user-card-avatar"
        />
      </div>

      <div className="flex flex-col items-center text-center gap-2">
        <h1 data-cy="user-card-name" className="text-xl font-semibold text-primary-700">
          {profile.full_name}
        </h1>
        <p data-cy="user-card-email" className="text-sm text-gray-500">{profile.email}</p>
        <p data-cy="user-card-phone" className="text-sm text-gray-500">
          {profile.phone ? `Tel.: ${profile.phone}` : "-"}
        </p>
      </div>
    </li>
  );
}
