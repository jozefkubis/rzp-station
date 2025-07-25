"use client";

import { useRouter } from "next/navigation";
import { useCallback, useOptimistic, useState, useTransition } from "react";


import {
  deleteShift,
  upsertShift
} from "@/app/_lib/actions";
import Modal from "../Modal";
import ArrowBack from "./ArrowBack";
import ArrowForword from "./ArrowForword";
import DaysMonth from "./DaysMonth";
import { getDaysArray, MONTHS } from "./helpers_shifts";
import MainShiftsTable from "./MainShiftsTable";
import MonthYearHead from "./MonthYearHead";
import ParamedName from "./ParamedName";
import ShiftChoiceModal from "./ShiftChoiceModal";
import ShiftRow from "./ShiftRow";

/* ─────────────────────────────────────────────────────────────── */
export default function ShiftsTable({ shifts, goTo, shiftsOffset }) {
  /* ---------- lokálne UI stavy ---------- */
  const router = useRouter();
  const [selected, setSelected] = useState(null); // { userId, dateStr }
  const [isModalOpen, setIsModalOpen] = useState(false);


  /* ---------- dátumové údaje ---------- */
  const base = new Date();                                 // dnes
  const date = new Date(base.getFullYear(), base.getMonth() + shiftsOffset, 1);

  const year = date.getFullYear();
  const mIndex = date.getMonth();          // 0‑based
  const month = mIndex + 1;               // 1‑12 pre tvoju util funkciu
  const days = getDaysArray(year, month);
  const monthName = MONTHS()[mIndex];      // jedno priame načítanie

  const colTemplate = `12rem repeat(${days.length}, 3rem)`;

  /* ---------- useOptimistic ---------- */
  const [optimisticShifts, applyOptimistic] = useOptimistic(
    shifts,
    (current, action) => {
      /* ---------- UPSERT ---------- */
      if (action.type === "UPSERT") {
        const { userId, date, shift_type } = action;

        /* odstráň prípadný starší záznam pre rovnaký deň */
        const next = current.filter(
          (s) => !(s.user_id === userId && s.date === date),
        );

        /* nájdi prototyp (aby sme mali meno, email…) */
        const proto = current.find((s) => s.user_id === userId);

        next.push({
          id: `tmp-${Date.now()}`, // dočasné ID len pre React key
          user_id: userId,
          date,
          shift_type,
          profiles: {
            full_name: proto?.profiles.full_name ?? "", // môže byť prázdne
            avatar_url: proto?.profiles.avatar_url ?? "",
            email: proto?.profiles.email ?? "", // fallback pre zobrazenie
          },
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
  const handleSelect = useCallback((userId, dateStr) => {
    setSelected({ userId, dateStr });
    setIsModalOpen(true);
  }, []);

  async function handlePick(type) {
    if (!selected) return;

    /* A. optimistický UPSERT */
    startTransition(() =>
      applyOptimistic({
        type: "UPSERT",
        userId: selected.userId,
        date: selected.dateStr,
        shift_type: type,
      }),
    );

    setIsModalOpen(false);

    /* B. zápis do DB */
    await upsertShift(selected.userId, selected.dateStr, type);

    /* C. refresh (potvrdí alebo rollbackne) */
    router.refresh();
  }

  async function handleDelete() {
    if (!selected) return;

    /* A. optimistický DELETE */
    startTransition(() =>
      applyOptimistic({
        type: "DELETE",
        userId: selected.userId,
        date: selected.dateStr,
      }),
    );

    setIsModalOpen(false);

    /* B. reálny DELETE */
    await deleteShift(selected.userId, selected.dateStr);

    /* C. refresh */
    router.refresh();
  }

  /* ---------- zoskupenie riadkov ---------- */
  const roster = Object.values(
    optimisticShifts.reduce((acc, row) => {
      const id = row.user_id;
      if (!acc[id]) {
        acc[id] = {
          user_id: id,
          full_name: row.profiles.full_name,
          email: row.profiles.email,
          avatar: row.profiles.avatar_url,
          shifts: [],
          order: row.profiles.order_index,
        };
      }
      acc[id].shifts.push({ date: row.date, type: row.shift_type });
      return acc;
    }, {}),
  ).sort(
    (a, b) => a.order - b.order,
  ); /*.sort((a, b) => (a.order ?? 9_999) - (b.order ?? 9_999));*/

  const [optimisticRoster, apply] = useOptimistic(roster, (curr, act) => {
    if (act.type === "DELETE") {
      return curr.filter((u) => u.user_id !== act.id);
    }

    if (act.type === "MOVE") {
      const index = curr.findIndex((u) => u.user_id === act.userId);
      const newIndex = act.direction === "up" ? index - 1 : index + 1;
      if (index < 0 || newIndex < 0 || newIndex >= curr.length) return curr;

      const updated = [...curr];
      const temp = updated[index];
      updated[index] = updated[newIndex];
      updated[newIndex] = temp;

      return updated;
    }

    return curr;
  });

  const weekdays = days.filter(({ isWeekend }) => !isWeekend).length;
  const normHours = weekdays * 7.5;

  // MARK: RETURN
  return (
    <>
      {/* <div className="flex ">
      </div> */}

      <MainShiftsTable colTemplate={colTemplate}>
        {/* nadpis mesiaca */}
        <MonthYearHead>
          <ArrowBack goTo={goTo} shiftsOffset={shiftsOffset} />
          <div>
            {monthName} {year} - Norma hodín: {normHours}
          </div>
          <ArrowForword goTo={goTo} shiftsOffset={shiftsOffset} />
        </MonthYearHead>

        {/* hlavička dní */}
        <div
          className="sticky top-0 z-30 grid"
          style={{ gridTemplateColumns: colTemplate }}
        >
          <ParamedName>Záchranári</ParamedName>

          {days.map(({ day, isWeekend, isToday }) => {
            const headBg = isToday
              ? "bg-primary-100 font-semibold"
              : isWeekend
                ? "bg-amber-100"
                : "bg-white";
            return (
              <DaysMonth key={day} headBg={headBg}>
                {day}
              </DaysMonth>
            );
          })}
        </div>

        {/* dátové riadky */}
        {
          optimisticRoster.map((p, idx) => (
            <ShiftRow
              key={p.user_id}
              user={p}
              onDeleteOptimistic={(id) => apply({ type: "DELETE", id })}
              onReorderOptimistic={(act) =>
                apply({
                  type: "MOVE",
                  userId: act.userId,
                  direction: act.direction,
                })
              }
              days={days}
              colTemplate={colTemplate}
              onSelect={handleSelect}
              rowBg={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}
              roster={roster}
            />
          ))
        }
      </MainShiftsTable >

      {/* modals */}
      {
        isModalOpen && (
          <Modal onClose={() => setIsModalOpen(false)}>
            <ShiftChoiceModal onPick={handlePick} onDelete={handleDelete} />
          </Modal>
        )
      }
    </>
  );
}
