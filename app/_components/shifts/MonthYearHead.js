export default function MonthYearHead({ children }) {
  return (
    <div className="h-[2.5rem] border-b py-2 text-center">
      <span className="font-semibold text-primary-700">{children}</span>
    </div>
  );
}
