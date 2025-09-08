"use client";

export default function StatisticsMain({ shifts }) {

  const thisYear = new Date().getFullYear();

  // pripravíme si polia s normalizovanými hodnotami
  const rows = shifts.map((s) => ({
    name: s.profiles.full_name,
    type: String(s.shift_type || "")
      .toUpperCase()
      .trim(),
    request: String(s.request_type || "")
      .toUpperCase()
      .trim(),
    date: s.date.slice(0, 4),
  }));

  const thisYearRows = rows.filter((r) => r.date === String(thisYear));

  const statsObj = thisYearRows.reduce((acc, { name, type, request }) => {
    if (!acc[name]) acc[name] = { D: 0, N: 0, RD: 0, PN: 0, X: 0 };

    // --- D a N zo shift_type ---
    if (["D", "VD", "ZD"].includes(type)) acc[name].D++;
    if (["N", "VN", "ZN"].includes(type)) acc[name].N++;
    if (["DN", "ND"].includes(type)) {
      acc[name].D++;
      acc[name].N++;
    }

    // --- RD a PN zo shift_type (pre istotu povoľ "RD..." / "PN...")
    if (type.startsWith("RD")) acc[name].RD++;
    if (type.startsWith("PN")) acc[name].PN++;

    // --- X len z request_type (xD, xN, X...)
    if (["X", "XD", "XN"].includes(request)) acc[name].X++;

    return acc;
  }, {});

  const stats = Object.entries(statsObj)
    .map(([name, counts]) => ({ name, ...counts }))
    .sort((a, b) => a.name.localeCompare(b.name, "sk"));

  return (
    <div className="h-screen">
      <div className="flex h-full flex-col gap-4 p-[8rem]">
        <div className="py-10">
          <h1 className="text-center text-4xl font-bold text-primary-700">
            Štatistiky {thisYear}
          </h1>
        </div>
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
                <td className="border px-4 py-2 text-left font-semibold text-primary-700">
                  {r.name}
                </td>
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
