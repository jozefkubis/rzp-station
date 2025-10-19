export default function MobileTodayDayShift({
  label,
  dateString,
  dayData = [],
}) {
  const hasData = dayData && dayData.length > 0;

  const localDate = new Date(dateString).toLocaleDateString("sk-SK", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div
      className="mt-6 flex flex-col gap-3 rounded-2xl border border-amber-100/70 bg-gradient-to-br from-white via-amber-50 to-amber-100 px-5 py-4 shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-200/60 active:scale-95 active:shadow-[0_2px_6px_rgba(0,0,0,0.05)]"
      tabIndex={0}
    >
      {/* Nadpis a čas */}
      {label && (
        <h5 className="text-xs font-semibold uppercase tracking-wide text-amber-700">
          {label}: {localDate}{" "}
          <span className="text-[11px] text-amber-600">06:00 – 18:00</span>
        </h5>
      )}

      {/* Mená pod sebou */}
      <div className="flex flex-col gap-2 text-base font-medium text-amber-800">
        {hasData ? (
          dayData.map((name, i) => (
            <span
              key={i}
              className="flex items-center justify-between rounded-xl border border-amber-100/70 bg-white/70 px-4 py-2 text-amber-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
            >
              {i + 1}. {name}
            </span>
          ))
        ) : (
          <span className="text-slate-400">Žiadne údaje</span>
        )}
      </div>
    </div>
  );
}
