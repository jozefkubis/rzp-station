export default function MonthYearHead({ children }) {
  return (
    <div className="flex h-[2.8rem] justify-center pb-4 text-sm md:h-[3.5rem] md:px-8 md:py-2 md:text-base">
      <span className="relative flex items-center justify-between gap-2 font-semibold text-primary-700 md:w-[25rem] md:gap-6">
        {children}
      </span>
    </div>
  );
}
