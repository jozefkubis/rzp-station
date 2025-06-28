"use client";

import AllParamedics from "./AllParamedics";
import DaysMonth from "./DaysMonth";
import { getDaysArray, getMonthOnly } from "./helpers_shifts";
import MonthYearHead from "./MonthYearHead";
import ParamedName from "./ParamedName";
import RowDays from "./RowDays";
import MainShiftsTable from "./MainShiftsTable";
import { useState, useCallback } from "react";
import ShiftRow from "./ShiftRow";
import ShiftChoiceModal from "./ShiftChoiceModal";
import Modal from "../Modal";
import { upsertShift } from "@/app/_lib/actions";

export default function ShiftsTable({ shifts }) {
  const [selected, setSelected] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1; // 1–12
  const days = getDaysArray(year, month);

  const monthName = getMonthOnly();

  const colTemplate = `10rem repeat(${days.length}, 3rem)`; // ► dynamický grid

  const handleSelect = useCallback((shiftId, dateStr) => {
    setSelected({ shiftId, dateStr });
    setIsModalOpen(true);
    // console.log(shiftId, dateStr);
  }, []);

  function handlePick(type) {
    if (!selected) return;

    setIsModalOpen(false);

    upsertShift(selected.shiftId, selected.dateStr, type);
    //   .then(() => {
    //     // priprava na toast
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //     alert("Ups, nepodarilo sa uložiť zmeny");
    //   });
  }


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
          <ParamedName>Záchranár</ParamedName>

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
            onSelect={handleSelect} // priamo memoizovaný callback
            shiftDate={shift.date}
            shiftType={shift.shift_type}
          />
        ))}
      </MainShiftsTable>

      {isModalOpen && (
        <Modal
          onClose={() => {
            setIsModalOpen(false);
          }}
        >
          <ShiftChoiceModal onPick={handlePick} />
        </Modal>
      )}
    </>
  );
}
