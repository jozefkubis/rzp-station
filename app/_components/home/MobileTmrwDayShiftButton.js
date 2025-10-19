"use client";

import { useState } from "react";
import { HiOutlineSun } from "react-icons/hi2"; // ikona pre dennú službu
import Modal from "../Modal";
import MobileDayShift from "./MobileDayShift";

export default function MobileTmrwDayShiftButton({
  dayData,
  dateString,
  label,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="aspect-square auto-rows-[1fr] p-2 md:hidden">
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="group flex h-full w-full flex-col items-center justify-center gap-2 rounded-2xl border border-amber-100/70 bg-gradient-to-br from-white via-amber-50 to-amber-100 shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-200/60 active:scale-95 active:shadow-[0_2px_6px_rgba(0,0,0,0.05)]"
      >
        <HiOutlineSun className="text-4xl text-amber-500 transition-transform duration-200 group-active:scale-95" />
        <span className="px-2 text-sm font-semibold tracking-wide text-amber-700">
          {label} denná služba
        </span>
      </button>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <MobileDayShift
            dayData={dayData}
            dateString={dateString}
            label={label}
          />
        </Modal>
      )}
    </div>
  );
}
