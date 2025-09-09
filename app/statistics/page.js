import Header from "../_components/Header";
import StatisticsMain from "../_components/statistics/StatisticsMain";
import getAllShifts from "../_lib/data-service";

export const metadata = {
  title: "Štatistiky",
};

export default async function page({ searchParams }) {
  const { y } = await searchParams;
  const statsOffset = Number(y ?? 0);
  console.log(statsOffset);



  const shifts = await getAllShifts();

  return (
    <div>
      <Header />
      <StatisticsMain shifts={shifts} statsOffset={statsOffset} />
    </div>
  );
}
