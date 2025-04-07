"use client"

import { IoSettingsOutline } from "react-icons/io5";
import { useRouter } from "next/navigation"

function SettingsButton() {
    const router = useRouter()

    function handleClick() {
        router.push("/settings")
    }

    return (
        <button onClick={handleClick} className="text-primary-700 flex gap-2 font-semibold"  >
            <IoSettingsOutline size={22} /> <span>Nastavenia</span>
        </button>
    )
}

export default SettingsButton
