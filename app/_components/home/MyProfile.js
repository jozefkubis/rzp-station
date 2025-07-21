import {
  getProfile,
  getShiftsForProfileForMonth,
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

/**
 * Spočíta, koľko služieb každého typu (D/N/RD) sa nachádza v poli.
 * Vracia objekt napr. `{ D: 4, N: 2, RD: 1... }`.
 */
function countShiftsByType(shifts) {
  return shifts.reduce(
    (acc, shift) => {
      if (shift.shift_type === "DN" || shift.shift_type === "ND") {
        acc.D += 1;
        acc.N += 1;
      } else {
        acc[shift.shift_type] = (acc[shift.shift_type] || 0) + 1;
      }
      return acc;
    },
    { D: 0, N: 0, RD: 0, vD: 0, vN: 0, zD: 0, zN: 0, DN: 0, ND: 0 },
  );
}

// Pomôcka: prepočet služieb ➜ hodiny (štandardne 12 h na službu)
const hours = (count, perShift = 12) => count * perShift;

// "+ 5 dní" / "- 3 dní" – podľa toho, či termín ešte len príde alebo už minul
const fmtDaysLeft = (value) =>
  value < 0 ? `- ${Math.abs(value)} dní` : `+ ${value} dní`;

export default async function MyProfile() {
  // 1️⃣ Načítame potrebné dáta paralelne
  const user = await getUser();
  const [profile, shifts] = await Promise.all([
    getProfile(user.id),
    getShiftsForProfileForMonth(user.id),
  ]);

  // 2️⃣ Koľko je tento mesiac pracovných dní (bez víkendov)
  const today = new Date();
  const weekdays = getDaysArray(
    today.getFullYear(),
    today.getMonth() + 1,
  ).filter((d) => !d.isWeekend).length;
  const normHours = weekdays * 7.5; // 7.5 h / deň

  // 3️⃣ Spočítame služby jediným prechodom vďaka reduce
  const counts = countShiftsByType(shifts);
  const dayShifts = counts.D + counts.vD + counts.zD;
  const nightShifts = counts.N + counts.vN + counts.zN;
  const holidayShifts = counts.RD;

  const totalShifts = dayShifts + nightShifts;
  const rdHours = hours(holidayShifts, 7.5); // RD má 7.5 h
  const totalHours = hours(totalShifts) + rdHours;
  const overtime = totalHours - normHours;

  // 4️⃣ Dni k / od lek. a psycho prehliadky
  const medLeft = getDaysUntilNextMedCheck(profile.medCheckDate);
  const psyLeft = profile.psycho_check
    ? getDaysUntilNextMedCheck(profile.psycho_check)
    : null;

  // 5️⃣ Render kachličiek
  return (
    <section className="grid w-full grid-cols-2 gap-4 rounded-2xl bg-white p-6 shadow-sm sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7">
      <Stat
        title="Služby mesiac"
        color="green"
        icon={<TbCalendarStats />}
        value={`${totalShifts} / ${totalHours} h.`}
      />
      <Stat
        title="Denné služby"
        color="yellow"
        icon={<TbSun />}
        value={`${dayShifts} / ${hours(dayShifts)} h.`}
      />
      <Stat
        title="Nočné služby"
        color="slate"
        icon={<TbMoonStars />}
        value={`${nightShifts} / ${hours(nightShifts)} h.`}
      />
      <Stat
        title="Dovolenka"
        color="green"
        icon={<TbPlaneDeparture />}
        value={`${holidayShifts} / ${rdHours} h.`}
      />
      <Stat
        title="Nadčas"
        color="red"
        icon={<TbClockPlus />}
        value={`${overtime} h.`}
      />
      <Stat
        title="Lek. prehliadka"
        color="blue"
        icon={<TbStethoscope />}
        value={fmtDaysLeft(medLeft)}
      />
      {psyLeft !== null && (
        <Stat
          title="Psychotesty"
          color="pink"
          icon={<TbBrain />}
          value={fmtDaysLeft(psyLeft)}
        />
      )}
    </section>
  );
}
