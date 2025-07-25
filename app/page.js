import { dateStr, formatDate, tmrwDateStr } from "@/app/_lib/helpers/functions";
import MyProfileWrapper from "./_components/home/MyProfileWrapper";
import NavLinks from "./_components/home/NavLinks";
import ShiftCalendar from "./_components/home/ShiftCalendar";
import WeatherCard from "./_components/home/WeatherCard";
import {
  getProfile,
  getShiftForToday,
  getShiftForTomorrow,
  getShiftsForProfileForYear,
  getTasksForToday,
  getTasksForTomorrow,
  getUser,
} from "./_lib/data-service";

export const revalidate = 0;

export default async function Page({ searchParams }) {
  const { m } = await searchParams;
  const offset = Number(m ?? 0);


  // 1️⃣ Načítame potrebné dáta paralelne
  const user = await getUser();
  const [profile, shifts] = await Promise.all([
    getProfile(user.id),
    getShiftsForProfileForYear(user.id),
  ]);

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
    <div className="min-h-screen bg-gray-50 lg:grid lg:grid-cols-[4rem_1fr]">
      {/* NAVBAR / ASIDE */}
      <aside className="bg-primary-700 py-8 lg:sticky lg:top-0 lg:w-16">
        <ul className="flex gap-5 lg:flex-col lg:items-center">
          <NavLinks searchParams={searchParams} />
        </ul>
      </aside>

      {/* DASHBOARD GRID */}
      <main className="flex flex-1 flex-col gap-8 overflow-y-auto p-6">
        {/* Karta: Počasie */}
        <WeatherCard />

        {/* Karta: Môj profil */}

        <MyProfileWrapper
          profile={profile}
          shifts={shifts}
          initialOffset={offset}
        />

        <section className="grid w-full gap-6 md:grid-cols-2">
          <ShiftCalendar
            label="Dnes"
            dateString={formatDate(dateStr)}
            dayData={dayToday}
            nightData={nightToday}
            line={line}
            tasks={taskTitleForToday}
          />

          <ShiftCalendar
            label="Zajtra"
            dateString={formatDate(tmrwDateStr)}
            dayData={dayTomorrow}
            nightData={nightTomorrow}
            line={line}
            tasks={taskTitleForTmrw}
          />
        </section>
      </main>
    </div>
  );
}
