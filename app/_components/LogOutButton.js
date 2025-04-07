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
        <button onClick={handleLogout} className="text-primary-700"  >
            <HiArrowRightOnRectangle size={22} />
        </button>
    )
}

export default LogOutButton
