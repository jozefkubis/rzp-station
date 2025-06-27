import AllParamedics from "./AllParamedics";
import RowDays from "./RowDays";

// ShiftRow.jsx
export default function ShiftRow({
  shift,
  days,
  rowBg,
  onSelect,
  colTemplate,
  shiftDate,
  shiftType,
}) {
  return (
    <div
      className={`grid text-sm ${rowBg}`}
      style={{ gridTemplateColumns: colTemplate }}
    >
      {/** bunka s menom */}
      <AllParamedics rowBg={rowBg}>{shift.profiles.full_name}</AllParamedics>

      {/** bunky dní */}
      {days.map(({ dateStr, isWeekend, isToday }) => {
        const cellBg = isToday
          ? "bg-primary-100 font-semibold"
          : isWeekend
            ? "bg-amber-100"
            : rowBg; // zebra

        const cellContent = dateStr === shiftDate ? shiftType : "";

        return (
          <RowDays
            key={`${shift.id}-${dateStr}`}
            dateStr={dateStr}
            cellBg={cellBg}
            onSelect={(d) => onSelect(shift.id, d)}
          >
            {cellContent}
          </RowDays>
        );
      })}
    </div>
  );
}
