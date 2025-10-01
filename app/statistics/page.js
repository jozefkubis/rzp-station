import Header from "../_components/Header";
import StatisticsMain from "../_components/statistics/StatisticsMain";
import getAllShifts, { getStatus, getUser } from "../_lib/data-service";

export const metadata = {
  title: "Štatistiky",
};

export default async function page({ searchParams }) {
  const { y } = await searchParams;
  const statsOffset = Number(y ?? 0);

  const shifts = await getAllShifts();
  const user = await getUser();
  const status = await getStatus(user.email);

  return (
    <div>
      <Header />
      <StatisticsMain
        shifts={shifts}
        statsOffset={statsOffset}
        status={status}
      />
    </div>
  );
}
