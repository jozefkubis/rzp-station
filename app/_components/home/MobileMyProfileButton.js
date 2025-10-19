"use client";

import { useState } from "react";
import { HiOutlineChartBar } from "react-icons/hi2"; // 📊 ikona pre štatistiky
import Modal from "../Modal";
import MobileMyProfile from "./MobileMyProfile";

export default function MobileMyProfileButton({
  shifts,
  profile,
  offset,
  goTo,
  disabled,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="aspect-square auto-rows-[1fr] md:hidden">
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-xl border border-primary-300 bg-white px-4 py-3 shadow-sm ring-1 ring-primary-200 active:scale-95"
      >
        <HiOutlineChartBar className="text-3xl text-primary-600" />
        <span className="text-sm font-semibold tracking-wide text-primary-700">
          Osobné štatistiky
        </span>
      </button>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <MobileMyProfile
            shifts={shifts}
            profile={profile}
            offset={offset}
            goTo={goTo}
            disabled={disabled}
          />
        </Modal>
      )}
    </div>
  );
}
