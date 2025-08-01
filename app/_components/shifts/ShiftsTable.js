"use client";

import { useRouter } from "next/navigation";
import { useCallback, useOptimistic, useState, useTransition } from "react";

import { clearRequest, clearShift, upsertRequest, upsertShift } from "@/app/_lib/actions";
import Modal from "../Modal";
import ArrowBack from "./ArrowBack";
import ArrowForword from "./ArrowForword";
import DaysMonth from "./DaysMonth";
import { getDaysArray, MONTHS, shiftTableStats } from "./helpers_shifts";
import MainShiftsTable from "./MainShiftsTable";
import MonthYearHead from "./MonthYearHead";
import ParamedName from "./ParamedName";
import ShiftChoiceModal from "./ShiftChoiceModal";
import ShiftChoiceModalBottom from "./ShiftChoisceModalBottom";
import ShiftRow from "./ShiftRow";

/* ─────────────────────────────────────────────────────────────── */
export default function ShiftsTable({ shifts, goTo, shiftsOffset, disabled }) {
  /* ---------- lokálne UI stavy ---------- */
  const router = useRouter();
  const [selected, setSelected] = useState(null); // { userId, dateStr }
  const [bottomSelected, setBottomSelected] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBottomModalOpen, setIsBottomModalOpen] = useState(false);

  /* ---------- dátumové údaje ---------- */
  const base = new Date(); // dnes
  const date = new Date(base.getFullYear(), base.getMonth() + shiftsOffset, 1);

  const year = date.getFullYear();
  const mIndex = date.getMonth(); // 0‑based
  const month = mIndex + 1; // 1‑12 pre tvoju util funkciu
  const days = getDaysArray(year, month);
  const monthName = MONTHS()[mIndex]; // jedno priame načítanie

  /* ---------- CSS grid template ---------- */
  // const colTemplate = `13.5rem repeat(${days.length + 6}, 2.5rem)`;
  const colTemplate = `13.5rem repeat(${days.length}, 2.2rem) repeat(7, 3.3rem)`;

  // MARK: OPTIMISTIC UPDATES PRE VLOZENIE A VYMAZANIE ZAZNAMOV
  const [optimisticShifts, applyOptimistic] = useOptimistic(
    shifts,
    (current, action) => {
      if (action.type === "UPSERT") {
        const exists = current.find(
          (s) => s.user_id === action.userId && s.date === action.date
        );

        if (exists) {
          return current.map((s) =>
            s.user_id === action.userId && s.date === action.date
              ? { ...s, shift_type: action.shift_type }
              : s
          );
        }

        return [
          ...current,
          {
            id: `tmp-${Date.now()}`,
            user_id: action.userId,
            date: action.date,
            shift_type: action.shift_type,
            request_type: null,
            request_hours: null,
            profiles: exists?.profiles ?? {},
          },
        ];
      }

      if (action.type === "UPSERT_REQUEST") {
        // NEMAZE riadok – len doplní/aktualizuje request_* polia
        const exists = current.find(
          (s) => s.user_id === action.userId && s.date === action.date
        );

        if (exists) {
          // aktualizuj existujúci riadok
          return current.map((s) =>
            s.user_id === action.userId && s.date === action.date
              ? { ...s, request_type: action.reqType, request_hours: action.hours ?? null }
              : s
          );
        }

        // ✔️ záznam ešte neexistuje: vytvor nový rad len so spodkom
        return [
          ...current,
          {
            id: `tmp-${Date.now()}`,
            user_id: action.userId,
            date: action.date,
            shift_type: null,
            request_type: action.reqType,
            request_hours: action.hours ?? null,
          },
        ];
      }

      if (action.type === "CLEAR_SHIFT") {
        return current
          .map((s) =>
            s.user_id === action.userId && s.date === action.date
              ? { ...s, shift_type: null }
              : s
          )
      }

      if (action.type === "DELETE_REQUEST") {
        const { userId, date } = action;
        // NEMAZE riadok – len nulovanie spodku
        return current.map(s =>
          s.user_id === userId && s.date === date
            ? { ...s, request_type: null, request_hours: null }
            : s
        );
      }

      return current;
    }
  );

  //......................................................................................

  const [isPending, startTransition] = useTransition();

  // MARK: HANDELERS
  const handleTopSelect = useCallback((userId, dateStr) => {
    setSelected({ userId, dateStr });
    setIsModalOpen(true);
  }, []);

  const handleBottomSelect = useCallback((userId, dateStr) => {
    setBottomSelected({ userId, dateStr });
    setIsBottomModalOpen(true);
  }, []);

  async function handlePickTop(type) {
    if (!selected) return;

    startTransition(() =>
      applyOptimistic({
        type: "UPSERT",
        userId: selected.userId,
        date: selected.dateStr,
        shift_type: type,
      })
    );

    setIsModalOpen(false);
    await upsertShift(selected.userId, selected.dateStr, type);
    router.refresh();
  }


  async function handlePickBottom(type, hours) {
    if (!bottomSelected) return;

    startTransition(() =>
      applyOptimistic({
        type: "UPSERT_REQUEST",
        userId: bottomSelected.userId,
        date: bottomSelected.dateStr,
        reqType: type,     // camelCase!
        hours,
      })
    );

    setIsBottomModalOpen(false);
    await upsertRequest(bottomSelected.userId, bottomSelected.dateStr, type, hours);
    router.refresh();
  }


  async function handleDeleteTop() {
    if (!selected) return;

    /* A. optimistický DELETE */
    startTransition(() =>
      applyOptimistic({
        type: "CLEAR_SHIFT", userId: selected.userId, date: selected.dateStr
      }),
    );

    setIsModalOpen(false);

    /* B. reálny DELETE */
    await clearShift(selected.userId, selected.dateStr);

    /* C. refresh */
    router.refresh();
  }

  async function handleDeleteBottom() {
    if (!bottomSelected) return;

    startTransition(() =>
      applyOptimistic({
        type: "DELETE_REQUEST",
        userId: bottomSelected.userId,
        date: bottomSelected.dateStr,
      })
    );

    setIsBottomModalOpen(false);
    await clearRequest(bottomSelected.userId, bottomSelected.dateStr);
    router.refresh();
  }

  //......................................................................................

  // MARK: OPTIMISTIC ROSTER - ZOSKUPENIE ZAZNAMOV DO ROSTERU
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
      acc[id].shifts.push({
        date: row.date,
        shift_type: row.shift_type,
        request_type: row.request_type,
        request_hours: row.request_hours,
      });

      return acc;
    }, {}),
  ).sort(
    (a, b) => a.order - b.order,
  ); /*.sort((a, b) => (a.order ?? 9_999) - (b.order ?? 9_999));*/
  //......................................................................................

  // MARK: OPTIMISTIC PRE VYMAZANIE A POSUNUTIE ZACHRANÁRA
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
  const shiftStats = shiftTableStats(normHours);

  // MARK: RETURN.........................................................................
  return (
    <>
      <MainShiftsTable colTemplate={colTemplate}>
        {/* nadpis mesiaca */}
        <MonthYearHead>
          <ArrowBack
            goTo={goTo}
            shiftsOffset={shiftsOffset}
            disabled={disabled}
          />
          <div>
            {monthName} {year} - Norma hodín: {normHours}
          </div>
          <ArrowForword
            goTo={goTo}
            shiftsOffset={shiftsOffset}
            disabled={disabled}
          />
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

          {shiftStats.map((col) => (
            <DaysMonth key={col.key}>{col.label}</DaysMonth>
          ))}
        </div>

        {/* dátové riadky */}
        {optimisticRoster.map((p, idx) => (
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
            onTopSelect={handleTopSelect}
            onBottomSelect={handleBottomSelect}
            rowBg={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}
            roster={roster}
            shiftStats={shiftStats}
            normHours={normHours}
          />
        ))}
      </MainShiftsTable>

      {/* modals */}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <ShiftChoiceModal
            onPickTop={handlePickTop}
            onDeleteTop={handleDeleteTop}
            disabled={isPending}
          />
        </Modal>
      )}

      {isBottomModalOpen && (
        <Modal onClose={() => setIsBottomModalOpen(false)}>
          <ShiftChoiceModalBottom
            onPickBottom={handlePickBottom}
            onDeleteBottom={handleDeleteBottom}
            disabled={isPending}
          />
        </Modal>
      )}
    </>
  );
}
