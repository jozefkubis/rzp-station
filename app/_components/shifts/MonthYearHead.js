export default function MonthYearHead({ children }) {
  return (
    <div className="flex md:h-[3.5rem] h-[2.8rem] justify-center md:px-8 md:py-2 pb-2 text-sm md:text-base">
      <span className="flex md:w-[25rem] items-center justify-between md:gap-6 gap-2 font-semibold text-primary-700">
        {children}
      </span>
    </div>
  );
}
