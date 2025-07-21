export default function MonthYearHead({ children }) {
  return (
    <div className="h-[2.5rem] border-b py-2 px-8 text-center">
      <span className="font-semibold text-primary-700 flex justify-center gap-6 items-center">{children}</span>
    </div>
  );
}
