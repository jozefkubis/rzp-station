import Calendar from "../_components/calendar/Calendar";
import Header from "../_components/Header";
import { getAdmin, getUser } from "../_lib/data-service";

export const metadata = {
  title: "Kalendár",
};

export default async function page() {
  const user = await getUser();
  const admin = await getAdmin(user.email);

  return (
    <div className="h-screen">
      <Header />
      <main className="w-full h-[90%] md:px-10 md:py-7">
        <Calendar admin={admin} />
      </main>
    </div>
  );
}
