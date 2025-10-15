"use client";

import { useState } from "react";
import { HiOutlineCalendarDays } from "react-icons/hi2";
import Modal from "../Modal";
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
        <div className="md:hidden">
            <button
                type="button"
                onClick={() => setIsModalOpen(true)} // správny handler
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-primary-300 bg-white px-4 py-3 shadow-lg ring-1 ring-primary-200 active:scale-95"
            >
                <HiOutlineCalendarDays className="text-xl text-primary-600" />
                <span className="text-base font-semibold tracking-wide text-primary-700">
                    Kalendár
                </span>
            </button>

            {isModalOpen && (
                <Modal onClose={() => setIsModalOpen(false)}>
                    <div className="divide-y">
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
                </Modal>
            )}
        </div>
    );
}
