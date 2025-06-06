import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";
import { getAvatarUrl, getUser, getUsername } from "@/app/_lib/data-service";
import { HiOutlineUser } from "react-icons/hi";


export default async function UserHeaderInfo() {
  const supabase = await createClient();

  const blankAvatar =
    "https://kjfjavkvgocatxssthrv.supabase.co/storage/v1/object/public/avatars//1744906899450-avatar.png";

  const user = await getUser();
  const email = user?.email;
  const avatarUrl = await getAvatarUrl(email);
  const username = await getUsername(email);

  return (
    <div className="flex items-center gap-3">
      {/* Avatar Link */}
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

      {/* Email Link */}
      <div>
        <Link href="/settings/profile">
          <div className="flex items-center gap-2 rounded-md px-4 py-4 font-semibold text-primary-700 transition-transform duration-300 ease-in-out hover:bg-primary-50 active:scale-95">
            <HiOutlineUser size={20} />{username || email}
          </div>
        </Link>
      </div>
    </div>
  );
}
