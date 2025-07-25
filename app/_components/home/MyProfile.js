"use client";

import { getDaysUntilNextMedCheck } from "@/app/_lib/helpers/functions";
import { useEffect, useMemo } from "react";
import { getDaysArray } from "../shifts/helpers_shifts";

import ArrowBackDashboard from "./ArrowBackDashboard";
import ArrowForwDashboard from "./ArrowForwDashboard";
import Stat from "./Stat";

import {
  TbBrain,
  TbCalendarStats,
  TbClockPlus,
  TbMoonStars,
  TbPlaneDeparture,
  TbStethoscope,
  TbSun,
} from "react-icons/tb";

/* ---------- helpers ---------- */
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
    { D: 0, N: 0, RD: 0, vD: 0, vN: 0, zD: 0, zN: 0 },
  );
}

const hoursForShifts = (count, perShift = 12) => count * perShift;

const formatDaysLeft = (value) =>
  value < 0 ? `- ${Math.abs(value)} dní` : `+ ${value} dní`;

// MARK: MY PROFILE COMPONENT
export default function MyProfile({ profile, shifts, offset, goTo, disabled }) {

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("dashOffset", String(offset));
    }
  }, [offset]);

  /* vypočítame všetko, čo závisí od offsetu a shifts */
  const { monthLabel, calculated } = useMemo(() => {
    const targetDate = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + offset,
      1,
    );

    /* filtrovanie na konkrétny mesiac */
    const yearTarget = targetDate.getFullYear();
    const monthTarget = targetDate.getMonth() + 1; // 1‑12

    const shiftsForMonth = (Array.isArray(shifts) ? shifts : []).filter(
      ({ date }) => {
        const [year, month] = date.split("-").map(Number);
        return year === yearTarget && month === monthTarget;
      },
    );

    /* norma hodín */
    const weekdaysCount = getDaysArray(yearTarget, monthTarget).filter(
      (d) => !d.isWeekend,
    ).length;
    const normHours = weekdaysCount * 7.5;

    /* počty služieb */
    const counts = countShiftsByType(shiftsForMonth);

    const dayShiftCount =
      counts.D + counts.vD + counts.zD; /* hlavný + vedľajší + záložný deň */
    const nightShiftCount =
      counts.N + counts.vN + counts.zN; /* hlavný + vedľajší + záložný noc */
    const holidayShiftCount = counts.RD;

    const totalShiftCount = dayShiftCount + nightShiftCount;
    const holidayHours = hoursForShifts(holidayShiftCount, 7.5);
    const totalHours = hoursForShifts(totalShiftCount) + holidayHours;
    const overtimeHours = totalHours - normHours;

    /* nadpis mesiaca */
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
      },
    };
  }, [shifts, offset]);

  /* dni k prehliadkam */
  const medCheckLeft = formatDaysLeft(
    getDaysUntilNextMedCheck(profile.medCheckDate),
  );
  const psychoCheckLeft =
    profile.psycho_check !== null
      ? formatDaysLeft(getDaysUntilNextMedCheck(profile.psycho_check))
      : null;

  /* ---------- render ---------- */
  return (
    <div>
      {/* navigácia mesiaca */}
      <div className="flex w-full items-center justify-end gap-6 px-8 py-4 font-semibold text-primary-700">
        <div className="flex min-w-60 justify-between">
          <ArrowBackDashboard offset={offset} goTo={goTo} disabled={disabled} />
          <h3 className="text-lg">{monthLabel}</h3>
          <ArrowForwDashboard offset={offset} goTo={goTo} disabled={disabled} />
        </div>
      </div>

      {/* kachličky */}
      <section className="grid w-full grid-cols-2 gap-4 rounded-2xl bg-white p-6 shadow-sm sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7">
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
          color="green"
          icon={<TbPlaneDeparture />}
          value={`${calculated.holidayShiftCount} / ${calculated.holidayHours} h.`}
        />
        <Stat
          title="Nadčas"
          color="red"
          icon={<TbClockPlus />}
          value={`${calculated.overtimeHours} h.`}
        />
        <Stat
          title="Lek. prehliadka"
          color="blue"
          icon={<TbStethoscope />}
          value={medCheckLeft}
        />
        {psychoCheckLeft !== null && (
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
