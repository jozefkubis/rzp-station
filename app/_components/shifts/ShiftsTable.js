"use client";

import { getDaysArray } from "./helpers_shifts";

export default function ShiftsTable({ shifts }) {
    /* ---------- helpery zostávajú nezmenené ---------- */

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // 1–12
    const days = getDaysArray(year, month);

    const colTemplate = `10rem repeat(${days.length}, 3rem)`; // ► dynamický grid

    return (
        <div className="mx-auto mt-8 overflow-x-auto border border-slate-300">
            {/** ================= HLAVIČKA ================ */}
            <div
                /** ► odstránime pevný Tailwind reťazec, necháme len “grid” */
                className="sticky top-0 z-30 grid"
                style={{ gridTemplateColumns: colTemplate }}
            >
                <div className="flex items-center justify-center border-b border-slate-300 bg-white px-2 py-1 text-xs font-bold">
                    Meno
                </div>

                {days.map(({ day, isWeekend }) => (
                    <div
                        key={`head-${day}`} /** unikátny reťazec */
                        className={`flex h-9 items-center justify-center border-b border-l text-xs ${isWeekend ? "bg-amber-100" : "bg-white"}`}
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/** ================= RIADKY ================= */}
            {shifts.map((shift, index) => {
                const rowBg = index % 2 === 0 ? "bg-white" : "bg-slate-50";

                return (
                    <div
                        key={shift.id}
                        /** ► rovnaká šablóna ako hlavička */
                        className={`grid text-sm ${rowBg}`}
                        style={{ gridTemplateColumns: colTemplate }}
                    >
                        {/** bunka s menom */}
                        <div
                            className={`sticky left-0 z-20 flex items-center justify-center px-2 py-1 ${rowBg} hover:bg-blue-100`}
                        >
                            {shift.profiles.full_name}
                        </div>

                        {/** bunky dní */}
                        {days.map(({ dateStr, isWeekend }) => (
                            <div
                                key={`${shift.id}-${dateStr}`}
                                className={`flex h-9 cursor-pointer items-center justify-center border-l border-slate-200 hover:bg-blue-100 ${isWeekend ? "bg-amber-100" : rowBg} `}
                            >
                                {/* Sem neskôr D / N / X */}
                            </div>
                        ))}
                    </div>
                );
            })}
        </div>
    );
}
