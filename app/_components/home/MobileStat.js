const COLOR_STYLES = {
  blue: { from: "from-blue-50", to: "to-blue-100", text: "text-blue-700" },
  yellow: { from: "from-amber-50", to: "to-amber-100", text: "text-amber-700" },
  red: { from: "from-rose-50", to: "to-rose-100", text: "text-rose-700" },
  green: {
    from: "from-emerald-50",
    to: "to-emerald-100",
    text: "text-emerald-700",
  },
  pink: { from: "from-pink-50", to: "to-pink-100", text: "text-pink-700" },
  slate: { from: "from-slate-50", to: "to-slate-100", text: "text-slate-700" },
  orange: {
    from: "from-orange-50",
    to: "to-orange-100",
    text: "text-orange-700",
  },
  purple: {
    from: "from-indigo-50",
    to: "to-indigo-100",
    text: "text-indigo-700",
  },
};

export default function MobileStat({ icon, title, value, color = "blue" }) {
  const { from, to, text } = COLOR_STYLES[color] ?? COLOR_STYLES.blue;

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-slate-50 px-5 py-2 shadow-[0_2px_10px_rgba(0,0,0,0.03)] ring-1 ring-slate-100 transition-all duration-200 active:scale-[0.98]">
      {/* Ikona */}
      <div
        className={`bg-gradient-to-br ${from} ${to} flex aspect-square h-11 w-11 items-center justify-center rounded-xl shadow-inner`}
      >
        <span className={`${text} text-xl md:text-2xl lg:text-3xl`}>
          {icon}
        </span>
      </div>

      {/* Nadpis a hodnota */}
      <div className="flex flex-1 items-center justify-between">
        <h5 className="text-xs font-semibold uppercase tracking-wide text-primary-700 md:text-sm">
          {title}
        </h5>
        <p className="text-sm font-semibold text-primary-800 md:text-base">
          {value}
        </p>
      </div>
    </div>
  );
}
