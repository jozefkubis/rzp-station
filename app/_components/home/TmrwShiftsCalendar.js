import {
  CalendarDivRow,
  CalendarHeaderRow,
  CalendarMainRow,
  CalendarPRow,
} from "./CalendarRow";
import { IoCalendarOutline } from "react-icons/io5";
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
import { formatDate, tmrwDateStr } from "@/app/_lib/helpers/functions";

export default async function TmrwShiftsCalendar({
  dayTomorrow,
  nightTomorrow,
  line,
  taskTitleForTmrw,
}) {
  return (
    <ShiftsSection>
      <Day>Zajtra: {formatDate(tmrwDateStr)}</Day>
      <ShiftsTable>
        <ShiftDay>
          <PiAmbulance /> Služba
        </ShiftDay>

        <ShiftsDayNightTable>
          <ShiftRowDay>☀ {line(dayTomorrow, "D")}</ShiftRowDay>
          <ShiftRowNight>🌙 {line(nightTomorrow, "N")}</ShiftRowNight>
        </ShiftsDayNightTable>
      </ShiftsTable>

      <ShiftsTable>
        <CalendarDivRow>
          <ShiftDay>
            <IoCalendarOutline /> Kalendár
          </ShiftDay>
          <CalendarPRow>
            {taskTitleForTmrw.length ? taskTitleForTmrw : "Žiadne úlohy"}
          </CalendarPRow>
        </CalendarDivRow>
      </ShiftsTable>
    </ShiftsSection>
  );
}
