const COLOR_STYLES = {
  blue: { bg: "bg-blue-100", text: "text-blue-700" },
  yellow: { bg: "bg-yellow-100", text: "text-yellow-700" },
  red: { bg: "bg-red-100", text: "text-red-700" },
  green: { bg: "bg-green-100", text: "text-green-700" },
  pink: { bg: "bg-pink-100", text: "text-pink-700" },
  slate: { bg: "bg-slate-100", text: "text-slate-700" },
  orange: { bg: "bg-orange-100", text: "text-orange-700" },
  purple: { bg: "bg-purple-100", text: "text-purple-700" },
};

export default function Stat({ icon, title, value, color = "blue" }) {
  const { bg, text } = COLOR_STYLES[color] ?? COLOR_STYLES.blue;

  return (
    <div className="flex items-center justify-between gap-4 rounded-md border border-gray-200 bg-white px-4 py-2 shadow-lg ring-1 ring-slate-300">
      {/* Ikona */}
      <div
        className={`${bg} flex aspect-square h-10 w-10 items-center justify-center rounded-full`}
      >
        <span className={`${text} text-xl md:text-2xl lg:text-3xl`}>
          {icon}
        </span>
      </div>

      {/* Nadpis a hodnota vedľa seba */}
      <div className="flex flex-1 items-center justify-between">
        <h5 className="text-xs font-semibold uppercase tracking-wide text-primary-700 md:text-sm 2xl:text-[0.8rem]">
          {title}
        </h5>
        <p className="text-sm font-medium text-primary-700 md:text-base 2xl:text-lg">
          {value}
        </p>
      </div>
    </div>
  );
}
