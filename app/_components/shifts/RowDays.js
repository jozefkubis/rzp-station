export default function RowDays({ children, cellBg, onSelect, dateStr }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(dateStr)}
      className={`text-[0.7rem] md:text-[0.9rem] flex h-5 md:h-7 cursor-pointer items-center justify-center border-l border-slate-200 hover:bg-blue-100 ${cellBg} border-b border-slate-200`}
    >
      {children}
    </button>
  );
}
