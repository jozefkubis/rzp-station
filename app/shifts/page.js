import Header from "../_components/Header";
import RosterSection from "../_components/shifts/RosterSection";
import getAllShifts, { getAllProfiles } from "../_lib/data-service";

export const metadata = {
  title: "Služby",
};

export default async function page({ searchParams }) {
  const { m } = await searchParams;
  const shiftsOffset = Number(m ?? 0);
  // console.log(s);


  const [shifts, profiles] = await Promise.all([getAllShifts(), getAllProfiles()]);

  // 1. priprav si množiny pre rýchlejšie vyhľadávanie
  const shiftUserIdSet = new Set(shifts.map((shift) => shift.user_id));

  // 2. vyfiltruj len profily bez služby a hneď z nich vytvor požadované pole
  const diffProfiles = profiles
    .filter((p) => !shiftUserIdSet.has(p.id))
    .map(({ id, full_name }) => ({ id, full_name }));

  return (
    <div className="pb-10">
      <Header />

      {/* ak nie sú absolútne žiadne profily → nemá zmysel nič zobrazovať */}
      {!profiles.length ? (
        <div className="flex h-60 items-center justify-center text-xl text-primary-700">
          Žiadne profily nenájdené alebo chyba načítania.
        </div>
      ) : (
        /* RosterSection zobraz aj pri prázdnych shifts */
        <div className="flex justify-center px-8">
          <RosterSection initialShifts={shifts} diffProfiles={diffProfiles} initialShiftsOffset={shiftsOffset} />
        </div>
      )}
    </div>
  );
}
