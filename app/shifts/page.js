import Header from "../_components/Header"
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

    console.log(shifts);


    return (
        <div>
            <Header />
            <div className="flex justify-center px-8">
                <ShiftsTable shifts={shifts} />
            </div>
        </div>
    )
}

