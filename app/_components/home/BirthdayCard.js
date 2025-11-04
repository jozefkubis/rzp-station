"use client";

export default function BirthdayCard({ profiles = [] }) {
  // --- Pomocné funkcie (krátke a čitateľné) ---
  const pad2 = (n) => String(n).padStart(2, "0");

  // Očakávame formát YYYY-MM-DD (ako máš v projekte). Ak nie je, vráti null.
  function parseYMD(dateStr) {
    if (typeof dateStr !== "string" || dateStr.length < 10) return null;
    const y = dateStr.slice(0, 4);
    const m = dateStr.slice(5, 7);
    const d = dateStr.slice(8, 10);
    if (!y || !m || !d) return null;
    return { y, m, d };
  }

  // --- Dátumy dnes/mesiac ---
  const now = new Date();
  const todayM = pad2(now.getMonth() + 1);
  const todayD = pad2(now.getDate());
  const thisMonth = todayM;

  // --- Zoznamy (jednoducho, v jednom priechode) ---
  const todayList = [];
  const monthList = [];

  for (const p of profiles) {
    if (!p?.dateOfBirth || !p?.full_name) continue;
    const md = parseYMD(p.dateOfBirth);
    if (!md) continue;

    // dnešní oslávenci
    if (md.m === todayM && md.d === todayD) {
      todayList.push({ id: p.id ?? `${p.full_name}-${md.d}${md.m}`, name: p.full_name });
    }

    // celý mesiac
    if (md.m === thisMonth) {
      monthList.push({
        id: p.id ?? `${p.full_name}-${md.d}${md.m}`,
        // label: `${p.full_name} (${md.d}.${md.m}.${md.y})`,
        label: `${p.full_name} (${md.d}.${md.m})`,
        dayNum: Number(md.d),
      });
    }
  }

  // Prehľad mesiaca – nech je zoradený podľa dňa
  monthList.sort((a, b) => a.dayNum - b.dayNum);

  // Ak nie je čo zobraziť, nerenderuj
  if (todayList.length === 0 && monthList.length === 0) return null;

  const verbToday = todayList.length > 1 ? "majú" : "má";
  const verbMonth = monthList.length > 1 ? "majú" : "má";

  return (
    <section aria-live="polite" className="flex w-full justify-start px-2 pb-2 md:px-6 md:pb-0">
      <div className="flex w-full flex-col gap-2 rounded-2xl bg-gradient-to-r from-pink-50 via-rose-100 to-pink-50 px-4 py-3 text-pink-700 shadow-lg ring-1 ring-pink-200/70 sm:px-5 sm:py-4 md:w-auto md:flex-row md:items-center md:gap-4 md:px-6 md:py-5">
        {/* Ikona */}
        <div className="flex items-center justify-center">
          <span className="motion-safe:animate-bounce text-xl sm:text-2xl md:text-3xl" role="img" aria-label="party">
            🎉
          </span>
        </div>

        {/* Texty */}
        <div className="flex-1">
          {/* Dnes */}
          {todayList.length > 0 && (
            <>
              <p className="text-sm font-semibold sm:text-base md:text-xl">
                Dnes {verbToday} narodeniny{" "}
                <span className="font-bold text-pink-800">
                  {todayList.map((t) => t.name).join(", ")}
                </span>
                !
              </p>

              <div className="mt-2 flex flex-wrap gap-1.5">
                {todayList.map((t) => (
                  <span
                    key={t.id}
                    className="inline-flex items-center rounded-full bg-white/70 px-2.5 py-1 text-xs text-pink-700 shadow ring-1 ring-pink-200 sm:text-sm"
                  >
                    🎂 {t.name}
                  </span>
                ))}
              </div>
            </>
          )}

          {/* Tento mesiac (stručne) */}
          {monthList.length > 0 && (
            <div className="mt-2 text-xs sm:text-sm md:text-base">
              <span className="font-semibold">Tento mesiac {verbMonth} narodeniny: </span>
              {monthList.slice(0, 8).map((m, i) => (
                <span key={m.id} className="text-pink-800">
                  {m.label}
                  {i < Math.min(8, monthList.length) - 1 ? ", " : ""}
                </span>
              ))}
              {monthList.length > 8 && (
                <span className="text-pink-800">, +{monthList.length - 8} ďalších</span>
              )}
            </div>
          )}
        </div>

        {/* Dekor – len desktop */}
        <div className="hidden items-center gap-2 md:flex">
          <span className="text-lg" role="img" aria-label="balloon">🎈</span>
          <span className="text-lg" role="img" aria-label="gift">🎁</span>
        </div>
      </div>
    </section>
  );
}
