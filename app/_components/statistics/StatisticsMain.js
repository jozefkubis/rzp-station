"use client";

import { getSlovakHolidaysForYear } from "@/app/_lib/holidays";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import WarningNotice from "../WarningNotice";
import ArrowBackStatistics from "./ArrowBackStatistics";
import ArrowForwardStatistics from "./ArrowForwordStatistics";
import { StatisticsLegend } from "./StatisticsLegend";
import YearHeadStatistics from "./YearHeadStatistics";

export default function StatisticsMain({ shifts, statsOffset, admin }) {
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
    <div className="max-h-screeen-md h-[100dvh] overflow-auto md:h-full">
      <div className="flex h-full flex-col overflow-auto px-3 md:overflow-hidden md:px-[8rem] md:py-[4rem] md:pb-24">
        {/* Sticky header pre mobile, pôvodné farby od md */}
        <YearHeadStatistics className="sticky top-0 z-20 -mx-3 bg-primary-900 px-3 py-2 text-white md:static md:-mx-0 md:bg-transparent md:px-0 md:text-primary-700">
          <ArrowBackStatistics goToPrevYear={goToPrevYear} />
          Štatistiky {thisYear}
          <ArrowForwardStatistics goToNextYear={goToNextYear} />
        </YearHeadStatistics>

        {stats.length === 0 ? (
          <div className="flex h-60 items-center justify-center text-center text-base text-primary-700 md:text-3xl">
            Žiadne štatistiky pre tento rok nie sú k dispozícii
          </div>
        ) : (
          <>
            {/* --- MOBIL: karty --- */}
            {admin === "ÁNO" ? (
              <div className="my-3 space-y-3 md:hidden">
                {stats.map((r) => (
                  <div
                    key={r.name}
                    className="rounded-xl border border-primary-100/60 bg-white p-3 text-primary-600 shadow-lg"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="truncate font-semibold">{r.name}</div>
                      {/* Spolu v badge vpravo */}
                      <span className="rounded-md bg-white/10 px-2 py-1 text-xs font-semibold">
                        Spolu: {r.Spolu}
                      </span>
                    </div>

                    {/* Riadok štítkov s číslami */}
                    <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                      <span className="rounded-md bg-gradient-to-br from-white to-primary-100 px-2 py-1 text-xs">
                        D: <b>{r.D}</b>
                      </span>
                      <span className="rounded-md bg-gradient-to-br from-white to-primary-100 px-2 py-1 text-xs">
                        N: <b>{r.N}</b>
                      </span>
                      <span className="rounded-md bg-gradient-to-br from-white to-primary-100 px-2 py-1 text-xs">
                        RD: <b>{r.RD}</b>
                      </span>
                    </div>

                    <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                      <span className="rounded-md bg-gradient-to-br from-white to-primary-100 px-2 py-1 text-xs">
                        PN: <b>{r.PN}</b>
                      </span>
                      <span className="rounded-md bg-gradient-to-br from-white to-primary-100 px-2 py-1 text-xs">
                        X: <b>{r.X}</b>
                      </span>
                      <span className="rounded-md bg-gradient-to-br from-white to-primary-100 px-2 py-1 text-xs">
                        ŠS: <b>{r.ŠS}</b>
                      </span>
                    </div>
                  </div>
                ))}

                {/* Legenda ako collapsible na mobile */}
                <details className="rounded-lg border border-primary-100/60 bg-white p-3 text-primary-600 shadow-lg">
                  <summary className="cursor-pointer select-none font-semibold">
                    Legenda
                  </summary>
                  <div className="mt-2 opacity-90">
                    <StatisticsLegend />
                  </div>
                </details>
              </div>
            ) : (
              <div className="mt-6 md:hidden">
                <WarningNotice />
              </div>
            )}

            {/* --- DESKTOP/MD+: tabuľka + legenda --- */}
            <div className="hidden md:block">
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full 2xl:min-w-[56rem] table-fixed border-collapse text-center">
                  <thead className="bg-gray-100">
                    <tr className="text-xs 2xl:text-base">
                      <th className="md:w-[11rem] 2xl:w-[13rem] border px-3 md:py-2 2xl:py-3 text-left">
                        Meno
                      </th>
                      <th className="border px-4 md:py-2 2xl:py-3">D</th>
                      <th className="border px-4 md:py-2 2xl:py-3">N</th>
                      <th className="border px-4 md:py-2 2xl:py-3">SP</th>
                      <th className="border px-4 md:py-2 2xl:py-3">RD</th>
                      <th className="border px-4 md:py-2 2xl:py-3">PN</th>
                      <th className="border px-4 md:py-2 2xl:py-3">X</th>
                      <th className="border px-4 md:py-2 2xl:py-3">ŠS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admin === "ÁNO" ? (
                      stats.map((r) => (
                        <tr key={r.name} className="hover:bg-gray-50 text-xs 2xl:text-base">
                          <td className="border px-3 md:py-2 2xl:py-3 text-left font-semibold text-primary-700">
                            {r.name}
                          </td>
                          <td className="border px-4 md:py-2 2xl:py-3">{r.D}</td>
                          <td className="border px-4 md:py-2 2xl:py-3">{r.N}</td>
                          <td className="border px-4 md:py-2 2xl:py-3">{r.Spolu}</td>
                          <td className="border px-4 md:py-2 2xl:py-3">{r.RD}</td>
                          <td className="border px-4 md:py-2 2xl:py-3">{r.PN}</td>
                          <td className="border px-4 md:py-2 2xl:py-3">{r.X}</td>
                          <td className="border px-4 md:py-2 2xl:py-3">{r.ŠS}</td>
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
              </div>

              <div className="mt-4">
                <StatisticsLegend />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
