"use client";

import AllParamedics from "./AllParamedics.";
import DaysMonth from "./DaysMonth";
import { getDaysArray, getMonthOnly } from "./helpers_shifts";
import MonthYearHead from "./MonthYearHead";
import ParamedName from "./ParamedName";
import RowDays from "./RowDays";
import MainShiftsTable from "./MainShiftsTable";
import { useState, useCallback } from "react";
import ShiftRow from "./ShiftRow";

export default function ShiftsTable({ shifts }) {
    const [selected, setSelected] = useState(null);

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // 1–12
    const days = getDaysArray(year, month);

    const monthName = getMonthOnly();

    const colTemplate = `10rem repeat(${days.length}, 3rem)`; // ► dynamický grid

    const handleSelect = useCallback((shiftId, dateStr) => {
        setSelected({ shiftId, dateStr });
        console.log(shiftId, dateStr);
    }, []);

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
                {shifts.map((shift, index) => (
                    <ShiftRow
                        key={shift.id}
                        shift={shift}
                        days={days}
                        rowBg={index % 2 === 0 ? "bg-white" : "bg-slate-50"}
                        colTemplate={colTemplate}
                        onSelect={handleSelect}  // priamo memoizovaný callback
                    />
                ))}
            </MainShiftsTable>
        </>
    );
}
