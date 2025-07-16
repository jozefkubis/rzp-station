import {
  getProfile,
  getShiftsForProfile,
  getUser,
} from "@/app/_lib/data-service";
import {
  formatDate,
  getDaysUntilNextMedCheck,
} from "@/app/_lib/helpers/functions";
import { CiSun } from "react-icons/ci";
import { TbCoinEuro, TbPlaneDeparture, TbMoodCrazyHappy } from "react-icons/tb";
import { IoMoonOutline } from "react-icons/io5";
import { LiaVolumeOffSolid } from "react-icons/lia";
import { BiInjection } from "react-icons/bi";
import Stat from "./Stat";

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
    <section className="col-span-full flex w-full flex-wrap items-center justify-between bg-slate-50 px-8">
      <Stat
        title="Služby mesiac"
        color="green"
        icon={<TbCoinEuro size={32} />}
        value={`${allShifts} / ${allHours} hod.`}
      />

      <Stat
        title="Denné služby"
        color="yellow"
        icon={<CiSun size={32} />}
        value={`${dayShifts} / ${dayHours} hod.`}
      />

      <Stat
        title="Nočné služby"
        color="slate"
        icon={<IoMoonOutline size={32} />}
        value={`${nightShifts} / ${nightHours} hod.`}
      />

      <Stat
        title="Dovolenka"
        color="green"
        icon={<TbPlaneDeparture size={32} />}
        value={`${rd} / ${rdHours} hod.`}
      />

      <Stat
        title="Požiadavky"
        color="red"
        icon={<LiaVolumeOffSolid size={32} />}
        value={`${xShifts}`}
      />

      <Stat
        title="Lekárska kontrola"
        color="blue"
        icon={<BiInjection size={32} />}
        value={`${medCheckDaysLeft < 0 ? `- ${Math.abs(medCheckDaysLeft)} dní` : `+ ${medCheckDaysLeft} dní`}`}
      />

      {profile.psycho_check && (
        <Stat
          title="Psychotesty"
          color="pink"
          icon={<TbMoodCrazyHappy size={32} />}
          value={`${psychoCheckDaysLeft < 0 ? `- ${Math.abs(psychoCheckDaysLeft)} dní` : `+ ${psychoCheckDaysLeft} dní`}`}
        />
      )}
    </section>
  );
}
