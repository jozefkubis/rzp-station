import { IoCalendarOutline } from "react-icons/io5";
import { CalendarDivRow, CalendarHeaderRow, CalendarPRow } from "./CalendarRow";
import {
  Day,
  ShiftDay,
  ShiftRowDay,
  ShiftRowNight,
  ShiftsDayNightTable,
  ShiftsSection,
  ShiftsTable,
} from "./ShiftRow";
import { PiAmbulance } from "react-icons/pi";
import { dateStr, formatDate } from "@/app/_lib/helpers/functions";

export default async function TodayShiftsCalendar({
  dayToday,
  nightToday,
  line,
  taskTitleForToday,
}) {
  return (
    <ShiftsSection>
      <Day>Dnes: {formatDate(dateStr)}</Day>
      <ShiftsTable>
        <ShiftDay>
          <span className="row-span-2 flex aspect-square w-10 items-center justify-center rounded-full bg-gradient-to-tr from-yellow-200 to-red-300 text-yellow-700">
            <PiAmbulance className="text-xl md:text-2xl lg:text-3xl" />
          </span>{" "}
          Služba
        </ShiftDay>

        <ShiftsDayNightTable>
          <ShiftRowDay>☀ {line(dayToday, "D")}</ShiftRowDay>
          <ShiftRowNight>🌙 {line(nightToday, "N")}</ShiftRowNight>
        </ShiftsDayNightTable>
      </ShiftsTable>

      <ShiftsTable>
        <CalendarDivRow>
          <ShiftDay>
            <span className="row-span-2 flex aspect-square w-10 items-center justify-center rounded-full bg-green-100 text-green-700">
              <IoCalendarOutline className="text-xl md:text-2xl lg:text-3xl" />
            </span>{" "}
            Kalendár
          </ShiftDay>
          <CalendarPRow>
            {taskTitleForToday.length ? taskTitleForToday : "Žiadne úlohy"}
          </CalendarPRow>
        </CalendarDivRow>
      </ShiftsTable>
    </ShiftsSection>
  );
}
