"use client";

import { useState } from "react";
import { HiOutlineSun } from "react-icons/hi2"; // ikona pre dennú službu
import Modal from "../Modal";
import MobileDayShift from "./MobileDayShift";

export default function MobileTodayDayShiftButton({
  dayData,
  dateString,
  label,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="aspect-square auto-rows-[1fr] md:hidden">
      <button
        type="button"
        onClick={() => setIsModalOpen(true)} // správny handler
        className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-xl border border-primary-300 bg-white px-4 py-5 shadow-lg ring-1 ring-primary-200 active:scale-95"
      >
        <HiOutlineSun className="text-4xl text-primary-600" />
        <span className="text-sm font-semibold tracking-wide text-primary-700">
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
