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
  const boxContent = taskTitleForTmrw.map((task, i) => (
    <li key={task.id}>
      <span className="flex gap-2 items-center">
        {i + 1}. {task}
      </span>
    </li>
  ));

  return (
    <ShiftsSection>
      <Day>Zajtra: {formatDate(tmrwDateStr)}</Day>
      <ShiftsTable>
        <ShiftDay>
          <span className="row-span-2 flex aspect-square w-10 items-center justify-center rounded-full bg-gradient-to-tr from-yellow-200 to-red-300 text-yellow-700">
            <PiAmbulance className="text-xl md:text-2xl lg:text-3xl" />
          </span>{" "}
          Služba
        </ShiftDay>

        <ShiftsDayNightTable>
          <ShiftRowDay>☀ {line(dayTomorrow, "D")}</ShiftRowDay>
          <ShiftRowNight>🌙 {line(nightTomorrow, "N")}</ShiftRowNight>
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
            {boxContent.length ? boxContent : "Žiadne úlohy"}
          </CalendarPRow>
        </CalendarDivRow>
      </ShiftsTable>
    </ShiftsSection>
  );
}
