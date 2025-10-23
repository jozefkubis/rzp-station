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
    <div>
      <Header />
      <main className="h-screen w-full px-4 py-7 md:px-10">
        <Calendar admin={admin} />
      </main>
    </div>
  );
}
