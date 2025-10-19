"use client";

import { useState } from "react";
import { HiOutlineMoon } from "react-icons/hi2"; // 🌙 ikona pre nočnú službu
import Modal from "../Modal";
import MobileNightShift from "./MobileNightShift";

export default function MobileTodayNightShiftButton({
  dayData,
  nightData,
  dateString,
  label,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="aspect-square auto-rows-[1fr] md:hidden">
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-xl border border-primary-400 bg-primary-50 px-4 py-5 shadow-lg ring-1 ring-primary-200 active:scale-95"
      >
        <HiOutlineMoon className="text-4xl text-primary-700" />
        <span className="text-sm font-semibold tracking-wide text-primary-800">
          {label} nočná služba
        </span>
      </button>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <MobileNightShift
            dayData={dayData}
            nightData={nightData}
            dateString={dateString}
            label={label}
          />
        </Modal>
      )}
    </div>
  );
}
