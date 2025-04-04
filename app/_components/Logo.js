import Link from "next/link"
import Image from "next/image"
import logo from "@/public/logo.png"

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-4 z-10">
      <Image
        src={logo}
        height="100"
        width="100"
        alt="RZP Logo"
        className="rounded-md"
      />
    </Link>
  )
}

export default Logo
