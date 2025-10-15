"use client";

import { useState } from "react";
import { HiOutlineSun } from "react-icons/hi2"; // ikona pre dennú službu
import Modal from "../Modal";
import MobileDayShift from "./MobileDayShift";

export default function MobileTodayDayShiftButton({ dayData, dateString, label }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="md:hidden">
            <button
                type="button"
                onClick={() => setIsModalOpen(true)} // správny handler
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-primary-300 bg-white px-4 py-3 shadow-sm ring-1 ring-primary-200 active:scale-95"
            >
                <HiOutlineSun className="text-xl text-primary-600" />
                <span className="text-base font-semibold text-primary-700 tracking-wide">
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
