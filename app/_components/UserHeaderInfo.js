import { createClient } from "@/utils/supabase/server"
import Image from "next/image"
import Logo from "./Logo"
import Link from "next/link"

export default async function UserHeaderInfo() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    console.log(user);


    const { data: profile, error } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("email", user?.email)
        .single()

    if (error) {
        console.error(error)
        throw new Error("Profily nie je možné načítať")
    }

    const email = user?.email
    const avatarUrl = profile?.avatar_url
    console.log(avatarUrl);


    return (
        <Link href="/" className="flex items-center gap-4 ">
            {avatarUrl ? (
                <Image
                    src={avatarUrl}
                    height={100}
                    width={100}
                    alt="Avatar"
                    className="hover:bg-primary-100 p-2 rounded-full active:scale-95 transition-transform duration-300 ease-in-out"
                />
            ) : <Logo />}
            <span className="text-primary-700 font-semibold rounded-md p-4 transition-transform duration-300 ease-in-out hover:bg-primary-50 active:scale-95">{email}</span>
        </Link>
    )
}
