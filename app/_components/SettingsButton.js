"use client"

import { IoSettingsOutline } from "react-icons/io5";
import { useRouter } from "next/navigation"

function SettingsButton() {
    const router = useRouter()

    function handleClick() {
        router.push("/settings")
    }

    return (
        <button onClick={handleClick} className="text-primary-700 flex font-semibold hover:bg-primary-50 p-4 rounded-md active:scale-95 transition-transform duration-300 ease-in-out" >
            <IoSettingsOutline size={22} /> <span>Nastavenia</span>
        </button>
    )
}

export default SettingsButton
