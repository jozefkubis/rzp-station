"use client";

import { useRouter } from "next/navigation";
import { useCallback, useOptimistic, useState, useTransition } from "react";

import {
  clearRequest,
  clearShift,
  upsertRequest,
  upsertShift,
} from "@/app/_lib/actions";
import { getHolidaySetForMonth } from "@/app/_lib/holidays";
import Modal from "../Modal";
import ArrowBack from "./ArrowBack";
import ArrowForword from "./ArrowForword";
import DaysMonth from "./DaysMonth";
import DeleteAllShifts from "./DeleteAllShifts";
import DeleteOnlyShifts from "./DeleteOnlyShifts";
import GenerateShifts from "./GenerateShifts";
import { getDaysArray, MONTHS, shiftTableStats } from "./helpers_shifts";
import InsertShiftButton from "./InsertShiftButton";
import MainShiftsTable from "./MainShiftsTable";
import MonthYearHead from "./MonthYearHead";
import NoShifts from "./NoShifts";
import ParamedName from "./ParamedName";
import ShiftChoiceModal from "./ShiftChoiceModal";
import ShiftChoiceModalBottom from "./ShiftChoiceModalBottom";
import ShiftRow from "./ShiftRow";
import { ShiftsTableLegend } from "./ShiftsTableLegend";
import ValidateButton from "./ValidateButton";

/* ─────────────────────────────────────────────────────────────── */
export default function ShiftsTable({
  shifts,
  goTo,
  shiftsOffset,
  disabled,
  profiles,
  onInsertEmptyShift,
}) {
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
  const mIndex = date.getMonth(); // 0-based
  const month = mIndex + 1; // 1-12 pre util funkciu
  const days = getDaysArray(year, month);
  const monthName = MONTHS()[mIndex];
  const monthLabel =
    monthName.charAt(0).toUpperCase() + monthName.slice(1).toLowerCase();

  /* ---------- CSS grid template ---------- */
  const colTemplate = `13.5rem 2.8rem repeat(${days.length}, 2.2rem) repeat(7, 3.3rem)`;

  // MARK: OPTIMISTIC UPDATES PRE VLOŽENIE A VYMAZANIE ZÁZNAMOV
  const [optimisticShifts, applyOptimistic] = useOptimistic(
    shifts,
    (current, action) => {
      if (action.type === "UPSERT") {
        const exists = current.find(
          (s) => s.user_id === action.userId && s.date === action.date,
        );

        if (exists) {
          return current.map((s) =>
            s.user_id === action.userId && s.date === action.date
              ? { ...s, shift_type: action.shift_type }
              : s,
          );
        }

        return [
          ...current,
          {
            id: `tmp-${crypto.randomUUID()}`,
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
        const exists = current.find(
          (s) => s.user_id === action.userId && s.date === action.date,
        );

        if (exists) {
          return current.map((s) =>
            s.user_id === action.userId && s.date === action.date
              ? {
                  ...s,
                  request_type: action.reqType,
                  request_hours: action.hours ?? null,
                }
              : s,
          );
        }

        return [
          ...current,
          {
            id: `tmp-${crypto.randomUUID()}`,
            user_id: action.userId,
            date: action.date,
            shift_type: null,
            request_type: action.reqType,
            request_hours: action.hours ?? null,
          },
        ];
      }

      if (action.type === "CLEAR_SHIFT") {
        return current.map((s) =>
          s.user_id === action.userId && s.date === action.date
            ? { ...s, shift_type: null }
            : s,
        );
      }

      if (action.type === "DELETE_REQUEST") {
        const { userId, date } = action;
        return current.map((s) =>
          s.user_id === userId && s.date === date
            ? { ...s, request_type: null, request_hours: null }
            : s,
        );
      }

      return current;
    },
  );

  const [isPending, startTransition] = useTransition();

  // MARK: HANDLERY
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
      }),
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
        reqType: type,
        hours,
      }),
    );

    setIsBottomModalOpen(false);
    await upsertRequest(
      bottomSelected.userId,
      bottomSelected.dateStr,
      type,
      hours,
    );
    router.refresh();
  }

  async function handleDeleteTop() {
    if (!selected) return;

    startTransition(() =>
      applyOptimistic({
        type: "CLEAR_SHIFT",
        userId: selected.userId,
        date: selected.dateStr,
      }),
    );

    setIsModalOpen(false);
    await clearShift(selected.userId, selected.dateStr);
    router.refresh();
  }

  async function handleDeleteBottom() {
    if (!bottomSelected) return;

    startTransition(() =>
      applyOptimistic({
        type: "DELETE_REQUEST",
        userId: bottomSelected.userId,
        date: bottomSelected.dateStr,
      }),
    );

    setIsBottomModalOpen(false);
    await clearRequest(bottomSelected.userId, bottomSelected.dateStr);
    router.refresh();
  }

  // MARK: OPTIMISTIC ROSTER - ZOSKUPENIE ZÁZNAMOV DO ROSTERU
  const roster = Object.values(
    optimisticShifts.reduce((acc, row) => {
      const id = row.user_id;
      if (!acc[id]) {
        acc[id] = {
          user_id: id,
          full_name: row.profiles?.full_name ?? "(bez mena)",
          email: row.profiles?.email ?? "(bez e-mailu)",
          avatar: row.profiles?.avatar_url,
          contract: Number(row.profiles?.contract ?? 1),
          order_index: row.order_index ?? 999, // pridáme poradie
          shifts: [],
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
  ).sort((a, b) => (a.order_index ?? 999) - (b.order_index ?? 999)); // zoradenie podľa order_index

  // MARK: OPTIMISTIC PRE VYMAZANIE A POSUNUTIE ZÁCHRANÁRA
  const [optimisticRoster, apply] = useOptimistic(roster, (curr, act) => {
    if (act.type === "DELETE") {
      return curr.filter((u) => u.user_id !== act.id);
    }

    return curr;
  });

  // Plná mesačná norma (1.0 úväzok) — pre header
  const weekdays = days.filter(({ isWeekend }) => !isWeekend).length;
  const normHours = weekdays * 7.5;

  // MARK: ŠTÁTNE SVIATKY — set dátumov pre daný mesiac
  const holidaySet = getHolidaySetForMonth(year, month);

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
            {monthLabel} {year} - Norma hodín: {normHours}
          </div>
          <ArrowForword
            goTo={goTo}
            shiftsOffset={shiftsOffset}
            disabled={disabled}
          />
        </MonthYearHead>

        {/* hlavička dní */}
        <div
          className="sticky top-0 z-30 grid border-r border-t border-slate-200"
          style={{ gridTemplateColumns: colTemplate }}
        >
          <ParamedName>Záchranári</ParamedName>

          <DaysMonth>ÚV</DaysMonth>

          {days.map(({ day, isWeekend, isToday }, idx) => {
            const yyyy = String(year);
            const mm = String(month).padStart(2, "0");
            const dd = String(day).padStart(2, "0");
            const dateStr = `${yyyy}-${mm}-${dd}`;
            const isHoliday = holidaySet.has(dateStr);

            const headBg = isToday
              ? "bg-primary-100 font-semibold"
              : isHoliday
                ? "bg-holiday"
                : isWeekend
                  ? "bg-amber-100"
                  : "bg-white";

            return (
              <DaysMonth key={idx} headBg={headBg}>
                {day}
              </DaysMonth>
            );
          })}

          {/* statické hlavičky štatistík */}
          {shiftTableStats(0).map((col) => (
            <DaysMonth key={col.key}>{col.label}</DaysMonth>
          ))}
        </div>

        {/* dátové riadky */}
        {shifts.length === 0 ? (
          <NoShifts />
        ) : (
          optimisticRoster.map((p, idx) => {
            // per-user norma podľa úväzku (0.1..1.0)
            const contract = Number(p.contract ?? 1);
            const perUserNorm = Math.round(normHours * contract * 10) / 10;
            const rowShiftStats = shiftTableStats(perUserNorm);

            return (
              <ShiftRow
                key={p.user_id}
                user={p}
                onDeleteOptimistic={(id) => apply({ type: "DELETE", id })}
                days={days}
                colTemplate={colTemplate}
                onTopSelect={handleTopSelect}
                onBottomSelect={handleBottomSelect}
                rowBg={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}
                roster={roster}
                shiftStats={rowShiftStats}
                normHours={perUserNorm}
                contract={contract}
                holidaySet={holidaySet}
              />
            );
          })
        )}

        <div className="flex w-[100%] justify-between gap-2 pb-6 pt-8">
          <div>
            <ShiftsTableLegend />
          </div>

          <div className="flex gap-2">
            <InsertShiftButton
              profiles={profiles}
              onInsertEmptyShift={onInsertEmptyShift}
            />
            {shifts.length > 0 && (
              <>
                <GenerateShifts />
                <DeleteOnlyShifts />
                <ValidateButton />
                <DeleteAllShifts />
              </>
            )}
          </div>
        </div>
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
