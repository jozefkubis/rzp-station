"use client";

import AllParamedics from "./AllParamedics.";
import DaysMonth from "./DaysMonth";
import { getDaysArray, getMonthOnly } from "./helpers_shifts";
import MonthYearHead from "./MonthYearHead";
import ParamedName from "./ParamedName";
import RowDays from "./RowDays";
import MainShiftsTable from "./MainShiftsTable";

export default function ShiftsTable({ shifts }) {

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // 1–12
    const days = getDaysArray(year, month);

    const monthName = getMonthOnly();

    const colTemplate = `10rem repeat(${days.length}, 3rem)`; // ► dynamický grid

    return (
        <>
            <MainShiftsTable colTemplate={colTemplate}>
                <MonthYearHead>
                    {monthName} {year}
                </MonthYearHead>

                {/** ================= HLAVIČKA ================ */}
                <div
                    /** ► odstránime pevný Tailwind reťazec, necháme len “grid” */
                    className="sticky top-0 z-30 grid"
                    style={{ gridTemplateColumns: colTemplate }}
                >
                    <ParamedName>
                        Meno
                    </ParamedName>

                    {days.map(({ day, isWeekend, isToday }) => {
                        const headBg = isToday
                            ? "bg-primary-100 font-semibold"
                            : isWeekend
                                ? "bg-amber-100"
                                : "bg-white";

                        return (
                            <DaysMonth key={`head-${day}`} headBg={headBg}>
                                {day}
                            </DaysMonth>
                        );
                    })}
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
                            <AllParamedics rowBg={rowBg}>
                                {shift.profiles.full_name}
                            </AllParamedics>

                            {/** bunky dní */}
                            {days.map(({ dateStr, isWeekend, isToday }) => {
                                const cellBg = isToday
                                    ? "bg-primary-100 font-semibold"
                                    : isWeekend
                                        ? "bg-amber-100"
                                        : rowBg; // zebra

                                return (
                                    <RowDays key={`${shift.id}-${dateStr}`} cellBg={cellBg}>
                                        {/* Sem neskôr D / N / X */}
                                    </RowDays>
                                );
                            })}
                        </div>
                    );
                })}
            </MainShiftsTable>
        </>
    );
}
