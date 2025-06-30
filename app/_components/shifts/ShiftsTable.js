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
import { clearMonth, deleteShift, upsertShift } from "@/app/_lib/actions";
import { useRouter } from "next/navigation";
import Button from "../Button";

export default function ShiftsTable({ shifts }) {
  const router = useRouter();
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

  async function handlePick(type) {
    if (!selected) return;

    setIsModalOpen(false);

    // počkaj na zápis
    await upsertShift(selected.shiftId, selected.dateStr, type);

    // refetch všetkých server-componentov na stránke
    router.refresh();
  }

  const roster = Object.values(
    shifts.reduce((acc, row) => {
      const id = row.user_id;
      if (!acc[id]) {
        acc[id] = {
          user_id: id,
          full_name: row.profiles.full_name,
          avatar: row.profiles.avatar_url,
          shifts: [],
        };
      }
      acc[id].shifts.push({ date: row.date, type: row.shift_type });
      return acc;
    }, {}),
  ).sort((a, b) => a.full_name.localeCompare(b.full_name, "sk"));

  async function handleDelete() {
    if (!selected) return;
    await deleteShift(selected.shiftId, selected.dateStr);
    router.refresh();
    setIsModalOpen(false);
  }

  // async function handleClearMonth() {
  //   if (!confirm("Naozaj vymazať všetky služby v aktuálnom mesiaci?")) return;
  //   await clearMonth(year, month);
  //   router.refresh();
  // }

  return (
    <>
      <MainShiftsTable colTemplate={colTemplate} >
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
        {
          roster.map((p, index) => (
            <ShiftRow
              key={p.user_id}
              user={p} // ➊ celé „resume“ osoby
              days={days}
              colTemplate={colTemplate}
              onSelect={handleSelect}
              rowBg={index % 2 === 0 ? "bg-white" : "bg-slate-50"}
            />
          ))
        }

      </MainShiftsTable >

      {isModalOpen && (
        <Modal
          onClose={() => {
            setIsModalOpen(false);
          }}
        >
          <ShiftChoiceModal onPick={handlePick} onDelete={handleDelete} />
        </Modal>
      )
      }
      {/* <div className="mb-2 flex justify-start">
        <Button variant="danger" onClick={handleClearMonth}>
          🧹 Vymaž celý mesiac
        </Button>
      </div> */}
    </>
  );
}
