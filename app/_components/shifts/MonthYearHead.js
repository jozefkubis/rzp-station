export default function MonthYearHead({ children }) {
  return (
    <div className="h-[2.5rem] border-b py-2 px-8 flex justify-center">
      <span className="font-semibold text-primary-700 flex justify-between gap-6 items-center w-[25rem]">{children}</span>
    </div>
  );
}
