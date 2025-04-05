"use client"

import { HiArrowRightOnRectangle } from "react-icons/hi2";
import { logOut } from "../_lib/actions"
import { useRouter } from "next/navigation"

function LogOutButton() {
    const router = useRouter()

    async function handleLogout() {
        await logOut()
        router.push("/login")
    }

    return (
        <button onClick={handleLogout} className="text-primary-700"  >
            <HiArrowRightOnRectangle size={22} />
        </button>
    )
}

export default LogOutButton
