import {
  getProfile,
  getShiftsForProfile,
  getUser,
} from "@/app/_lib/data-service";
import { getDaysUntilNextMedCheck } from "@/app/_lib/helpers/functions";
import {
  TbBrain,
  TbCalendarStats,
  TbClockPlus,
  TbMoonStars,
  TbPlaneDeparture,
  TbStethoscope,
  TbSun,
} from "react-icons/tb";
import { getDaysArray } from "../shifts/helpers_shifts";
import Stat from "./Stat";

export default async function MyProfile() {
  const user = await getUser();
  const shiftsForProfile = await getShiftsForProfile(user.id);
  const profile = await getProfile(user.id);
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1; // 1-12
  const days = getDaysArray(year, month);

  const weekdays = days.filter(({ isWeekend }) => !isWeekend).length;
  const normHours = weekdays * 7.5;

  // MARK: SHIFTS
  function shiftsByType(type) {
    return shiftsForProfile.filter((shift) => shift.shift_type === type).length;
  }

  const allShifts = shiftsByType("D") + shiftsByType("N");
  const rdHours = shiftsByType("RD") * 7.5;
  const allHours = allShifts * 12 + rdHours;

  const dayHours = shiftsByType("D") * 12;
  const nightHours = shiftsByType("N") * 12;

  // MARK: OVERTIME
  const overTime = allHours - normHours;

  //MARK: DAYS LEFT TO MEDCHECK
  const medCheckDaysLeft = getDaysUntilNextMedCheck(profile.medCheckDate);
  const psychoCheckDaysLeft = getDaysUntilNextMedCheck(profile.psycho_check);

  return (
    <section className="grid w-full grid-cols-2 gap-4 rounded-2xl bg-white p-6 shadow-sm sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7">
      <Stat
        title="Služby mesiac"
        color="green"
        icon={<TbCalendarStats />}
        value={`${allShifts} / ${allHours} h.`}
      />

      <Stat
        title="Denné služby"
        color="yellow"
        icon={<TbSun />}
        value={`${shiftsByType("D")} / ${dayHours} h.`}
      />

      <Stat
        title="Nočné služby"
        color="slate"
        icon={<TbMoonStars />}
        value={`${shiftsByType("N")} / ${nightHours} h.`}
      />

      <Stat
        title="Dovolenka"
        color="green"
        icon={<TbPlaneDeparture />}
        value={`${shiftsByType("RD")} / ${rdHours} h.`}
      />

      <Stat
        title="Nadčas"
        color="red"
        icon={<TbClockPlus />}
        value={`${overTime} h.`}
      />

      <Stat
        title="Lek. prehliadka"
        color="blue"
        icon={<TbStethoscope />}
        value={`${medCheckDaysLeft < 0 ? `- ${Math.abs(medCheckDaysLeft)} dní` : `+ ${medCheckDaysLeft} dní`}`}
      />

      {profile.psycho_check && (
        <Stat
          title="Psychotesty"
          color="pink"
          icon={<TbBrain />}
          value={`${psychoCheckDaysLeft < 0 ? `- ${Math.abs(psychoCheckDaysLeft)} dní` : `+ ${psychoCheckDaysLeft} dní`}`}
        />
      )}
    </section>
  );
}
