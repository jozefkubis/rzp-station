"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import ArrowBackStatistics from "./ArrowBackStatistics";
import ArrowForwardStatistics from "./ArrowForwordStatistics";
import YearHeadStatistics from "./YearHeadStatistics";

export default function StatisticsMain({ shifts, statsOffset }) {
  const router = useRouter();

  // načítaj z sessionStorage ak existuje
  const [y, setY] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("statsOffset");
      if (stored !== null) return Number(stored);
    }
    return Number(statsOffset) || 0;
  });

  useEffect(() => {
    sessionStorage.setItem("statsOffset", String(y));
  }, [y]);

  const thisYear = new Date().getFullYear() + y;

  const rows = useMemo(() => (
    shifts.map((s) => ({
      name: s.profiles.full_name,
      type: String(s.shift_type || "").toUpperCase().trim(),
      request: String(s.request_type || "").toUpperCase().trim(),
      date: s.date.slice(0, 4),
    }))
  ), [shifts]);

  const thisYearRows = rows.filter((r) => r.date === String(thisYear));

  const statsObj = thisYearRows.reduce((acc, { name, type, request }) => {
    if (!acc[name]) acc[name] = { D: 0, N: 0, RD: 0, PN: 0, X: 0 };

    if (["D", "VD", "ZD"].includes(type)) acc[name].D++;
    if (["N", "VN", "ZN"].includes(type)) acc[name].N++;
    if (["DN", "ND"].includes(type)) { acc[name].D++; acc[name].N++; }

    if (type.startsWith("RD")) acc[name].RD++;
    if (type.startsWith("PN")) acc[name].PN++;

    if (["X", "XD", "XN"].includes(request)) acc[name].X++;

    return acc;
  }, {});

  const stats = Object.entries(statsObj)
    .map(([name, counts]) => ({ name, ...counts }))
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
    <div className="h-screen">
      <div className="flex h-full flex-col gap-4 px-[8rem] py-[4rem]">
        <YearHeadStatistics>
          <ArrowBackStatistics goToPrevYear={goToPrevYear} />
          Štatistiky {thisYear}
          <ArrowForwardStatistics goToNextYear={goToNextYear} />
        </YearHeadStatistics>

        <table className="w-full table-fixed border-collapse border border-gray-300 text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">Meno</th>
              <th className="border px-4 py-2">D</th>
              <th className="border px-4 py-2">N</th>
              <th className="border px-4 py-2">RD</th>
              <th className="border px-4 py-2">PN</th>
              <th className="border px-4 py-2">X</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((r) => (
              <tr key={r.name} className="hover:bg-gray-50">
                <td className="border px-4 py-2 text-left font-semibold text-primary-700">{r.name}</td>
                <td className="border px-4 py-2">{r.D}</td>
                <td className="border px-4 py-2">{r.N}</td>
                <td className="border px-4 py-2">{r.RD}</td>
                <td className="border px-4 py-2">{r.PN}</td>
                <td className="border px-4 py-2">{r.X}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
