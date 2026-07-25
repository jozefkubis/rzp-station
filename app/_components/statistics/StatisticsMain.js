"use client";

import { getSlovakHolidaysForYear } from "@/app/_lib/holidays";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import WarningNotice from "../WarningNotice";
import ArrowBackStatistics from "./ArrowBackStatistics";
import ArrowForwardStatistics from "./ArrowForwordStatistics";
import { getRowBuckets } from "./helpers_statistics";
import { StatisticsLegend } from "./StatisticsLegend";
import YearHeadStatistics from "./YearHeadStatistics";

export default function StatisticsMain({ shifts, statsOffset, admin }) {
  const router = useRouter();

  const [y, setY] = useState(statsOffset || 0);
  const thisYear = new Date().getFullYear() + y;

  const holidays = useMemo(() => {
    return new Set(getSlovakHolidaysForYear(thisYear));
  }, [thisYear]);

  const rows = useMemo(() => {
    return shifts.map((s) => ({
      userId: s.user_id,
      name: s.profiles?.full_name ?? "(bez mena)",
      type: s.shift_type,
      request: s.request_type,
      dateFull: s.date.slice(0, 10),
      year: s.date.slice(0, 4),
    }));
  }, [shifts]);

  const thisYearRows = rows.filter((r) => r.year === String(thisYear));

  const statsObj = thisYearRows.reduce((acc, row) => {
    const { userId, name, type, request, dateFull } = row;
    const key = userId || name;

    if (!acc[key]) {
      acc[key] = { name, D: 0, N: 0, RD: 0, PN: 0, X: 0, SS_D: 0, SS_N: 0 };
    }

    const buckets = getRowBuckets({ shiftType: type, requestType: request });
    const isDay = buckets.has("D");
    const isNight = buckets.has("N");

    if (isDay) acc[key].D++;
    if (isNight) acc[key].N++;
    if (buckets.has("RD")) acc[key].RD++;
    if (buckets.has("PN")) acc[key].PN++;
    if (buckets.has("X")) acc[key].X++;

    if ((isDay || isNight) && holidays.has(dateFull)) {
      if (isDay) acc[key].SS_D++;
      if (isNight) acc[key].SS_N++;
    }

    return acc;
  }, {});

  const stats = Object.entries(statsObj)
    .map(([userId, counts]) => ({
      userId,
      ...counts,
      SS: counts.SS_D + counts.SS_N,
      Spolu: counts.D + counts.N,
    }))
    .sort((a, b) => a.name.localeCompare(b.name, "sk"));

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
      <div className="flex h-full flex-col overflow-auto px-3 md:overflow-hidden md:px-[8rem] md:py-[3rem] md:pb-24">
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
            {admin === "ÁNO" ? (
              <div className="my-3 space-y-2 md:hidden">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {stats.map((r) => (
                    <div
                      key={r.userId}
                      className="rounded-xl border border-primary-100/60 bg-white p-3 text-primary-600 shadow-lg"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="truncate font-semibold">{r.name}</div>
                        <span className="rounded-md bg-white/10 px-2 py-1 text-xs font-semibold">
                          Spolu: {r.Spolu}
                        </span>
                      </div>

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
                          ŠS: <b>{r.SS}</b>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

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

            <div className="hidden md:block">
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full table-fixed border-collapse text-center 2xl:min-w-[56rem]">
                  <thead className="bg-gray-100">
                    <tr className="text-xs 2xl:text-base">
                      <th className="border px-3 text-left md:w-[11rem] md:py-2 2xl:w-[14rem] 2xl:py-3">
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
                        <tr
                          key={r.userId}
                          className="text-xs hover:bg-gray-50 2xl:text-base"
                        >
                          <td className="border px-3 text-left font-semibold text-primary-700 md:py-2 2xl:py-3">
                            {r.name}
                          </td>
                          <td className="border px-4 md:py-2 2xl:py-3">
                            {r.D}
                          </td>
                          <td className="border px-4 md:py-2 2xl:py-3">
                            {r.N}
                          </td>
                          <td className="border px-4 md:py-2 2xl:py-3">
                            {r.Spolu}
                          </td>
                          <td className="border px-4 md:py-2 2xl:py-3">
                            {r.RD}
                          </td>
                          <td className="border px-4 md:py-2 2xl:py-3">
                            {r.PN}
                          </td>
                          <td className="border px-4 md:py-2 2xl:py-3">
                            {r.X}
                          </td>
                          <td className="border px-4 md:py-2 2xl:py-3">
                            {r.SS}
                          </td>
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
