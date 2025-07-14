import { getShiftForToday, getShiftForTomorrow } from "@/app/_lib/data-service";
import {
  ShiftDay,
  ShiftRowDay,
  ShiftRowNight,
  ShiftsDayNightTable,
  ShiftsSection,
  ShiftsTable,
} from "./ShiftRow";

export default async function TodayTmrwShifts() {
  /* 1. Načítanie dát paralelne */
  const [todayShifts, tomorrowShifts] = await Promise.all([
    getShiftForToday(),
    getShiftForTomorrow(),
  ]);

  /* 2. Helper – podľa typu vracia pole mien */
  function namesByType(arr, type) {
    return arr
      .filter(function (s) {
        return s.shift_type === type;
      })
      .map(function (s) {
        return s.profiles.full_name;
      });
  }

  const dayToday = namesByType(todayShifts, "D");
  const nightToday = namesByType(todayShifts, "N");
  const dayTomorrow = namesByType(tomorrowShifts, "D");
  const nightTomorrow = namesByType(tomorrowShifts, "N");

  /* 3. Helper – formát výstupu alebo pomlčka */
  function line(list, label) {
    return list.length ? list.join(", ") + " - " + label : "—";
  }

  /* 4. JSX výstup */
  return (
    <ShiftsSection>
      {/* ======= Dnes ======= */}
      <ShiftsTable>
        <ShiftDay>Služba dnes</ShiftDay>

        <ShiftsDayNightTable>
          <ShiftRowDay>☀ {line(dayToday, "D")}</ShiftRowDay>
          <ShiftRowNight>🌙 {line(nightToday, "N")}</ShiftRowNight>
        </ShiftsDayNightTable>
      </ShiftsTable>

      {/* ======= Zajtra ======= */}
      <div className="my-2 h-px bg-slate-200" />

      <ShiftsTable>
        <ShiftDay>Služba zajtra</ShiftDay>

        <ShiftsDayNightTable>
          <ShiftRowDay>☀ {line(dayTomorrow, "D")}</ShiftRowDay>
          <ShiftRowNight>🌙 {line(nightTomorrow, "N")}</ShiftRowNight>
        </ShiftsDayNightTable>
      </ShiftsTable>
    </ShiftsSection>
  );
}
