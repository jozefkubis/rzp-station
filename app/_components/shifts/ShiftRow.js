import AllParamedics from "./AllParamedics";
import RowDays from "./RowDays";
import ShiftStatsRowDay from "./ShiftStatsRowDay";

// ShiftRow.jsx
export default function ShiftRow({
  user,
  days,
  colTemplate,
  onSelect,
  rowBg,
  onDeleteOptimistic,
  onReorderOptimistic,
  roster,
  shiftStats,
}) {
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
      >
        {user.full_name}
      </AllParamedics>

      {days.map(({ dateStr, isWeekend, isToday }) => {
        const found = (user.shifts || []).find((s) => s.date === dateStr);
        const cellContent = found ? found.type : "";

        const cellBg = isToday
          ? "bg-primary-100 font-semibold"
          : isWeekend
            ? "bg-amber-100"
            : rowBg;

        return (
          <RowDays
            key={`${user.user_id}-${dateStr}`}
            dateStr={dateStr}
            cellBg={cellBg}
            onSelect={(d) => onSelect(user.user_id, d)}
          >
            {cellContent}
          </RowDays>
        );
      })}

      {shiftStats.map((s) => (
        <ShiftStatsRowDay
          key={s}
          onSelect={(d) => onSelect(user.user_id, d)}
        >
          {" "}
        </ShiftStatsRowDay>
      ))
      }
    </div >
  );
}
