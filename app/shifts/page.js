import Header from "../_components/Header";
import DeleteAllShifts from "../_components/shifts/DeleteAllShifts";
import InsertShiftButton from "../_components/shifts/InsertShiftButton";
import ShiftsTable from "../_components/shifts/ShiftsTable";
import getAllShifts from "../_lib/data-service";

export default async function page() {
  const shifts = await getAllShifts();

  if (!shifts || shifts.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center text-xl text-gray-500">
        Žiadne profily nenájdené alebo chyba načítania.
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div>
        <div className="flex justify-center px-8">
          <ShiftsTable shifts={shifts} />
        </div>
        <div className="flex gap-8 px-8">
          <div>
            <DeleteAllShifts />
          </div>
          <div>
            <InsertShiftButton />
          </div>
        </div>
      </div>
    </div>
  );
}
