import Header from "../_components/Header";
import StatisticsMain from "../_components/statistics/StatisticsMain";
import { getAdmin, getUser } from "../_lib/profiles-data";
import getAllShifts from "../_lib/shifts-data";

export const metadata = {
  title: "Štatistiky",
};

export default async function page({ searchParams }) {
  const { y } = await searchParams;
  const statsOffset = Number(y ?? 0);
  const statsYear = new Date().getFullYear() + statsOffset;

  // const shifts = await getAllShifts();
  // const user = await getUser();

  const [shifts, user] = await Promise.all([
    getAllShifts({ year: statsYear }),
    getUser(),
  ]);

  const admin = await getAdmin(user.email);

  return (
    <div>
      <Header />
      <StatisticsMain shifts={shifts} statsOffset={statsOffset} admin={admin} />
    </div>
  );
}
