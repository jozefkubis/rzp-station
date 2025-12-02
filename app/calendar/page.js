import Calendar from "../_components/calendar/Calendar";
import Header from "../_components/Header";
import { getAdmin, getUser } from "../_lib/profiles-data";
import { getShiftsForProfileForYear } from "../_lib/shifts-data";

export const metadata = {
  title: "Kalendár",
};

export default async function page() {
  const user = await getUser();
  const admin = await getAdmin(user.email);
  const shifts = await getShiftsForProfileForYear(user.id);

  const shiftsAndRequests = shifts
    .filter((shift) => shift.shift_type) // vynechá prázdne riadky
    .map((shift) => ({
      shift: shift.shift_type,
      date: shift.date,
    }));



  return (
    <div className="h-screen">
      <Header />
      <main className="w-full h-[90%] md:px-10 md:py-7">
        <Calendar admin={admin} shiftsAndRequests={shiftsAndRequests} />
      </main>
    </div>
  );
}
