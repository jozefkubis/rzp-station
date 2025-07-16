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
          <PiAmbulance /> Služba
        </ShiftDay>

        <ShiftsDayNightTable>
          <ShiftRowDay>☀ {line(dayToday, "D")}</ShiftRowDay>
          <ShiftRowNight>🌙 {line(nightToday, "N")}</ShiftRowNight>
        </ShiftsDayNightTable>
      </ShiftsTable>

      <ShiftsTable>
        <CalendarDivRow>
          <ShiftDay>
            <IoCalendarOutline /> Kalendár
          </ShiftDay>
          <CalendarPRow>
            {taskTitleForToday.length ? taskTitleForToday : "Žiadne úlohy"}
          </CalendarPRow>
        </CalendarDivRow>
      </ShiftsTable>
    </ShiftsSection>
  );
}
