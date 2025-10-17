import { dateStr, formatDate, tmrwDateStr } from "@/app/_lib/helpers/functions";
import MobileMainTaskButton from "./_components/home/MobileMainTaskButton";
import MobileTmrwDayShiftButton from "./_components/home/MobileTmrwDayShiftButton";
import MobileTmrwNightShiftButton from "./_components/home/MobileTmrwNightShiftButton";
import MobileTodayDayShiftButton from "./_components/home/MobileTodayDayShiftButton";
import MobileTodayNightShiftButton from "./_components/home/MobileTodayNightShiftButton";
import MobileWeatherCard from "./_components/home/MobileWeatherCard";
import MyProfileWrapper from "./_components/home/MyProfileWrapper";
import NavLinks from "./_components/home/NavLinks";
import ShiftCalendar from "./_components/home/ShiftCalendar";
import WeatherCard from "./_components/home/WeatherCard";
import RenderOnMdUp from "./_components/RenderOnMdUp";
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

  // MARK: NACITANIE DÁT ...................................................................................
  const user = await getUser();
  // Načítanie dát paralelne
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
  function namesByType(arr, baseType) {
    const list = arr ?? [];

    const ALIASES = {
      D: new Set(["D", "zD", "vD"]),
      N: new Set(["N", "zN", "vN"]),
    };

    return (
      list
        .filter((s) => ALIASES[baseType].has(s.shift_type))
        // predtým: .map((s) => s.profiles.full_name)
        .map((s) => s?.profiles?.full_name ?? "—")
    );
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

  // MARK: RENDER .......................................................................................
  return (
    <div className="min-h-screen bg-gray-50 lg:grid lg:grid-cols-[4rem_1fr]">
      {/* NAVBAR / ASIDE */}
      <aside className="bg-gray-50 py-4 md:bg-primary-700 lg:sticky lg:top-0 lg:w-16 lg:py-8">
        <ul className="flex gap-5 px-6 lg:flex-col lg:items-center">
          <NavLinks searchParams={searchParams} />
          <MobileWeatherCard />
        </ul>
        <div className=""></div>
      </aside>
      {/* DASHBOARD GRID */}
      <main className="grid grid-cols-2 gap-4 overflow-y-auto p-6 lg:gap-8">
        {/* Počasie: renderuj až od md a nech vždy span-2 */}
        <RenderOnMdUp>
          <div className="col-span-2">
            <WeatherCard />
          </div>
        </RenderOnMdUp>

        {/* Môj profil: na mobile aj desktop span-2 (aby neprelamoval karty) */}
        <div className="col-span-2">
          <MyProfileWrapper
            profile={profile}
            shifts={shifts}
            initialOffset={offset}
          />
        </div>

        {/* Kalendáre: len od md a nech sú v dvoch stĺpcoch, kontajner span-2 */}
        <section className="col-span-2 hidden md:grid md:grid-cols-2 md:gap-6">
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

        {/* Mobilné tlačidlá: nech sú čisté 2-stĺpcové kartičky */}
        {/* <div className="col-span-1 aspect-[7/4]"> */}
        <MobileTodayDayShiftButton
          dayData={dayToday}
          dateString={dateStr}
          label="Dnes"
        />
        {/* </div> */}

        {/* <div className="col-span-1 aspect-[7/4]"> */}
        <MobileTodayNightShiftButton
          nightData={nightToday}
          dateString={dateStr}
          label="Dnes"
        />
        {/* </div> */}

        {/* <div className="col-span-1 aspect-[7/4]"> */}
        <MobileTmrwDayShiftButton
          dayData={dayTomorrow}
          dateString={tmrwDateStr}
          label="Zajtra"
        />
        {/* </div> */}

        {/* <div className="col-span-1 aspect-[7/4]"> */}
        <MobileTmrwNightShiftButton
          nightData={nightTomorrow}
          dateString={tmrwDateStr}
          label="Zajtra"
        />
        {/* </div> */}

        {/* Hlavné úlohy: na šírku */}
        <div className="col-span-2">
          <MobileMainTaskButton
            dayData={dayToday}
            dayTmrw={dayTomorrow}
            dateString={dateStr}
            tmrwDateStr={tmrwDateStr}
            labelTmrw="Zajtra"
            tasks={taskTitleForToday}
            labelToday="Dnes"
            tmrwTasks={taskTitleForTmrw}
          />
        </div>
      </main>
    </div>
  );
}
