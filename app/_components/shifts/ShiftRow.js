import { useMemo } from "react";
import AllParamedics from "./AllParamedics";
import RowDays from "./RowDays";
import RowDaysBottom from "./RowDaysBottom";
import ShiftStatsRowDay from "./ShiftStatsRowDay";

// ShiftRow.jsx
export default function ShiftRow({
  user,
  days,
  colTemplate,
  onTopSelect,
  onBottomSelect,
  rowBg,
  onDeleteOptimistic,
  onReorderOptimistic,
  roster,
  shiftStats,
}) {
  // ❶ Vyrob Set všetkých dátumov toho mesiaca (rýchly lookup)
  const monthDates = useMemo(() => new Set(days.map((d) => d.dateStr)), [days]);

  // ❷ Vyfiltruj smeny, ktoré patria do aktuálneho mesiaca
  const monthShifts = useMemo(
    () => user.shifts.filter((s) => monthDates.has(s.date)),
    [user.shifts, monthDates],
  );

  const stats = useMemo(
    () =>
      shiftStats.reduce(
        (acc, col) => ({ ...acc, [col.key]: col.calc(monthShifts) }),
        {},
      ),
    [monthShifts, shiftStats],
  );

  return (
    <div
      className={`grid text-sm ${rowBg} hover:bg-blue-100`}
      style={{ gridTemplateColumns: colTemplate }}
    >
      <AllParamedics
        user={user}
        onDeleteOptimistic={onDeleteOptimistic}
        onReorderOptimistic={onReorderOptimistic}
        roster={roster}
        rowBg={rowBg}
      >
        {user.full_name}
      </AllParamedics>

      {days.map(({ dateStr, isWeekend, isToday }) => {
        const found = user.shifts.find(s => s.date === dateStr);

        const cellContent = found?.shift_type ?? "";   // horná bunka
        const bottomContent = found?.request_type ?? "";   // spodná bunka


        const cellBg = isToday
          ? "bg-primary-100 font-semibold"
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
              cellBg={cellBg}
              onSelect={(d) => onBottomSelect(user.user_id, d)}
            >
              {bottomContent}
            </RowDaysBottom>
          </div>
        );
      })}

      {shiftStats.map((col) => (
        <ShiftStatsRowDay rowBg={rowBg} key={col.key}>
          {stats[col.key]}
        </ShiftStatsRowDay>
      ))}
    </div>
  );
}
