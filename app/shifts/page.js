import Header from "../_components/Header";
import DeleteAllShifts from "../_components/shifts/DeleteAllShifts";
import InsertShiftButton from "../_components/shifts/InsertShiftButton";
import ShiftsTable from "../_components/shifts/ShiftsTable";
import getAllShifts, { getAllProfiles } from "../_lib/data-service";

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
  const shiftUserIdSet = new Set(shifts.map(s => s.user_id));

  // 2. vyfiltruj len profily bez služby a hneď z nich vytvor požadované pole
  const diffProfiles = profiles
    .filter(p => !shiftUserIdSet.has(p.id))
    .map(({ id, full_name }) => ({ id, full_name }));


  return (
    <div className="pb-10">
      <Header />
      {(!shifts?.length || !profiles?.length) ? (
        <div className="flex h-60 items-center justify-center text-xl text-gray-500">
          Žiadne profily nenájdené alebo chyba načítania.
        </div>
      ) : (
        <div className="flex justify-center px-8">
          <ShiftsTable shifts={shifts} />
        </div>
      )}

      <div className="mt-6 flex gap-2 self-start px-8 2xl:px-36">
        <DeleteAllShifts />
        <InsertShiftButton profiles={diffProfiles} />
      </div>
    </div>

  );
}
