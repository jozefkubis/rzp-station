import { getShiftForToday, getShiftForTomorrow } from "@/app/_lib/data-service";

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
    <section className="w-full space-y-4 rounded-2xl bg-white p-4 shadow">
      <h2 className="text-lg font-semibold">Služba dnes</h2>
      <p className="text-sm text-gray-600">{line(dayToday, "D")}</p>
      <p className="text-sm text-gray-600">{line(nightToday, "N")}</p>

      <h2 className="pt-4 text-lg font-semibold">Služba zajtra</h2>
      <p className="text-sm text-gray-600">{line(dayTomorrow, "D")}</p>
      <p className="text-sm text-gray-600">{line(nightTomorrow, "N")}</p>
    </section>
  );
}
