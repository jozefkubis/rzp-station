"use client";

import { useState } from "react";
import { HiOutlineMoon } from "react-icons/hi2"; // 🌙 ikona pre nočnú službu
import Modal from "../Modal";
import MobileNightShift from "./MobileNightShift";

export default function MobileTmrwNightShiftButton({
  dayData,
  nightData,
  dateString,
  label,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="aspect-square auto-rows-[1fr] p-2 md:hidden">
      <button
        type="button"
        onClick={() => setIsModalOpen(true)} // správne otvára modál
        className="group flex h-full w-full flex-col items-center justify-center gap-2 rounded-2xl border border-indigo-200/70 bg-gradient-to-br from-white via-indigo-50 to-indigo-100 shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200/60 active:scale-95 active:shadow-[0_2px_6px_rgba(0,0,0,0.05)]"
      >
        <HiOutlineMoon className="text-4xl text-indigo-600 transition-transform duration-200 group-active:scale-95" />
        <span className="px-2 text-sm font-semibold tracking-wide text-indigo-700">
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
