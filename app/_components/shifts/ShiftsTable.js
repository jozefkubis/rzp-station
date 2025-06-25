"use client";

// import { getMonth } from "date-fns";
import { getDaysArray, getMonthOnly } from "./helpers_shifts";

export default function ShiftsTable({ shifts }) {
  /* ---------- helpery zostávajú nezmenené ---------- */

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1; // 1–12
  const days = getDaysArray(year, month);

  const monthName = getMonthOnly();

  const colTemplate = `10rem repeat(${days.length}, 3rem)`; // ► dynamický grid

  return (
    <>
      <div className="mx-auto mt-8 overflow-x-auto border border-slate-300">
        <div className="h-[2.5rem] border-b py-2 text-center">
          <span className="fixed">
            {monthName} {year}
          </span>
        </div>

        {/** ================= HLAVIČKA ================ */}
        <div
          /** ► odstránime pevný Tailwind reťazec, necháme len “grid” */
          className="sticky top-0 z-30 grid"
          style={{ gridTemplateColumns: colTemplate }}
        >
          <div className="sticky left-0 z-20 flex items-center justify-center border-b border-slate-300 bg-white px-2 py-1 text-sm font-bold">
            Meno
          </div>

          {days.map(({ day, isWeekend, isToday }) => {
            const headBg = isToday
              ? "bg-primary-100 font-semibold"
              : isWeekend
                ? "bg-amber-100"
                : "bg-white";

            return (
              <div
                key={`head-${day}`}
                className={`flex h-9 items-center justify-center border-b border-l text-xs ${headBg}`}
              >
                {day}
              </div>
            );
          })}
        </div>

        {/** ================= RIADKY ================= */}
        {shifts.map((shift, index) => {
          const rowBg = index % 2 === 0 ? "bg-white" : "bg-slate-50";

          return (
            <div
              key={shift.id}
              /** ► rovnaká šablóna ako hlavička */
              className={`grid text-sm ${rowBg}`}
              style={{ gridTemplateColumns: colTemplate }}
            >
              {/** bunka s menom */}
              <div
                className={`sticky left-0 z-20 flex items-center justify-center px-2 py-1 ${rowBg} hover:bg-blue-100`}
              >
                {shift.profiles.full_name}
              </div>

              {/** bunky dní */}
              {days.map(({ dateStr, isWeekend, isToday }) => {
                const cellBg = isToday
                  ? "bg-primary-100 font-semibold"
                  : isWeekend
                    ? "bg-amber-100"
                    : rowBg; // zebra

                return (
                  <div
                    key={`${shift.id}-${dateStr}`}
                    className={`flex h-9 cursor-pointer items-center justify-center border-l border-slate-200 hover:bg-blue-100 ${cellBg}`}
                  >
                    {/* Sem neskôr D / N / X */}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
}
