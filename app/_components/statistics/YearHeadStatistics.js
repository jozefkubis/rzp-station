export default function YearHeadStatistics({ children }) {
  return (
    <div className="flex h-[3.5rem] justify-center px-8 py-2">
      <span className="flex w-[15rem] items-center justify-between gap-6 font-semibold text-primary-700">
        {children}
      </span>
    </div>
  );
}
