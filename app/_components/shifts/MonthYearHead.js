export default function MonthYearHead({ children }) {
  return (
    <div className="flex h-[3.5rem] justify-center border-b px-8 py-2">
      <span className="flex w-[25rem] items-center justify-between gap-6 font-semibold text-primary-700">
        {children}
      </span>
    </div>
  );
}
