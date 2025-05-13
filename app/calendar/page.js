import Calendar from "../_components/Calendar";
import Header from "../_components/Header";

export const metadata = {
  title: "Kalendár",
};

export default async function page() {

  return (
    <div>
      <Header />
      <main className="h-screen w-full py-10 px-10">
        <Calendar />
      </main>
    </div>
  );
}
