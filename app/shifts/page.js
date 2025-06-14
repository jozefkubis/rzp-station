import Header from "../_components/Header"
import ShiftsTable from "../_components/shifts/ShiftsTable";
import { getAllProfiles } from "../_lib/data-service";

export default async function page() {

    const profiles = await getAllProfiles();

    if (!profiles || profiles.length === 0) {
        return (
            <div className="flex h-screen items-center justify-center text-xl text-gray-500">
                Žiadne profily nenájdené alebo chyba načítania.
            </div>
        );
    }

    return (
        <div>
            <Header />
            <div className="flex justify-center px-8">
                <ShiftsTable profiles={profiles} />
            </div>
        </div>
    )
}

