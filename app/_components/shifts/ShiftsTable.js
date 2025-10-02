"use client";

import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useOptimistic,
  useState,
  useTransition,
} from "react";

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

import { updateMonthOrderIndex } from "@/app/_lib/actions";
import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { toast } from "react-hot-toast";

/* ─────────────────────────────────────────────────────────────── */
export default function ShiftsTable({
  shifts,
  goTo,
  shiftsOffset,
  disabled,
  profiles,
  onInsertEmptyShift,
  status,
}) {
  /* ---------- lokálne UI stavy ---------- */
  const router = useRouter();
  const [selected, setSelected] = useState(null); // { userId, dateStr }
  const [bottomSelected, setBottomSelected] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBottomModalOpen, setIsBottomModalOpen] = useState(false);

  /* ---------- dátumové údaje ---------- */
  const base = new Date();
  const date = new Date(base.getFullYear(), base.getMonth() + shiftsOffset, 1);

  const year = date.getFullYear();
  const mIndex = date.getMonth(); // 0-based
  const month = mIndex + 1; // 1-12
  const monthKey = `${year}-${String(month).padStart(2, "0")}`;
  const days = getDaysArray(year, month);
  const monthName = MONTHS()[mIndex];
  const monthLabel =
    monthName.charAt(0).toUpperCase() + monthName.slice(1).toLowerCase();
  const firstDayStr = `${year}-${String(month).padStart(2, "0")}-01`;

  /* ---------- CSS grid template ---------- */
  const colTemplate = `13.5rem 2.8rem repeat(${days.length}, 2.2rem) repeat(7, 3.3rem)`;

  // MARK: OPTIMISTIC – hlavný reducer pre shifts
  const [optimisticShifts, applyOptimistic] = useOptimistic(
    shifts,
    (current, action) => {
      if (action.type === "ADD_USER") {
        const { user, firstDay, orderIndex } = action;
        const exists = current.some(
          (s) => s.user_id === user.user_id && s.date === firstDay,
        );
        if (exists) return current;

        const seed = {
          id: `tmp-${crypto.randomUUID()}`,
          user_id: user.user_id,
          date: firstDay,
          shift_type: null,
          request_type: null,
          request_hours: null,
          order_index: orderIndex ?? 999,
          profiles: {
            full_name: user.full_name ?? "(bez mena)",
            email: user.email ?? "",
            avatar_url: user.avatar_url ?? null,
            contract: Number(user.contract ?? 1),
            position: user.position ?? "",
          },
          __pending: true,
        };
        return [...current, seed];
      }

      if (action.type === "REMOVE_SEED") {
        const { user_id, date } = action;
        return current.filter(
          (s) => !(s.user_id === user_id && s.date === date),
        );
      }

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

  // MARK: HANDLERY PICK/DELETE
  const handleTopSelect = useCallback((userId, dateStr) => {
    if (status !== "admin") return;
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
  }

  // MARK: ROSTER – len aktuálny mesiac
  const monthDatesSet = useMemo(
    () => new Set(days.map((d) => d.dateStr)),
    [days],
  );

  const roster = useMemo(() => {
    const map = new Map();
    for (const row of optimisticShifts) {
      if (!monthDatesSet.has(row.date)) continue;
      const id = row.user_id;
      const oi = row.order_index ?? 999;
      if (!map.has(id)) {
        map.set(id, {
          user_id: id,
          full_name: row.profiles?.full_name ?? "(bez mena)",
          email: row.profiles?.email ?? "(bez e-mailu)",
          avatar: row.profiles?.avatar_url,
          contract: Number(row.profiles?.contract ?? 1),
          position: row.profiles?.position,
          order_index: oi,
          __pending: row.__pending ?? false,
          shifts: [],
        });
      } else {
        const v = map.get(id);
        if (oi < (v.order_index ?? 999)) v.order_index = oi;
      }
      map.get(id).shifts.push({
        date: row.date,
        shift_type: row.shift_type,
        request_type: row.request_type,
        request_hours: row.request_hours,
      });
    }
    return Array.from(map.values()).sort(
      (a, b) => (a.order_index ?? 999) - (b.order_index ?? 999),
    );
  }, [optimisticShifts, monthDatesSet]);

  // MARK: malý reducer pre roster (len DELETE)
  const [optimisticRoster, apply] = useOptimistic(roster, (curr, act) => {
    if (act.type === "DELETE") {
      return curr.filter((u) => u.user_id !== act.id);
    }
    return curr;
  });

  // MARK: SVIATKY, NORMY
  const weekdays = days.filter(({ isWeekend }) => !isWeekend).length;
  const normHours = weekdays * 7.5;
  const holidaySet = getHolidaySetForMonth(year, month);

  // MARK: DnD
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const [rows, setRows] = useState(optimisticRoster);

  const membershipKey = useMemo(
    () => [...new Set(optimisticRoster.map((u) => u.user_id))].sort().join("|"),
    [optimisticRoster],
  );

  useEffect(() => {
    setRows(optimisticRoster);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthKey, membershipKey]);

  const itemIds = rows.map((u) => `${monthKey}:${u.user_id}`);

  async function handleDragEnd(event) {
    const { active, over } = event || {};
    if (!over || active?.id === over?.id) return;

    const activeUserId = String(active.id).split(":").pop();
    const overUserId = String(over.id).split(":").pop();
    const oldIndex = rows.findIndex((r) => r.user_id === activeUserId);
    const newIndex = rows.findIndex((r) => r.user_id === overUserId);
    if (oldIndex < 0 || newIndex < 0) return;

    // optimistic move
    const next = arrayMove(rows, oldIndex, newIndex);
    setRows(next);

    try {
      await updateMonthOrderIndex(
        shiftsOffset,
        next.map((m, idx) => ({ user_id: m.user_id, order_index: idx + 1 })),
      );
    } catch (e) {
      console.error(e);
      setRows((prev) => arrayMove(prev, newIndex, oldIndex));
      toast.error("Nepodarilo sa uložiť poradie");
    }
  }

  // MARK: optimistic ADD handler
  async function handleInsertEmptyShift(newUser) {
    const nextIndex = (rows?.length ?? 0) + 1;

    // optimistic add
    applyOptimistic({
      type: "ADD_USER",
      user: {
        user_id: newUser.id,
        full_name: newUser.full_name,
        email: newUser.email,
        avatar_url: newUser.avatar_url,
        contract: newUser.contract,
        position: newUser.position,
      },
      firstDay: firstDayStr,
      orderIndex: nextIndex,
    });

    setRows((prev) => [
      ...prev,
      {
        user_id: newUser.id,
        full_name: newUser.full_name ?? "(bez mena)",
        email: newUser.email ?? "",
        avatar: newUser.avatar_url ?? null,
        contract: Number(newUser.contract ?? 1),
        position: newUser.position ?? "",
        order_index: nextIndex,
        __pending: true,
        shifts: [
          {
            date: firstDayStr,
            shift_type: null,
            request_type: null,
            request_hours: null,
          },
        ],
      },
    ]);

    try {
      await onInsertEmptyShift(newUser);
    } catch (e) {
      console.error(e);
      // rollback
      setRows((prev) => prev.filter((r) => r.user_id !== newUser.id));
      applyOptimistic({
        type: "REMOVE_SEED",
        user_id: newUser.id,
        date: firstDayStr,
      });
    }
  }

  // MARK: RENDER
  return (
    <>
      <MainShiftsTable colTemplate={colTemplate}>
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

          {shiftTableStats(0).map((col) => (
            <DaysMonth key={col.key}>{col.label}</DaysMonth>
          ))}
        </div>

        {shifts.length === 0 ? (
          <NoShifts />
        ) : (
          <DndContext
            key={monthKey}
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={itemIds}
              strategy={verticalListSortingStrategy}
            >
              {rows.map((p, idx) => {
                const fresh =
                  optimisticRoster.find((u) => u.user_id === p.user_id) || p;

                const position = String(fresh.position ?? "");
                const contract = Number(fresh.contract ?? 1);
                const perUserNorm = Math.round(normHours * contract * 10) / 10;
                const rowShiftStats = shiftTableStats(perUserNorm, contract);

                return (
                  <ShiftRow
                    key={`${monthKey}:${p.user_id}`}
                    user={fresh}
                    onDeleteOptimistic={(id) => apply({ type: "DELETE", id })}
                    days={days}
                    colTemplate={colTemplate}
                    onTopSelect={handleTopSelect}
                    onBottomSelect={handleBottomSelect}
                    rowBg={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}
                    roster={rows}
                    shiftStats={rowShiftStats}
                    normHours={perUserNorm}
                    contract={contract}
                    position={position}
                    holidaySet={holidaySet}
                    monthKey={monthKey}
                    status={status}
                  />
                );
              })}
            </SortableContext>
          </DndContext>
        )}

        <div className="flex w-[100%] justify-between gap-2 pb-6 pt-8">
          <div>
            <ShiftsTableLegend />
          </div>

          {status === "admin" && (
            <div className="flex gap-2">
              <InsertShiftButton
                profiles={profiles}
                onInsertEmptyShift={handleInsertEmptyShift}
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
          )}
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
