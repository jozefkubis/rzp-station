import Header from "../_components/Header";
import RosterSection from "../_components/shifts/RosterSection";
import {
  getAllProfiles,
  getAllShiftsForMonth,
  getStatus,
  getUser,
} from "../_lib/data-service";

export const metadata = {
  title: "Služby",
};

export default async function page({ searchParams }) {
  // MARK: NACITANIE PARAMETROV URL .....................................................................
  const { m } = await searchParams;
  const shiftsOffset = Number(m ?? 0);
  // console.log(m);

  // MARK: NACITANIE DÁT ...................................................................................
  const user = await getUser();
  const [shifts, profiles, status] = await Promise.all([
    getAllShiftsForMonth(shiftsOffset),
    getAllProfiles(),
    getStatus(user.email),
  ]);

  // 1. Množiny pre rýchlejšie vyhľadávanie
  const shiftUserIdSet = new Set(shifts.map((shift) => shift.user_id));

  // 2. Filter pre profily bez služby a map pre vytvorenie pola
  const diffProfiles = profiles
    .filter((p) => !shiftUserIdSet.has(p.id))
    .map(({ id, full_name, position }) => ({ id, full_name, position }));

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
          <RosterSection
            initialShifts={shifts}
            diffProfiles={diffProfiles}
            initialShiftsOffset={shiftsOffset}
            status={status}
          />
        </div>
      )}
    </div>
  );
}
