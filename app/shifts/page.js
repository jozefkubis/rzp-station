import Header from "../_components/Header";
import RosterSection from "../_components/shifts/RosterSection";
import getAllShifts, { getAllProfiles } from "../_lib/data-service";

export const metadata = {
  title: "Služby",
};

export default async function page() {
  const shifts = await getAllShifts();
  const profiles = await getAllProfiles();

  // if (!shifts || !profiles || shifts.length === 0 || profiles.length === 0) {
  //   return (
  //     <div className="flex h-screen items-center justify-center text-xl text-gray-500">
  //       Žiadne profily nenájdené alebo chyba načítania.
  //     </div>
  //   );
  // }

  // const profileIds = profiles.map((profile) => profile.id);
  // const shiftUserIds = shifts.map((shift) => shift.user_id);
  // const diffProfileIds = profileIds.filter((id) => !shiftUserIds.includes(id));

  // const diffProfileNmesShifts = profiles.filter((profile) =>
  //   diffProfileIds.includes(profile.id)
  // );
  // const diffProfileNmesShiftsMap = diffProfileNmesShifts.map((profile) => ({
  //   id: profile.id,
  //   full_name: profile.full_name,
  // }))

  // 1. priprav si množiny pre rýchlejšie vyhľadávanie
  const shiftUserIdSet = new Set(shifts.map((s) => s.user_id));

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
          <RosterSection initialShifts={shifts} diffProfiles={diffProfiles} />
        </div>
      )}
    </div>
  );
}
