"use client";

function formatSkDate(dateString) {
  try {
    const s = new Date(dateString).toLocaleDateString("sk-SK", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    return s.charAt(0).toUpperCase() + s.slice(1);
  } catch {
    return dateString ?? "";
  }
}

export default function MobileMainTaskToday({
  dayData,
  dateString,
  label,
  tasks = [],
}) {
  const localDate = formatSkDate(dateString);

  return (
    <section
      className="rounded-2xl border border-amber-100/70 bg-gradient-to-br from-white via-amber-50 to-amber-100 px-5 py-4 shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-200/60 active:scale-95 active:shadow-[0_2px_6px_rgba(0,0,0,0.05)]"
      tabIndex={0}
    >
      {/* Header */}
      {label && (
        <h5 className="mb-3 text-xs font-semibold uppercase tracking-wide text-amber-700">
          {label}: {localDate}
        </h5>
      )}

      {/* Zoznam úloh */}
      {tasks.length > 0 ? (
        <ol className="space-y-2">
          {tasks.map((task, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-[6px] inline-block h-2 w-2 shrink-0 rounded-full bg-amber-300/70" />
              <span className="text-sm font-medium leading-snug text-amber-800">
                {i + 1}. {task}
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <div className="rounded-xl border border-white/70 bg-white/60 px-3 py-2 text-sm font-medium text-slate-500">
          Žiadne úlohy
        </div>
      )}
    </section>
  );
}
