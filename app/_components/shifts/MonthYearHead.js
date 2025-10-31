export default function MonthYearHead({ children }) {
  return (
    <div className="hidden h-[2.8rem] justify-center pb-2 text-sm md:flex md:h-[3.5rem] md:px-8 md:py-2 md:text-base">
      <span className="flex items-center justify-between gap-2 font-semibold text-primary-700 md:w-[25rem] md:gap-6">
        {children}
      </span>
    </div>
  );
}
