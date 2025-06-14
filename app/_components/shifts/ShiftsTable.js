"use client";

import clsx from "clsx";

const days = Array.from({ length: 31 }, (_, i) => i + 1);

export default function ShiftsTable({ profiles }) {
    return (
        <div className="overflow-x-auto mx-auto border border-slate-300 mt-8">
            {/* hlavička */}
            <div className="grid grid-cols-[10rem_repeat(31,3rem)] sticky top-0 z-30">
                <div className="px-2 py-1 font-bold flex items-center justify-center text-xs bg-white border-b border-slate-300">Meno</div>
                {days.map(d => (
                    <div key={d} className="h-9 flex items-center justify-center text-xs bg-white border-l border-b border-slate-300">
                        {d}
                    </div>
                ))}
            </div>

            {/* riadky */}
            {profiles.map((p, idx) => (
                <div key={p.id} className="grid grid-cols-[10rem_repeat(31,3rem)] text-sm">
                    {/* bunka s menom */}
                    <div
                        className={clsx(
                            "px-2 py-1 text-sm sticky left-0 z-20 bg-white flex items-center justify-center hover:bg-blue-100",
                            idx % 2 && "bg-slate-50 flex items-center justify-center hover:bg-blue-100"
                        )}
                    >
                        {p.full_name}
                    </div>

                    {/* 31 prázdnych buniek */}
                    {days.map(d => (
                        <div
                            key={d}
                            className={clsx(
                                "h-9 flex items-center justify-center cursor-pointer border-l border-slate-200",
                                idx % 2 && "bg-slate-50",     // zebra
                                "hover:bg-blue-100"
                            )}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}
