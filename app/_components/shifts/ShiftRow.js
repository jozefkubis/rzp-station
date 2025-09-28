"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo } from "react";

import AllParamedics from "./AllParamedics";
import ContractRow from "./ContractRow";
import RowDays from "./RowDays";
import RowDaysBottom from "./RowDaysBottom";
import ShiftStatsRowDay from "./ShiftStatsRowDay";
import { fmtHours } from "./helpers_shifts";

// ShiftRow.jsx – DnD integrované (useSortable + handle)
export default function ShiftRow({
  user,
  days,
  colTemplate,
  onTopSelect,
  onBottomSelect,
  rowBg,
  onDeleteOptimistic,
  roster,
  shiftStats,
  contract,
  position,
  holidaySet,
}) {
  // === DnD: pripravenie sortable itemu
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: user.user_id });

  const dragStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : undefined,
  };

  // ❶ Set všetkých dátumov v aktuálnom mesiaci (rýchly lookup)
  const monthDates = useMemo(() => new Set(days.map((d) => d.dateStr)), [days]);

  // ❷ Smeny iba pre aktuálny mesiac
  const monthShifts = useMemo(
    () => user.shifts.filter((s) => monthDates.has(s.date)),
    [user.shifts, monthDates],
  );

  // ❸ Vypočítané štatistiky (raw hodnoty)
  const stats = useMemo(
    () =>
      shiftStats.reduce(
        (acc, col) => ({ ...acc, [col.key]: col.calc(monthShifts) }),
        {},
      ),
    [monthShifts, shiftStats],
  );

  const lowerCasePosition = position.toLowerCase();

  return (
    <div
      ref={setNodeRef}
      style={dragStyle}
      className={`grid text-sm ${rowBg} border-r border-slate-200 hover:bg-blue-100`}
      style={{ ...dragStyle, gridTemplateColumns: colTemplate }}
    >
      {/* ❶ Ľavý stĺpec – pridali sme "úchytku" (⋮⋮) s attributes/listeners */}
      <AllParamedics
        user={user}
        onDeleteOptimistic={onDeleteOptimistic}
        roster={roster}
        rowBg={rowBg}
        position={lowerCasePosition}
      >
        <span
          {...attributes}
          {...listeners}
          className="mr-2 inline-flex h-5 w-5 cursor-grab select-none items-center justify-center rounded text-slate-400 hover:text-slate-600"
          title="Presuň riadok"
          aria-label="Presuň riadok"
        >
          ⋮⋮
        </span>
        {user.full_name}
      </AllParamedics>

      <ContractRow cellBg={rowBg} rowBg={rowBg}>
        {contract}
      </ContractRow>

      {days.map(({ dateStr, isWeekend, isToday }) => {
        const found = user.shifts.find((s) => s.date === dateStr);

        const cellContent = found?.shift_type ?? ""; // horná bunka
        const bottomContent = found?.request_type ?? ""; // spodná bunka
        const isHoliday = holidaySet.has(dateStr);
        const rd = found?.shift_type === "RD";

        const cellBg = rd
          ? "bg-green-500"
          : isToday
            ? "bg-primary-100 font-semibold"
            : isHoliday
              ? "bg-holiday"
              : isWeekend
                ? "bg-amber-100"
                : rowBg;

        const cellBgBottom = isToday
          ? "bg-primary-100 font-semibold"
          : isHoliday
            ? "bg-holiday"
            : isWeekend
              ? "bg-amber-100"
              : rowBg;

        return (
          <div
            key={`${user.user_id}-${dateStr}`}
            className="flex flex-col text-[0.9rem]"
          >
            {/* horný rad */}
            <RowDays
              dateStr={dateStr}
              cellBg={cellBg}
              onSelect={(d) => onTopSelect(user.user_id, d)}
            >
              {cellContent}
            </RowDays>

            {/* spodný rad */}
            <RowDaysBottom
              dateStr={dateStr}
              cellBg={cellBgBottom}
              onSelect={(d) => onBottomSelect(user.user_id, d)}
            >
              {bottomContent}
            </RowDaysBottom>
          </div>
        );
      })}

      {/* pravé štatistiky – formátuj hodiny, ostatné nechaj ako čísla */}
      {shiftStats.map((col) => {
        const raw = stats[col.key];
        const display =
          col.key === "totalHours" || col.key === "overtime"
            ? fmtHours(raw) // zaokrúhlenie, -0.0 => 0, atď.
            : raw;

        return (
          <ShiftStatsRowDay rowBg={rowBg} key={col.key}>
            {display}
          </ShiftStatsRowDay>
        );
      })}
    </div>
  );
}
