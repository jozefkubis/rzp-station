import Link from "next/link"
import Image from "next/image"
import logo from "@/public/logo.png"
import UserWelcome from "./UserWelcome"

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-4 z-10">
      <Image
        src={logo}
        height="100"
        width="100"
        alt="RZP Logo"
        className="hover:bg-primary-100 p-2 rounded-md active:scale-95 transition-transform duration-300 ease-in-out"
      />
      <UserWelcome />
    </Link>
  )
}

export default Logo
