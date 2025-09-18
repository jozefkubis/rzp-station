"use client";

import { getDaysUntilNextMedCheck } from "@/app/_lib/helpers/functions";
import { useEffect, useMemo } from "react";
import { getDaysArray } from "../shifts/helpers_shifts";

import ArrowBackDashboard from "./ArrowBackDashboard";
import ArrowForwDashboard from "./ArrowForwDashboard";
import Stat from "./Stat";

import {
  TbBed,
  TbBrain,
  TbCalendarStats,
  TbClockPlus,
  TbMoonStars,
  TbPlaneDeparture,
  TbStethoscope,
  TbSun,
} from "react-icons/tb";

/* ---------- HELPERS mimo komponentu ---------- */
// počty služieb podľa typu
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
    { D: 0, N: 0, RD: 0, vD: 0, vN: 0, zD: 0, zN: 0, PN: 0 },
  );
}

// hodiny pre daný počet služieb
const hoursForShifts = (count, perShift = 12) => count * perShift;

// formát +- dni do prehliadky
const formatDaysLeft = (v) => (v < 0 ? `- ${Math.abs(v)} dní` : `+ ${v} dní`);

/* -------------------------------------------------------------------------- */
/*                                KOMPONENT                                   */
/* -------------------------------------------------------------------------- */

export default function MyProfile({ profile, shifts, offset, goTo, disabled }) {
  /* uložíme offset do sessionStorage (na zapamätanie medzi reloadmi) */
  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("dashOffset", String(offset));
    }
  }, [offset]);

  /* všetky odvodené výpočty v jednom useMemo */
  const { monthLabel, calculated } = useMemo(() => {
    /* cieľový mesiac podľa offsetu (0 = aktuálny) */
    const targetDate = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + offset,
      1,
    );

    const yearTarget = targetDate.getFullYear();
    const monthTarget = targetDate.getMonth() + 1; // 1-12

    /* služby len pre daný mesiac */
    const shiftsForMonth = (Array.isArray(shifts) ? shifts : []).filter(
      ({ date }) => {
        const [year, month] = date.split("-").map(Number);
        return year === yearTarget && month === monthTarget;
      },
    );

    /* norma (počet pracovných dní × 7.5 h) */
    const weekdaysCount = getDaysArray(yearTarget, monthTarget).filter(
      (d) => !d.isWeekend,
    ).length;
    const normHours = weekdaysCount * 7.5;

    /* počty služieb podľa typu */
    const counts = countShiftsByType(shiftsForMonth);

    const dayShiftCount = counts.D + counts.vD + counts.zD; // hlavný + vedľajší + záložný deň
    const nightShiftCount = counts.N + counts.vN + counts.zN; // hlavný + vedľajší + záložný noc
    const holidayShiftCount = counts.RD;
    const sickShiftCount = counts.PN;

    /* hodiny z číselných požiadaviek (spodný riadok) */
    const extraHours = shiftsForMonth.reduce((sum, s) => {
      const n = Number(s.request_hours);
      return isNaN(n) ? sum : sum + n;
    }, 0);

    /* sumarizácia hodín */
    const totalShiftCount = dayShiftCount + nightShiftCount;
    const holidayHours = hoursForShifts(holidayShiftCount, 7.5);
    const sickHours = hoursForShifts(sickShiftCount, 7.5);
    const totalHours =
      hoursForShifts(totalShiftCount) + holidayHours + sickHours + extraHours;
    const overtimeHours = totalHours - normHours;

    /* lokalizovaný nadpis mesiaca */
    const monthLabel = targetDate
      .toLocaleDateString("sk-SK", { month: "long", year: "numeric" })
      .replace(/^./, (char) => char.toUpperCase());

    return {
      monthLabel,
      calculated: {
        dayShiftCount,
        nightShiftCount,
        holidayShiftCount,
        totalShiftCount,
        holidayHours,
        totalHours,
        overtimeHours,
        sickHours,
        sickShiftCount
      },
    };
  }, [shifts, offset]);

  /* dni do periodických prehliadok */
  const medDate = profile?.medCheckDate ?? null;
  const psychoDate = profile?.psycho_check ?? null;

  const medCheckLeft = formatDaysLeft(
    getDaysUntilNextMedCheck(medDate) // helper musí zniesť null
  );

  const psychoCheckLeft = psychoDate
    ? formatDaysLeft(getDaysUntilNextPsycho(psychoDate))
    : "—";

  /* -------------------- render -------------------- */
  return (
    <div>
      {/* navigácia medzi mesiacmi */}
      <div className="flex w-full items-center justify-end gap-6 px-8 py-4 font-semibold text-primary-700">
        <div className="flex min-w-60 justify-between">
          <ArrowBackDashboard offset={offset} goTo={goTo} disabled={disabled} />
          <h3 className="text-lg">{monthLabel}</h3>
          <ArrowForwDashboard offset={offset} goTo={goTo} disabled={disabled} />
        </div>
      </div>

      {/* kachličky so štatistikou */}
      <section className="grid w-full grid-cols-2 gap-4 rounded-2xl bg-white p-6 shadow-sm sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8">
        <Stat
          title="Služby mesiac"
          color="green"
          icon={<TbCalendarStats />}
          value={`${calculated.totalShiftCount} / ${calculated.totalHours} h.`}
        />
        <Stat
          title="Denné služby"
          color="yellow"
          icon={<TbSun />}
          value={`${calculated.dayShiftCount} / ${hoursForShifts(calculated.dayShiftCount)} h.`}
        />
        <Stat
          title="Nočné služby"
          color="slate"
          icon={<TbMoonStars />}
          value={`${calculated.nightShiftCount} / ${hoursForShifts(calculated.nightShiftCount)} h.`}
        />
        <Stat
          title="Dovolenka"
          color="orange"
          icon={<TbPlaneDeparture />}
          value={`${calculated.holidayShiftCount} / ${calculated.holidayHours} h.`}
        />
        <Stat
          title="PN"
          color="purple"
          icon={<TbBed />}
          value={`${calculated.sickShiftCount} / ${calculated.sickHours} h.`}
        />
        <Stat
          title="Nadčas"
          color="green"
          icon={<TbClockPlus />}
          value={`${calculated.overtimeHours} h.`}
        />
        <Stat
          title="Lek. prehliadka"
          color="blue"
          icon={<TbStethoscope />}
          value={medCheckLeft}
        />
        {psychoCheckLeft != null && (
          <Stat
            title="Psychotesty"
            color="pink"
            icon={<TbBrain />}
            value={psychoCheckLeft}
          />
        )}
      </section>
    </div>
  );
}
