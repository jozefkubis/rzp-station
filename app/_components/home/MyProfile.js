"use client";

import { getDaysUntilNextMedCheck } from "@/app/_lib/helpers/functions";
import { useQuery } from "@tanstack/react-query";
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
import Skeleton from "./ProfileSkeleton";
import Stat from "./Stat";

/* helpery -------------------------------------------------------------- */
const countShiftsByType = (shifts) =>
  shifts.reduce(
    (a, s) => {
      if (s.shift_type === "DN" || s.shift_type === "ND") {
        a.D += 1;
        a.N += 1;
      } else {
        a[s.shift_type] = (a[s.shift_type] || 0) + 1;
      }
      return a;
    },
    { D: 0, N: 0, RD: 0, vD: 0, vN: 0, zD: 0, zN: 0, DN: 0, ND: 0 },
  );

const hours = (n, per = 12) => n * per;
const fmtDaysLeft = (v) => (v < 0 ? `- ${Math.abs(v)} dní` : `+ ${v} dní`);

/* klientský komponent -------------------------------------------------- */
export default function MyProfile({ offset = 0 }) {
  /* React‑Query -------------------------------------------------------- */
  const { data, error, isLoading } = useQuery({
    queryKey: ["profile", offset],
    queryFn: () => fetch(`/api/profile?m=${offset}`).then((r) => r.json()),
    staleTime: 60_000,
  });

  if (isLoading) return <Skeleton />;
  if (error || data?.error)
    return <p className="text-red-600">Chyba načítania</p>;

  const { profile, shifts } = data;

  /* výpočty ------------------------------------------------------------ */
  const target = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + offset,
    1,
  );
  const weekdays = getDaysArray(
    target.getFullYear(),
    target.getMonth() + 1,
  ).filter((d) => !d.isWeekend).length;
  const normHours = weekdays * 7.5;

  const c = countShiftsByType(shifts);
  const dayShifts = c.D + c.vD + c.zD;
  const nightShifts = c.N + c.vN + c.zN;
  const holidayShifts = c.RD;

  const totalShifts = dayShifts + nightShifts;
  const rdHours = hours(holidayShifts, 7.5);
  const totalHours = hours(totalShifts) + rdHours;
  const overtime = totalHours - normHours;

  const medLeft = getDaysUntilNextMedCheck(profile.medCheckDate);
  const psyLeft = profile.psycho_check
    ? getDaysUntilNextMedCheck(profile.psycho_check)
    : null;

  /* render ------------------------------------------------------------- */
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
