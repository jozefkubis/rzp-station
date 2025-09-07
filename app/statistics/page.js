import Header from "../_components/Header";
import StatisticsMain from "../_components/statistics/StatisticsMain";
import getAllShifts, { getAllProfiles } from "../_lib/data-service";

export const metadata = {
  title: "Štatistiky",
};

export default async function page() {

  const shifts = await getAllShifts();

  const profiles = await getAllProfiles()



  return (
    <div>
      <Header />
      <StatisticsMain profiles={profiles} shifts={shifts} />
    </div>
  );
}
