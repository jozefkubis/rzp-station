import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";

export default async function UserHeaderInfo() {
  const supabase = await createClient();

  const blankAvatar =
    "https://kjfjavkvgocatxssthrv.supabase.co/storage/v1/object/public/avatars//1744906899450-avatar.png";

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("avatar_url")
    .eq("email", user?.email)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Profily nie je možné načítať");
  }

  const email = user?.email;
  const avatarUrl = profile?.avatar_url;
  console.log(avatarUrl);

  return (
    <Link href="/" className="flex items-center">
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          height={100}
          width={100}
          alt="Avatar"
          className="rounded-full p-2 transition-transform duration-300 ease-in-out hover:bg-primary-100 active:scale-95"
        />
      ) : (
        <Image
          src={blankAvatar}
          height={100}
          width={100}
          alt="AvatarImage"
          className="rounded-full p-2 transition-transform duration-300 ease-in-out hover:bg-primary-100 active:scale-95"
        />
      )}
      <span className="rounded-md p-4 font-semibold text-primary-700 transition-transform duration-300 ease-in-out hover:bg-primary-50 active:scale-95">
        {email}
      </span>
    </Link>
  );
}
