"use client";

import { useState, useCallback, useOptimistic, useTransition } from "react";
import { useRouter } from "next/navigation";

import DaysMonth from "./DaysMonth";
import MonthYearHead from "./MonthYearHead";
import ParamedName from "./ParamedName";
import MainShiftsTable from "./MainShiftsTable";
import ShiftRow from "./ShiftRow";
import ShiftChoiceModal from "./ShiftChoiceModal";
import Modal from "../Modal";

import { deleteShift, upsertShift } from "@/app/_lib/actions";

import { getDaysArray, getMonthOnly } from "./helpers_shifts";

/* ─────────────────────────────────────────────────────────────────── */
export default function ShiftsTable({ shifts }) {
  /* ---------- lokálne UI stavy ---------- */
  const router = useRouter();
  const [selected, setSelected] = useState(null); // { shiftId, dateStr }
  const [isModalOpen, setIsModalOpen] = useState(false);

  /* ---------- dátumové údaje ---------- */
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1; // 1-12
  const days = getDaysArray(year, month);
  const monthName = getMonthOnly();
  const colTemplate = `10rem repeat(${days.length}, 3rem)`;

  /* ---------- useOptimistic ---------- */
  const [optimisticShifts, applyOptimistic] = useOptimistic(
    shifts,
    (current, action) => {
      /* ---------- UPSERT ---------- */
      if (action.type === "UPSERT") {
        const { userId, date, shift_type } = action;
        const next = current.filter(
          (s) => !(s.user_id === userId && s.date === date),
        );
        const proto = current.find((s) => s.user_id === userId);
        next.push({
          id: `tmp-${Date.now()}`,
          user_id: userId,
          date,
          shift_type,
          profiles: proto?.profiles ?? { full_name: "", avatar_url: "" },
        });
        return next;
      }

      /* ---------- DELETE ---------- */
      if (action.type === "DELETE") {
        const { userId, date } = action;
        return current.filter(
          (s) => !(s.user_id === userId && s.date === date),
        );
      }

      return current;
    },
  );

  const [isPending, startTransition] = useTransition();

  /* ---------- handlers ---------- */
  const handleSelect = useCallback((shiftId, dateStr) => {
    setSelected({ shiftId, dateStr });
    setIsModalOpen(true);
  }, []);

  async function handlePick(type) {
    if (!selected) return;

    /* A. optimistický UPSERT */
    startTransition(() =>
      applyOptimistic({
        type: "UPSERT",
        userId: selected.shiftId,
        date: selected.dateStr,
        shift_type: type,
      }),
    );

    setIsModalOpen(false);

    /* B. reálny zápis */
    await upsertShift(selected.shiftId, selected.dateStr, type);

    /* C. refresh (nahradí tmp-id alebo rollbackne) */
    router.refresh();
  }

  async function handleDelete() {
    if (!selected) return;

    /* A. optimistický DELETE */
    startTransition(() =>
      applyOptimistic({
        type: "DELETE",
        userId: selected.shiftId,
        date: selected.dateStr,
      }),
    );

    setIsModalOpen(false);

    /* B. reálny DELETE */
    await deleteShift(selected.shiftId, selected.dateStr);

    /* C. refresh na zosúladenie */
    router.refresh();
  }

  /* ---------- zoskupenie do riadkov ---------- */
  const roster = Object.values(
    optimisticShifts.reduce((acc, row) => {
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

  /* ───────────── JSX ───────────── */
  return (
    <>
      <MainShiftsTable colTemplate={colTemplate}>
        {/* nadpis mesiaca */}
        <MonthYearHead>
          {monthName} {year}
        </MonthYearHead>

        {/* hlavička dní */}
        <div
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

        {/* dátové riadky */}
        {roster.map((p, idx) => (
          <ShiftRow
            key={p.user_id}
            user={p}
            days={days}
            colTemplate={colTemplate}
            onSelect={handleSelect}
            rowBg={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}
          />
        ))}
      </MainShiftsTable>

      {/* modal výberu / mazania */}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <ShiftChoiceModal onPick={handlePick} onDelete={handleDelete} />
        </Modal>
      )}
    </>
  );
}
