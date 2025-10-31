"use client";

import ArrowBack from "./ArrowBack";
import ArrowForword from "./ArrowForword";
import { getDaysArray, MONTHS } from "./helpers_shifts";

export default function MobileMonthYearHead({ shiftsOffset, goTo, disabled }) {
  const base = new Date();
  const date = new Date(base.getFullYear(), base.getMonth() + shiftsOffset, 1);

  const year = date.getFullYear();
  const mIndex = date.getMonth(); // 0-based
  const month = mIndex + 1; // 1-12
  //   const monthKey = `${year}-${String(month).padStart(2, "0")}`;
  const days = getDaysArray(year, month);
  const monthName = MONTHS()[mIndex];
  const monthLabel =
    monthName.charAt(0).toUpperCase() + monthName.slice(1).toLowerCase();

  const weekdays = days.filter(({ isWeekend }) => !isWeekend).length;
  const normHours = weekdays * 7.5;

  return (
    <div className="flex h-[2.8rem] justify-center pb-2 text-sm md:hidden md:h-[3.5rem] md:px-8 md:py-2 md:text-base">
      <span className="flex items-center justify-between gap-2 font-semibold text-primary-700 md:w-[25rem] md:gap-6">
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
      </span>
    </div>
  );
}
