"use client"

import { HiArrowRightOnRectangle } from "react-icons/hi2";

import { useRouter } from "next/navigation"
import { logout } from "../_lib/actions";

function LogOutButton() {
    const router = useRouter()

    async function handleLogout() {
        await logout()
        router.push("/login")
    }

    return (
        <button onClick={handleLogout} className="text-primary-700 hover:bg-primary-50 p-2 rounded-md active:scale-95 transition-transform duration-300 ease-in-out"  >
            <HiArrowRightOnRectangle size={22} />
        </button>
    )
}

export default LogOutButton
