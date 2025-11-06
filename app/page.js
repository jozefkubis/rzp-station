import { dateStr, formatDate, tmrwDateStr } from "@/app/_lib/helpers/functions";
import BirthdayCard from "./_components/home/BirthdayCard";
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
  getAllProfiles,
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
  const [profile, shifts, profiles] = await Promise.all([
    getProfile(user.id),
    getShiftsForProfileForYear(user.id),
    getAllProfiles(),
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
      <aside className="bg-gray-50 py-4 md:bg-primary-700 lg:sticky lg:top-0 lg:w-16 lg:py-8 md:shadow-none">
        <ul className="flex gap-5 px-6 lg:flex-col lg:items-center">
          <NavLinks searchParams={searchParams} />
          <MobileWeatherCard />
        </ul>
      </aside>
      {/* <div className=""></div> */}
      {/* DASHBOARD GRID */}
      <main className="grid grid-cols-[9rem_9rem] items-center justify-center gap-2 overflow-y-auto px-8 pb-8 pt-6 md:grid-cols-2 md:items-end md:p-6 lg:gap-8">
        <div className="col-span-2 md:hidden">
          <BirthdayCard profiles={profiles} />
        </div>
        {/* Počasie: renderuj až od md a nech vždy span-2 */}
        <RenderOnMdUp>
          <div className="col-span-2 flex justify-between w-full">
            {/* <div className="flex justify-between"> */}
            <div className="w-ful flex items-end justify-start">
              <BirthdayCard profiles={profiles} />
            </div>
            <div className="flex w-full items-end justify-end">
              <WeatherCard />
            </div>
            {/* </div> */}
          </div>
        </RenderOnMdUp>

        {/* Môj profil: na mobile aj desktop span-2 (aby neprelamoval karty) */}
        <div className="col-span-1 md:col-span-2">
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
        {/* Hlavné úlohy: na šírku */}
        <div className="aspect-7/4 col-span-1 auto-rows-[1fr]">
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
      </main>
    </div>
  );
}
