import { IoCalendarOutline } from "react-icons/io5";
import { PiAmbulance } from "react-icons/pi";
import { CalendarDivRow, CalendarPRow } from "./CalendarRow";
import {
  Day,
  ShiftDay,
  ShiftRowDay,
  ShiftRowNight,
  ShiftsDayNightTable,
  ShiftsSection,
  ShiftsTable,
} from "./ShiftRow";

export default function ShiftCalendar({
  label,
  dateString,
  dayData,
  nightData,
  line,
  tasks = [],
}) {
  // Usporiadnie uloh 1., 2., ...
  const boxContent = tasks.map((task, i) => (
    <li key={i} className="flex items-center gap-2">
      {i + 1}. {task}
    </li>
  ));

  return (
    <ShiftsSection>
      <Day>
        {label}: {dateString}
      </Day>

      {/* Služby */}
      <ShiftsTable>
        <ShiftDay>
          <span className="row-span-2 flex aspect-square w-10 items-center justify-center rounded-full bg-gradient-to-tr from-yellow-200 to-red-300 text-yellow-700">
            <PiAmbulance className="text-xl md:text-2xl lg:text-3xl" />
          </span>{" "}
          Služba
        </ShiftDay>

        <ShiftsDayNightTable>
          <ShiftRowDay>☀ {line(dayData, "D")}</ShiftRowDay>
          <ShiftRowNight>🌙 {line(nightData, "N")}</ShiftRowNight>
        </ShiftsDayNightTable>
      </ShiftsTable>

      {/* Kalendár úloh */}
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
