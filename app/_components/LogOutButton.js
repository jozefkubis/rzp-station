"use client";

import { HiArrowRightOnRectangle } from "react-icons/hi2";

import { useRouter } from "next/navigation";
import { logout } from "../_lib/actions";

function LogOutButton() {
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <button
      onClick={handleLogout}
      data-cy="logout-button"
      className="rounded-md p-2 text-primary-700 transition-transform duration-300 ease-in-out hover:bg-primary-50 active:scale-95"
    >
      <HiArrowRightOnRectangle size={22} />
    </button>
  );
}

export default LogOutButton;
