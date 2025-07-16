import NavLinks from "./_components/home/NavLinks";
import MyProfile from "./_components/home/MyProfile";
import WeatherCard from "./_components/home/WeatherCard";
import TodayShiftsCalendar from "./_components/home/TodayShiftsCalendar";
import {
  getShiftForToday,
  getShiftForTomorrow,
  getTasksForToday,
  getTasksForTomorrow,
} from "./_lib/data-service";
import TmrwShiftsCalendar from "./_components/home/TmrwShiftsCalendar";

export const revalidate = 0;

export default async function Page() {
  // MARK: SHIFTS...........................................................................................
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
  //......................................................................................................

  //MARK: CALENDAR.......................................................................................
  const tasksForToday = await getTasksForToday();
  const taskTitleForToday = tasksForToday.map((task) => task.title);
  const taskForTmrw = await getTasksForTomorrow();
  const taskTitleForTmrw = taskForTmrw.map((task) => task.title);
  //......................................................................................................

  return (
    <div className="grid h-screen grid-cols-[4rem_1fr] bg-gray-50">
      {/* NAVBAR */}
      <nav data-cy="home-nav" className="bg-primary-700 py-8">
        <ul className="flex flex-col items-center gap-5">
          <NavLinks />
        </ul>
      </nav>

      {/* DASHBOARD GRID */}
      <main className="flex h-screen flex-col gap-8 py-6">
        {/* Karta: Počasie */}
        <WeatherCard />

        {/* Karta: Môj profil */}
        <MyProfile />
        {/* Karta: Služba a Kanlendar */}
        <div className="flex gap-6 px-8">
          <TodayShiftsCalendar
            dayToday={dayToday}
            nightToday={nightToday}
            line={line}
            taskTitleForToday={taskTitleForToday}
            tasksForToday={tasksForToday}
          />

          <TmrwShiftsCalendar
            dayTomorrow={dayTomorrow}
            nightTomorrow={nightTomorrow}
            line={line}
            taskForTmrw={taskForTmrw}
            taskTitleForTmrw={taskTitleForTmrw}
          />
        </div>
      </main>
    </div>
  );
}
