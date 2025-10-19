"use client";

import { useState } from "react";
import { HiOutlineCalendarDays } from "react-icons/hi2";
import MobileModal from "../MobileModal";
import MobileMainTaskTmrw from "./MobileMainTaskTmrw";
import MobileMainTaskToday from "./MobileMainTaskToday";

export default function MobileMainTaskButton({
  dayData,
  dateString,
  labelToday,
  labelTmrw,
  tasks,
  dayTmrw,
  tmrwDateStr,
  tmrwTasks,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="aspect-square auto-rows-[1fr] p-2 md:hidden">
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="group flex h-full w-full flex-col items-center justify-center gap-2 rounded-2xl border border-primary-100/70 bg-gradient-to-br from-white to-primary-100 shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-200/60 active:scale-95 active:shadow-[0_2px_6px_rgba(0,0,0,0.05)]"
      >
        <HiOutlineCalendarDays className="text-4xl text-primary-600 transition-transform duration-200 group-active:scale-95" />
        <span className="px-2 text-sm font-semibold tracking-wide text-primary-700">
          Kalendár
        </span>
      </button>

      {isModalOpen && (
        <MobileModal onClose={() => setIsModalOpen(false)}>
          <div className="space-y-3">
            <MobileMainTaskToday
              dayData={dayData}
              dateString={dateString}
              label={labelToday}
              tasks={tasks}
            />
            <MobileMainTaskTmrw
              dayData={dayTmrw}
              dateString={tmrwDateStr}
              label={labelTmrw}
              tasks={tmrwTasks}
            />
          </div>
        </MobileModal>
      )}
    </div>
  );
}
