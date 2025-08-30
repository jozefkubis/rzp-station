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
    <div className="shadow-sm grid grid-cols-[auto_1fr] grid-rows-2 gap-x-4 gap-y-1 rounded-md border border-gray-200 bg-white px-4 py-6">
      {/* ikona */}
      <div
        className={`${bg} row-span-2 flex aspect-square items-center justify-center rounded-full`}
      >
        <span className={`${text} text-xl md:text-2xl lg:text-3xl`}>{icon}</span>

      </div>

      {/* nadpis + hodnota */}
      <h5 className="2xl:text-[0.8rem] self-end text-[0.6rem] font-semibold uppercase tracking-wide text-primary-700">
        {title}
      </h5>
      <p className="text-sm font-medium leading-none text-primary-700 2xl:text-lg">
        {value}
      </p>
    </div>
  );
}
