const COLOR_STYLES = {
  blue: { bg: "bg-blue-100", text: "text-blue-700" },
  yellow: { bg: "bg-yellow-100", text: "text-yellow-700" },
  red: { bg: "bg-red-100", text: "text-red-700" },
  green: { bg: "bg-green-100", text: "text-green-700" },
  pink: { bg: "bg-pink-100", text: "text-pink-700" },
  slate: { bg: "bg-slate-100", text: "text-slate-700" },
};

export default function Stat({ icon, title, value, color = "blue" }) {
  const { bg, text } = COLOR_STYLES[color] ?? COLOR_STYLES.blue;

  return (
    <div className="grid grid-cols-[4rem_1fr] grid-rows-2 gap-x-4 gap-y-1 rounded-md border border-gray-200 bg-white px-4 py-12">
      {/* ikona */}
      <div
        className={`${bg} row-span-2 flex aspect-square items-center justify-center rounded-full`}
      >
        <span className={`${text}`}>{icon}</span>
      </div>

      {/* nadpis + hodnota */}
      <h5 className="2xl:text-md self-end text-xs font-semibold uppercase tracking-wide text-primary-700">
        {title}
      </h5>
      <p className="text-sm font-medium leading-none text-primary-700 2xl:text-2xl">
        {value}
      </p>
    </div>
  );
}
