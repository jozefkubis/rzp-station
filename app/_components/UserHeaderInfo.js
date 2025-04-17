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

  return (
    <div className="flex items-center gap-3">
      {/* Avatar Link */}
      <Link href="/">
        <div className="relative h-[60px] w-[60px] overflow-hidden rounded-full transition hover:ring-2 hover:ring-primary-300">
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
        <Link href="/settings">
          <div className="rounded-md px-4 py-4 font-semibold text-primary-700 transition-transform duration-300 ease-in-out hover:bg-primary-50 active:scale-95">
            {email}
          </div>
        </Link>
      </div>
    </div>
  );
}
