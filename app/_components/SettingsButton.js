"use client"

import { IoSettingsOutline } from "react-icons/io5";
import { usePathname, useRouter } from "next/navigation"
import clsx from "clsx";

function SettingsButton() {
    const router = useRouter()
    const pathname = usePathname()
    const isActive = pathname === "/settings";

    function handleClick() {
        router.push("/settings")
    }

    return (
        <button onClick={handleClick} className={clsx(`text-primary-700 flex font-semibold hover:bg-primary-50 p-4 rounded-md active:scale-95 transition-transform duration-300 ease-in-out gap-2`, { 'bg-primary-50': isActive })} >
            <IoSettingsOutline size={22} /> <span>Nastavenia</span>
        </button>
    )
}

export default SettingsButton
