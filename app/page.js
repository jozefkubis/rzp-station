import TodayTmrwShifts from "./_components/home/TodayTmrwShifts";
import NavLinks from "./_components/home/NavLinks";
import CalendarTodayTmrw from "./_components/home/CalendarTodayTmrw";
import MyProfile from "./_components/home/MyProfile";
import WeatherCard from "./_components/home/WeatherCard";

export const revalidate = 0;

export default async function Page() {
  return (
    <div className="grid h-screen grid-cols-[4rem_1fr] bg-gray-50">
      {/* NAVBAR */}
      <nav data-cy="home-nav" className="bg-primary-700 py-8">
        <ul className="flex flex-col items-center gap-5">
          <NavLinks />
        </ul>
      </nav>

      {/* DASHBOARD GRID */}
      <main className="grid grid-cols-1 gap-8 overflow-y-auto border-l border-gray-200 p-6 md:grid-cols-2">
        {/* Karta: Služba */}
        <TodayTmrwShifts />

        {/* Karta: Môj profil */}
        <MyProfile />

        {/* Karta: Kalendár */}
        <CalendarTodayTmrw />

        {/* Karta: Počasie */}
        <WeatherCard />
      </main>
    </div>
  );
}
