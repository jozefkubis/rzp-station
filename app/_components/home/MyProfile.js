import {
  getProfile,
  getShiftsForProfile,
  getUser,
} from "@/app/_lib/data-service";
import {
  formatDate,
  getDaysUntilNextMedCheck,
} from "@/app/_lib/helpers/functions";
import Stat from "./Stat";
import {
  TbCalendarStats,
  TbSun,
  TbMoonStars,
  TbPlaneDeparture,
  TbBellRinging,
  TbStethoscope,
  TbBrain,
} from "react-icons/tb";

export default async function MyProfile() {
  const user = await getUser();
  const shiftsForProfile = await getShiftsForProfile(user.id);
  const profile = await getProfile(user.id);

  // MARK: DAY SHIFTS
  const dayShifts = shiftsForProfile.filter(
    (shift) => shift.shift_type === "D",
  ).length;

  const dayHours = dayShifts * 12;

  // MARK: NIGHT SHIFTS
  const nightShifts = shiftsForProfile.filter(
    (shift) => shift.shift_type === "N",
  ).length;

  const nightHours = nightShifts * 12;

  // MARK: VACATIONS
  const rd = shiftsForProfile.filter(
    (shift) => shift.shift_type === "RD",
  ).length;

  const rdHours = rd * 7.5;

  // MARK: ALL SHIFTS
  const allShifts = dayShifts + nightShifts;
  const allHours = allShifts * 12 + rdHours;

  // MARK: DAY OFF
  const xShifts = shiftsForProfile.filter((shift) =>
    shift.shift_type?.toLowerCase().includes("x"),
  ).length;

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
        value={`${dayShifts} / ${dayHours} h.`}
      />

      <Stat
        title="Nočné služby"
        color="slate"
        icon={<TbMoonStars />}
        value={`${nightShifts} / ${nightHours} h.`}
      />

      <Stat
        title="Dovolenka"
        color="green"
        icon={<TbPlaneDeparture />}
        value={`${rd} / ${rdHours} h.`}
      />

      <Stat
        title="Požiadavky"
        color="red"
        icon={<TbBellRinging />}
        value={`${xShifts}`}
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
