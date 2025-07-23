import QueryProvider from "@/app/_components/QueryProvider";
import { dateStr, formatDate, tmrwDateStr } from "@/app/_lib/helpers/functions";
import Link from "next/link";
import { HiArrowNarrowLeft, HiArrowNarrowRight } from "react-icons/hi";
import MyProfile from "./_components/home/MyProfile";
import NavLinks from "./_components/home/NavLinks";
import ShiftCalendar from "./_components/home/ShiftCalendar";
import WeatherCard from "./_components/home/WeatherCard";
import {
  getShiftForToday,
  getShiftForTomorrow,
  getTasksForToday,
  getTasksForTomorrow,
} from "./_lib/data-service";

export const revalidate = 0;

export default async function Page({ searchParams }) {
  const { m } = await searchParams;
  const offset = Number(m ?? 0);

  const label = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + offset,
  ).toLocaleDateString("sk-SK", { month: "long", year: "numeric" });

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
          <NavLinks />
        </ul>
      </aside>

      {/* DASHBOARD GRID */}
      <main className="flex flex-1 flex-col gap-8 overflow-y-auto p-6">
        {/* Karta: Počasie */}
        <WeatherCard />

        {/* Karta: Môj profil */}
        <div className="flex items-center justify-end gap-6 px-8 py-0 font-semibold text-primary-700">
          <Link
            href={`?m=${offset - 1}`}
            prefetch={false}
            aria-label="Predchádzajúci mesiac"
            className="cursor-pointer rounded-lg bg-primary-50 px-2 hover:bg-white hover:ring-1 active:scale-95"
          >
            <HiArrowNarrowLeft className="text-2xl text-primary-300" />
          </Link>

          <h3 className="text-lg">{label}</h3>

          <Link
            href={`?m=${offset + 1}`}
            prefetch={false}
            aria-label="Ďalší mesiac"
            className="cursor-pointer rounded-lg bg-primary-50 px-2 hover:bg-white hover:ring-1 active:scale-95"
          >
            <HiArrowNarrowRight className="text-2xl text-primary-300" />
          </Link>
        </div>

        {/* 💡 MyProfile dostáva offset ako prop */}
        <QueryProvider>
          <MyProfile offset={offset} />
        </QueryProvider>

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
