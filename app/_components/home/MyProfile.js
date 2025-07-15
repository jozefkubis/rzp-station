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
    <section className="flex w-full flex-col justify-center gap-y-2 rounded-2xl bg-white p-8 shadow">
      <p className="rounded-lg bg-slate-50 px-3 py-3 text-[1rem] font-semibold text-primary-700 shadow-sm 2xl:text-xl flex items-center gap-3">
        <TbCoinEuro /> Služby tento mesiac spolu: {allShifts} - ({allHours} hod.)
      </p>
      <p className="rounded-lg bg-slate-50 px-3 py-3 text-[1rem] font-semibold text-primary-700 shadow-sm 2xl:text-xl flex items-center gap-3">
        <CiSun /> Denné: {dayShifts} - ({dayHours} hod.)
      </p>
      <p className="rounded-lg bg-slate-50 px-3 py-3 text-[1rem] font-semibold text-primary-700  shadow-sm 2xl:text-xl flex items-center gap-3">
        <IoMoonOutline />
        Nočné: {nightShifts} - ({nightHours} hod.)
      </p>
      <p className="rounded-lg bg-slate-50 px-3 py-3 text-[1rem] font-semibold text-primary-700  shadow-sm 2xl:text-xl flex items-center gap-3">
        <TbPlaneDeparture />
        Dovolenka: {rd} - ({rdHours} hod.)
      </p>
      <p className="rounded-lg bg-slate-50 px-3 py-3 text-[1rem] font-semibold text-primary-700  shadow-sm 2xl:text-xl flex items-center gap-3">
        <LiaVolumeOffSolid /> Požiadavky: {xShifts}
      </p>

      <p className="rounded-lg bg-slate-50 px-3 py-3 text-[1rem] font-semibold text-primary-700  shadow-sm 2xl:text-xl flex items-center gap-3">
        <BiInjection />
        Lekárska prehliadka: {formatDate(profile.medCheckDate)} (
        <span
          className={
            medCheckDaysLeft < 0
              ? "text-red-600"
              : medCheckDaysLeft < 30
                ? "text-orange-400"
                : "text-primary-700"
          }
        >
          {medCheckDaysLeft < 0
            ? `Prehliadka vypršala pred ${Math.abs(medCheckDaysLeft)} dňami`
            : `Do prehliadky ostáva ${medCheckDaysLeft} dní`}
        </span>
        )
      </p>
      {profile.psycho_check !== null && (
        <p className="rounded-lg bg-slate-50 px-3 py-3 text-[1rem] font-semibold text-primary-700 shadow-sm 2xl:text-xl flex items-center gap-3">
          <TbMoodCrazyHappy /> Psychotesty: {formatDate(profile.psycho_check)} (
          <span
            className={
              psychoCheckDaysLeft < 0
                ? "text-red-600"
                : psychoCheckDaysLeft < 30
                  ? "text-orange-400"
                  : "text-primary-700"
            }
          >
            {psychoCheckDaysLeft < 0
              ? `Prehliadka vypršala pred ${Math.abs(psychoCheckDaysLeft)} dňami`
              : `Do prehliadky ostáva ${psychoCheckDaysLeft} dní`}
          </span>
          )
        </p>
      )}
    </section>
  );
}
