import Header from "../_components/Header"
import DeleteAllShifts from "../_components/shifts/DeleteAllShifts";
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
            <div className="flex flex-col gap-5 justify-center px-8">
                <ShiftsTable shifts={shifts} />
                <DeleteAllShifts />
            </div>
        </div>
    )
}

