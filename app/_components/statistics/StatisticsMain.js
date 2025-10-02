"use client";

import { getSlovakHolidaysForYear } from "@/app/_lib/holidays";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import WarningNotice from "../WarningNotice";
import ArrowBackStatistics from "./ArrowBackStatistics";
import ArrowForwardStatistics from "./ArrowForwordStatistics";
import { StatisticsLegend } from "./StatisticsLegend";
import YearHeadStatistics from "./YearHeadStatistics";

export default function StatisticsMain({ shifts, statsOffset, status }) {
  const router = useRouter();

  // 1) Výber roka podľa offsetu
  const [y, setY] = useState(statsOffset || 0);
  const thisYear = new Date().getFullYear() + y;

  // 2) Sviatky
  const holidays = useMemo(() => {
    return new Set(getSlovakHolidaysForYear(thisYear));
  }, [thisYear]);

  // 3) Normalizácia vstupu
  const rows = useMemo(() => {
    return shifts.map((s) => ({
      name: s.profiles.full_name,
      type: (s.shift_type || "").toUpperCase(),
      request: (s.request_type || "").toUpperCase(),
      dateFull: s.date.slice(0, 10),
      year: s.date.slice(0, 4),
    }));
  }, [shifts]);

  // 4) Len tento rok
  const thisYearRows = rows.filter((r) => r.year === String(thisYear));

  // 5) Redukcia na štatistiky
  const statsObj = thisYearRows.reduce(
    (acc, { name, type, request, dateFull }) => {
      if (!acc[name]) {
        acc[name] = { D: 0, N: 0, RD: 0, PN: 0, X: 0, ŠS_D: 0, ŠS_N: 0 };
      }

      const isDay = ["D", "VD", "ZD"].includes(type);
      const isNight = ["N", "VN", "ZN"].includes(type);
      const isBoth = ["DN", "ND"].includes(type);

      if (isDay) acc[name].D++;
      if (isNight) acc[name].N++;
      if (isBoth) {
        acc[name].D++;
        acc[name].N++;
      }

      if (type.startsWith("RD")) acc[name].RD++;
      if (type.startsWith("PN")) acc[name].PN++;
      if (["X", "XD", "XN"].includes(request)) acc[name].X++;

      const workedHolidays = isDay || isNight || isBoth;
      if (workedHolidays && holidays.has(dateFull)) {
        if (isDay) acc[name].ŠS_D++;
        if (isNight) acc[name].ŠS_N++;
        if (isBoth) {
          acc[name].ŠS_D++;
          acc[name].ŠS_N++;
        }
      }

      return acc;
    },
    {},
  );

  // 6) Pole štatistík
  const stats = Object.entries(statsObj)
    .map(([name, counts]) => ({
      name,
      ...counts,
      ŠS: counts.ŠS_D + counts.ŠS_N,
      Spolu: counts.D + counts.N,
    }))
    .sort((a, b) => a.name.localeCompare(b.name, "sk"));

  // 7) Navigácia
  function goToNextYear() {
    const next = y + 1;
    setY(next);
    router.push(`/statistics?y=${next}`);
  }
  function goToPrevYear() {
    const prev = y - 1;
    setY(prev);
    router.push(`/statistics?y=${prev}`);
  }

  return (
    <div className="h-screen">
      <div className="flex h-full flex-col px-[8rem] py-[4rem]">
        <YearHeadStatistics>
          <ArrowBackStatistics goToPrevYear={goToPrevYear} />
          Štatistiky {thisYear}
          <ArrowForwardStatistics goToNextYear={goToNextYear} />
        </YearHeadStatistics>

        {stats.length === 0 ? (
          <div className="flex h-60 items-center justify-center text-3xl text-primary-700">
            Žiadne štatistiky pre tento rok nie sú k dispozícii
          </div>
        ) : (
          <>
            <table className="w-full table-fixed border-collapse border border-gray-300 text-center">
              <thead className="bg-gray-100">
                <tr>
                  <th className="w-[15rem] border px-4 py-2 text-left">Meno</th>
                  <th className="border px-4 py-2">D</th>
                  <th className="border px-4 py-2">N</th>
                  <th className="border px-4 py-2">Spolu</th>
                  <th className="border px-4 py-2">RD</th>
                  <th className="border px-4 py-2">PN</th>
                  <th className="border px-4 py-2">X</th>
                  <th className="border px-4 py-2">ŠS</th>
                </tr>
              </thead>
              <tbody>
                {status === "admin" ? (
                  stats.map((r) => (
                    <tr key={r.name} className="hover:bg-gray-50">
                      <td className="border px-4 py-2 text-left font-semibold text-primary-700">
                        {r.name}
                      </td>
                      <td className="border px-4 py-2">{r.D}</td>
                      <td className="border px-4 py-2">{r.N}</td>
                      <td className="border px-4 py-2">{r.Spolu}</td>
                      <td className="border px-4 py-2">{r.RD}</td>
                      <td className="border px-4 py-2">{r.PN}</td>
                      <td className="border px-4 py-2">{r.X}</td>
                      <td className="border px-4 py-2">{r.ŠS}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-10 text-lg">
                      <WarningNotice />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <StatisticsLegend />
          </>
        )}
      </div>
    </div>
  );
}
