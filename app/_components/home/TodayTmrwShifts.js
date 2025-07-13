import { getShiftForToday, getShiftForTomorrow } from "@/app/_lib/data-service";

export default async function TodayTmrwShifts() {
  // MARK: GET SHIFT FOR TODAY
  const shiftFroToday = await getShiftForToday();
  const dayShift = shiftFroToday
    .filter((shift) => shift.shift_type === "D")
    .map((shift) => shift.profiles.full_name);
  const nightShift = shiftFroToday
    .filter((shift) => shift.shift_type === "N")
    .map((shift) => shift.profiles.full_name);

  // MARK: GET SHIFT FOR TOMORROW
  const shiftForTomorrow = await getShiftForTomorrow();
  const dayShiftTomorrow = shiftForTomorrow
    .filter((shift) => shift.shift_type === "D")
    .map((shift) => shift.profiles.full_name);
  const nightShiftTomorrow = shiftForTomorrow
    .filter((shift) => shift.shift_type === "N")
    .map((shift) => shift.profiles.full_name);

  return (
    <section className="w-full space-y-2 rounded-2xl bg-white p-4 shadow">
      <h2 className="text-lg font-semibold">Služba dnes</h2>
      <p className="text-sm text-gray-600">{dayShift[0]} - D</p>
      <p className="text-sm text-gray-600">{dayShift[1]} - D</p>
      <p className="text-sm text-gray-600">{nightShift[0]} - N</p>
      <p className="text-sm text-gray-600">{nightShift[1]} - N</p>

      <h2 className="pt-4 text-lg font-semibold">Služba zajtra</h2>
      <p className="text-sm text-gray-600">{dayShiftTomorrow[0]} - D</p>
      <p className="text-sm text-gray-600">{dayShiftTomorrow[1]} - D</p>
      <p className="text-sm text-gray-600">{nightShiftTomorrow[0]} - N</p>
      <p className="text-sm text-gray-600">{nightShiftTomorrow[1]} - N</p>
    </section>
  );
}
