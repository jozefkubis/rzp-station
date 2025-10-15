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
        <div className="md:hidden">
            <button
                type="button"
                onClick={() => setIsModalOpen(true)} // správne otvára modál
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-primary-400 bg-primary-50 px-4 py-3 shadow-sm ring-1 ring-primary-200 active:scale-95"
            >
                <HiOutlineMoon className="text-xl text-primary-700" />
                <span className="text-base font-semibold text-primary-800 tracking-wide">
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
